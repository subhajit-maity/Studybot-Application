# Importing and initializing
from langchain_pinecone import PineconeVectorStore
from langchain_cohere import CohereEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage

from dotenv import load_dotenv
import uuid
import json
import re
import os
from textwrap import dedent

load_dotenv()
pc = Pinecone()
embeddings = CohereEmbeddings()

llama3_8b = ChatGroq(model="Llama3-8b-8192", temperature=0.4)
llama3_70b = ChatGroq(model="Llama3-70b-8192") 
mixtral_8x7 = ChatGroq(model="Mixtral-8x7b-32768")
gemma_7b = ChatGroq(model="Gemma-7b-It", temperature=0.3)

# Create index is not present

index_name = "humanaize-education-hackathon-personalization"
# index_name = "test"
CORE_INSTRUCTION_JSON_FILE_PATH = os.path.join(
    os.path.dirname(os.getcwd()), "core.json"
)

INFORMATION_JSON_FILE_PATH = os.path.join(os.path.dirname(os.getcwd()), "info.json")

if index_name not in pc.list_indexes().names():
    pc.create_id(
        name=index_name,
        dimension=4096,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

index = pc.Index(index_name)
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

# Uploads / Updates the value to index


async def upload_value(id, text, metadata):
    metadatas = [{"id": id, "group": metadata["group"]}]
    # print("\033[94m", metadatas, "\033[0m")
    await vectorstore.aadd_texts([text], ids=[id], metadatas=metadatas)


# Create id


def create_id():
    id = str(uuid.uuid4())
    return id


# Retreiving and adding all the core thing using the stored UUID


def get_vector_id(text: str, category: str) -> str:
    # Get id from database
    if category == "core_instruction":
        JSON_FILE_PATH = CORE_INSTRUCTION_JSON_FILE_PATH
    else:
        JSON_FILE_PATH = INFORMATION_JSON_FILE_PATH
    with open(JSON_FILE_PATH, "r") as json_file:
        file_content = json_file.read()
        json_data = json.loads(file_content)
        return json_data[text]


def add_vector_id(text: str, id: str, category: str):
    if category == "core_instruction":
        JSON_FILE_PATH = CORE_INSTRUCTION_JSON_FILE_PATH
    else:
        JSON_FILE_PATH = INFORMATION_JSON_FILE_PATH
    # Add id to database
    with open(JSON_FILE_PATH, "r") as json_file:
        file_content = json_file.read()
        json_data = json.loads(file_content)
    json_data[text] = id

    # print("\033[94mAdding", json_data, text, id, "\033[0m")

    with open(JSON_FILE_PATH, "w") as json_file:
        json.dump(json_data, json_file)


def update_vector_id(old_text: str, new_text: str, id: str, category: str):
    if category == "core_instruction":
        JSON_FILE_PATH = CORE_INSTRUCTION_JSON_FILE_PATH
    else:
        JSON_FILE_PATH = INFORMATION_JSON_FILE_PATH
    # Update id in database

    with open(JSON_FILE_PATH, "r") as json_file:
        file_content = json_file.read()
        json_data = json.loads(file_content)
    json_data.pop(old_text)
    json_data[new_text] = id

    # print("\033[94mUpdating", json_data, old_text, new_text, id, "\033[0m")

    with open(JSON_FILE_PATH, "w") as json_file:
        json.dump(json_data, json_file)


# Filters the Input


def get_filtered_information(input_text: str) -> str:
    filter_info_system_message = dedent("""You are given a message to a teaching bot. You need to filter out if the text from the human contains any command for the bot or anything specific about the user to understand the user's strengths, weaknesses etc. for learning which will later be used to teach them better.
    Commands can include any prefered way of learning the user instructs the teaching bot to follow.
    Informations can include any information about the user's learning style, their weak subjects, their strong subjects, etc.

    Donot include random information that donot help understand about the user.
    Donot include answers or just questions that donot help understand the user's preferences / position.
    Just return the filtered information. Donot add any extra information.

    Try to seperate the text into as many lines as possible. Every sentence should be one piece of information only. Also, each element should be a complete sentence making sense.

    If there is no information to filter, return "".
    If there are multiple information to filter, return them as a paragraph.

    Just return the information in paragraph format. Donot return any heading or any other information.""")

    filter_msg = [
        SystemMessage(content=filter_info_system_message),
        HumanMessage(content=f"user's message: {input_text}"),
    ]

    filtered_text = llama3_70b.invoke(filter_msg).content

    return filtered_text


# Categorizes the input


def categorize_input(filtered_text: str) -> dict:
    seperate_system_msg = dedent("""You need to seperate the given text into Core instruction and Information. Core instruction are the instructions that need to be followed by the chatbot while teaching. Core instr like, outputing the results in a certain format. Information is the a set of information that gives details about a certain thing or the user.
    Just return json with list of Core Instruction and list of Information and nothing else. 
    NOTE: Donot add anything on your own. Simply seperate the given text into Core Instruction and Information and return it in the json format as mentioned below.

    Output Format: {"core_instruction": [], "information": []}

    If a text does not have any Core Instruction, then return an empty list for Core Instruction.
    If a text does not have any Information, then return an empty list for Information.""")

    msg = [
        SystemMessage(content=seperate_system_msg),
        HumanMessage(content=f"Text: {filtered_text}"),
    ]

    categorize_data = llama3_70b.invoke(msg).content

    return json.loads(categorize_data)


# Core_Instruction things


async def core_instruction_operations(core_inst):
    changes = {
        "core_instruction": [{"Added": []}, {"Updated": []}],
    }

    search_core_instructions = await vectorstore.asimilarity_search(
        core_inst, k=2, filter={"group": "core_instruction"}
    )
    if search_core_instructions:
        # print("\033[91m", search_core_instructions, "\033[0m")
        index = await llm_check_data_presence(search_core_instructions, core_inst)
        # print("\033[91m", index, "\033[0m")

        if index == -1:
            id = create_id()
            add_vector_id(core_inst, id, category="core_instruction")
            changes["core_instruction"][0]["Added"].append(core_inst)
        elif index is not None:
            old_statement = search_core_instructions[index].page_content
            id = get_vector_id(text=old_statement, category="core_instruction")
            update_vector_id(
                old_text=old_statement,
                new_text=core_inst,
                id=id,
                category="core_instruction",
            )
            changes["core_instruction"][1]["Updated"].append((old_statement, core_inst))
        else:
            return changes

        await upload_value(
            id=id, text=core_inst, metadata={"group": "core_instruction"}
        )

    else:
        id = create_id()
        add_vector_id(core_inst, id, category="core_instruction")
        changes["core_instruction"][0]["Added"].append(core_inst)

        await upload_value(
            id=id, text=core_inst, metadata={"group": "core_instruction"}
        )

    return changes


# Information things


async def information_operations(info):
    info_id = None

    changes = {
        "information": [{"Added": []}, {"Updated": []}],
    }

    search_information = await vectorstore.asimilarity_search(
        info, k=2, filter={"group": "information"}
    )
    if search_information:
        # print("\033[91m", search_information, "\033[0m")
        index = await llm_check_data_presence(search_information, info)
        # print("\033[91m", index, "\033[0m")

        if index == -1:
            info_id = create_id()
            add_vector_id(info, info_id, category="information")
            changes["information"][0]["Added"].append(info)
        elif index is not None:
            old_statement = search_information[index].page_content
            info_id = get_vector_id(text=old_statement, category="information")
            update_vector_id(
                old_text=old_statement,
                new_text=info,
                id=info_id,
                category="information",
            )
            changes["information"][1]["Updated"].append((old_statement, info))
        else:
            return changes

        await upload_value(id=info_id, text=info, metadata={"group": "information"})

    else:
        info_id = create_id()
        add_vector_id(info, info_id, category="information")
        changes["information"][0]["Added"].append(info)

        await upload_value(id=info_id, text=info, metadata={"group": "information"})

    return changes


# Checks if any input needs to be changed


"""output : -2 -> No changes
            -1 -> Add new data
            0, 1, 2, 3,... -> Update the data at the index"""


async def llm_check_data_presence(search_data, statement: str) -> int:
    search_text = ", ".join(
        [f"{index}.{i.page_content}" for index, i in enumerate(search_data)]
    )
    # print("\033[91m", search_text, "\033[0m")

    system_prompt = dedent(
        """You are the long term memory of a teaching bot. You are given a list of previous memory and a statement to be added to the memory. If new information is already present in the memory and nothing needs to be changed in the memory, return 'None'. If any information needs to be updated, return the index of the information that needs to be updated. If the information is not present in the memory, return '-1'."""
    )

    msg = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Statement: {statement}, Previous Memory: {search_text}"),
    ]

    check_data = await llama3_70b.ainvoke(msg)
    if "none" in check_data.content.lower():
        return None

    try:
        match = int(check_data.content)
        val = match

    except ValueError:
        match = re.search(r"\d+", check_data.content)
        val = int(match.group(0)) if match else -1

    # print(val)
    return val


