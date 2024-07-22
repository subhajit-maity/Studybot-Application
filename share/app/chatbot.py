from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from textwrap import dedent
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain_cohere import CohereEmbeddings
import asyncio
import json
import os

load_dotenv()

index_name = "humanaize-education-hackathon-personalization"
# index_name = "test"
llama3_8b = ChatGroq(model="Llama3-8b-8192")
llama3_70b = ChatGroq(model="Llama3-70b-8192")
embeddings = CohereEmbeddings()

vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)
CORE_INSTRUCTION_JSON_FILE_PATH = os.path.join(
    os.path.dirname(os.getcwd()), "core.json"
)


async def get_instructions_from_pinecone(msg):
    instructions = await vectorstore.asimilarity_search(
        msg, k=3, filter={"group": "information"}
    )
    return "\n".join([instruction.page_content for instruction in instructions])


async def get_core_instructions_from_file():
    with open(CORE_INSTRUCTION_JSON_FILE_PATH, "r") as file:
        data = file.read()
        core_instruction = json.loads(data)

        return "\n".join(list(core_instruction.keys()))


async def chatbot(
    msg, previous_conversation, subject, chapter, image=None, standard="class 12"
):
    core_intructions, information = await asyncio.gather(
        get_core_instructions_from_file(), get_instructions_from_pinecone(msg)
    )

    if image:
        pass

    system_message = dedent(f"""You are a teacher chatbot specialist in teaching {standard} explaining {subject}, chapter {chapter}.
    You will go through the subtopic step by step in and provide a detailed explaination in single output.
    Provide context that make it easier for the student to understand the topic.
    If the student wants to know more about a specific topic, provide them with additional resources.
    Donot go off-topic. Stay focused on the topic you are explaining.
    Explaination should be clear and concise. Avoid using jargon or technical terms that the student may not understand.
                            
    Make sure you cover all the subtopics. Donot rush through the topic. Explain the subtopic step by step.

    Never provide incorrect or misleading information. If you are unsure about something, let the student know that you are not sure about it.
    NEVER output return external resources / additional resources / links or books.
                            
    CORE INSTRUCTIONS TO ALWAYS FOLLOW:
    {core_intructions}

    OTHER INFORMATION THAT MIGHT BE HELPFUL:
    {information}

    Output should be in Markdown format. Use LaTeX for mathematical equations.
    Highlight the key points and important concepts. Format the text to make it easier to read. Use bullet points, headings, and lists. 
    Make sure to use HTML to format text in the Markdown. Use bold, italics, and underline to highlight important information. Use blockquotes to provide additional information. Use code blocks to provide code snippets.Use tables to provide structured information. Use colors to highlight important information. Use formatting to make the text visually appealing.

    Conversation History : {previous_conversation}""")

    human_message = msg

    prompt = [SystemMessage(system_message), HumanMessage(human_message)]

    output = await llama3_70b.ainvoke(prompt)
    return output.content


def chatbot_summarization(explaination):
    system_prompt = "This is an explaination of a topic. Summarize the explaination. Cover all the topics that has been covered and anything specific if required. Keep the summary, concise and clear. make sure to include every detail in the summary. Include every concept, example, even variable names if any. There should be no missing information in the summary."

    human_prompt = f"""Explaination: {explaination}"""

    prompt = [SystemMessage(system_prompt), HumanMessage(human_prompt)]

    output = llama3_8b.invoke(prompt)
    return output.content


def chat_summarization(output, previous_conversation):
    system_prompt = """This is a conversation where the teacher is explaining a topic to the student. Summarize the conversation. Cover all the topics that has been covered before and now and anything specific if required. Keep the summary, concise and clear. Give some weightage to recently covered topics but make sure you include previous topics as well. There should be absolutely no missing topics. Details are not required in the summary, but all the topics and overview should be maintained.\nJust output the summary of the conversation. Do not output anything else."""

    human_message = (
        f"""bot: {output}\n\nConversation History : {previous_conversation}"""
    )

    prompt = [SystemMessage(system_prompt), HumanMessage(human_message)]

    output = llama3_8b.invoke(prompt)
    return output.content


async def chat_bot_runner(msg, previous_conversation, subject, chapter):
    output = await chatbot(msg, previous_conversation, subject, chapter)
    summary = chatbot_summarization(output)
    final_summary = chat_summarization(summary, previous_conversation)

    return {"reply": output, "new_summary": final_summary}
