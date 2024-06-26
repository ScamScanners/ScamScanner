import os
from groq import Groq


client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)


def summarize_call(message):
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant trained to summarize calls. Could you please generate a concise summary of the key points discussed during the call? You summarize it in less than 5 lines.\n\nYou will refer to the conversation as scammer and to the user as you.",
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response = ""
    for chunk in completion:
        response += chunk.choices[0].delta.content or ""

    return response
