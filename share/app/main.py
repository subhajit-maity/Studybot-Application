import asyncio
from fastapi import FastAPI

from personalization import personalizer
from chatbot import chat_bot_runner
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:8080/",
]
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 



@app.post("/chatbot")
async def main(inp: dict):
    if inp["message"] == "exit":
        output = await chat_bot_runner(
            inp["message"],
            inp["previous_conversation"],
            inp["subject"],
            inp["chapter"],
        )
        personalisation = {}
    else:
        output, personalisation = await asyncio.gather(
            chat_bot_runner(
                inp["message"],
                inp["previous_conversation"],
                inp["subject"],
                inp["chapter"],
            ),
            personalizer(inp["message"]),
        )

    return {"output": output, "personalisation": personalisation}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
