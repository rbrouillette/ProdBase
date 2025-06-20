import os
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec

# 🔐 Load environment variables from .env
load_dotenv()

# Get API keys + config
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")

# ✅ Initialize OpenAI and Pinecone
client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)

# ✅ Create index if it doesn't exist
if PINECONE_INDEX not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(PINECONE_INDEX)

# 👤 Example document
doc_id = "crew_001"
doc_text = "Jane Doe is a gaffer known for fast rigging on automotive shoots and beverage spots."

# 🔡 Create and upsert embedding
embedding = client.embeddings.create(
    model="text-embedding-3-small",
    input=doc_text
).data[0].embedding

index.upsert(vectors=[{
    "id": doc_id,
    "values": embedding,
    "metadata": {"text": doc_text}
}])

# ❓ User query
user_query = "Who is good for automotive lighting?"
query_embedding = client.embeddings.create(
    model="text-embedding-3-small",
    input=user_query
).data[0].embedding

# 🔍 Search Pinecone
results = index.query(vector=query_embedding, top_k=1, include_metadata=True)
matches = results.get("matches", [])

if not matches:
    print("⚠️ No results found.")
    exit(1)

context = matches[0]["metadata"]["text"]

# 💬 GPT-4o answer
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant for a commercial production platform."},
        {"role": "user", "content": f"Use this context to answer: {context}\n\nQuestion: {user_query}"}
    ]
)

print("\n💡 GPT-4o Response:\n", response.choices[0].message.content)