async def upload_to_pinecone_localIndex(data: dict) -> str:
    """
    If same information is already present, this keeps the id same as the previous data.
    If the information is not present, new index is created.
    All data is added to a list.
    """
    # changes = {
    #     "core_instruction": [{"Added": []}, {"Updated": []}],
    #     "information": [{"Added": []}],
    # }
    core_instruction_present = data["core_instruction"] != []
    information_present = data["information"] != []
    changes = []

    if core_instruction_present:
        for core_inst in data["core_instruction"]:
            core_instruction_changes = await core_instruction_operations(core_inst)
            # changes["core_instruction"][0]["Added"].extend(
            #     core_instruction_changes["core_instruction"][0]["Added"]
            # )
            # changes["core_instruction"][1]["Updated"].extend(
            #     core_instruction_changes["core_instruction"][1]["Updated"]
            # )

            print("\033[93m", core_instruction_changes, "\033[0m")
            changes.append(core_instruction_changes)

    if information_present:
        for info in data["information"]:
            information_changes = await information_operations(info)
            # changes["information"][0]["Added"].extend(
            #     information_changes["information"][0]["Added"]
            # )

            print("\033[93m", information_changes, "\033[0m")
            changes.append(information_changes)
    return changes


async def personalizer(input_text: str):
    if input_text == "":
        return ""
    print("\033[92mStarting...\033[0m")
    filtered_text = get_filtered_information(input_text)

    print("\033[92mFiltered Text:", filtered_text, "\033[0m")

    if filtered_text == "":
        return "No information to filter"

    categorized_data = categorize_input(filtered_text)

    print("\033[93mCategorized Data:", categorized_data, "\033[0m")

    changes = await upload_to_pinecone_localIndex(categorized_data)
    return changes
