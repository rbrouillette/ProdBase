import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

def test_openai():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Say hello from OpenAI!"}]
    )
    print("OpenAI Response:", response.choices[0].message.content)

if __name__ == "__main__":
    test_openai()
