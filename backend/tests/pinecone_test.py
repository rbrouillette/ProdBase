import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

def test_pinecone():
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

    index_name = os.getenv("PINECONE_INDEX")
    indexes = pc.list_indexes().names()
    if index_name in indexes:
        print(f"Pinecone index '{index_name}' is ready.")
    else:
        print(f"Pinecone index '{index_name}' not found. Please create it.")

if __name__ == "__main__":
    test_pinecone()
