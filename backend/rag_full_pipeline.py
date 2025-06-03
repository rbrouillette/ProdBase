import os
import sys
from openai import OpenAI
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize Pinecone client
pinecone_client = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX")

embedding_model = "text-embedding-3-small"  # Use 1536-dim model to match your index

def embed_text(text):
    response = openai_client.embeddings.create(
        input=text,
        model=embedding_model
    )
    return response.data[0].embedding

def upsert_vectors(vectors):
    index = pinecone_client.Index(index_name)
    index.upsert(vectors=vectors)

def query_pinecone(query_embedding, top_k=3):
    index = pinecone_client.Index(index_name)
    result = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return result.matches

def main(question):
    # Sample documents to index
    documents = [
        {"id": "doc1", "text": "Paris is the capital of France."},
        {"id": "doc2", "text": "The Eiffel Tower is a famous landmark in Paris."},
        {"id": "doc3", "text": "OpenAI develops advanced AI models."}
    ]

    # Embed and upsert documents into Pinecone
    vectors = []
    for doc in documents:
        embedding = embed_text(doc["text"])
        vectors.append((doc["id"], embedding, {"text": doc["text"]}))
    upsert_vectors(vectors)

    # Embed the question and query Pinecone
    query_embedding = embed_text(question)
    matches = query_pinecone(query_embedding)

    # Aggregate context from matched documents
    context = "\n".join(match.metadata["text"] for match in matches)

    # Prepare messages for OpenAI chat completion
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
    ]

    # Generate answer with OpenAI GPT
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    # Print only the final answer
    print(response.choices[0].message.content)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        main("What is the capital of France?")
