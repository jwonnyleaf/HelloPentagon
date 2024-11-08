import os
import typer
from openai import OpenAI
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

app = typer.Typer()

def chat_with_gpt(
    text: str,
    temperature: float = 0.7,
    max_tokens: int = 500,  
    model: str = "gpt-3.5-turbo"
) -> str:
    """Function to interact with the OpenAI API and return ChatGPT's response."""
    messages = [{"role": "user", "content": text}]
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        reply = response.choices[0].message.content
        return reply
    except Exception as e:
        return f"Error: {e}"