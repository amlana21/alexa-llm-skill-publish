import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import LanceDB
import lancedb

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
DOCS_PATH = Path(os.getenv("DOCS_PATH", "../knowledgebase/docs"))
VECTOR_DB_PATH = Path(os.getenv("VECTOR_DB_PATH", "../knowledgebase/vectors"))
LANCEDB_TABLE = os.getenv("LANCEDB_TABLE", "knowledge")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))

SUPPORTED_EXTENSIONS = {".md", ".txt"}


def load_documents(docs_path: Path):
    if not docs_path.exists():
        raise FileNotFoundError(f"Docs path not found: {docs_path}")
    files = sorted(f for f in docs_path.iterdir() if f.suffix in SUPPORTED_EXTENSIONS)
    if not files:
        raise ValueError(f"No .md or .txt files found in {docs_path}")
    docs = []
    for f in files:
        loaded = TextLoader(str(f), encoding="utf-8").load()
        docs.extend(loaded)
        print(f"  loaded: {f.name} ({len(loaded)} doc(s))")
    return docs, files


def main():
    print(f"docs:    {DOCS_PATH}")
    print(f"vectors: {VECTOR_DB_PATH}")
    print(f"table:   {LANCEDB_TABLE}")
    print(f"model:   {OLLAMA_EMBED_MODEL} @ {OLLAMA_BASE_URL}")
    print(f"chunks:  size={CHUNK_SIZE} overlap={CHUNK_OVERLAP}")
    print()

    print("Loading documents...")
    documents, files = load_documents(DOCS_PATH)
    print(f"  {len(files)} file(s), {len(documents)} document(s)")
    print()

    print("Chunking...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
    )
    chunks = splitter.split_documents(documents)
    print(f"  {len(chunks)} chunk(s)")
    print()

    print("Connecting to LanceDB...")
    VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)
    db = lancedb.connect(str(VECTOR_DB_PATH))
    if LANCEDB_TABLE in db.table_names():
        db.drop_table(LANCEDB_TABLE)
        print(f"  dropped existing table '{LANCEDB_TABLE}'")

    print(f"Embedding and writing to table '{LANCEDB_TABLE}'...")
    embeddings = OllamaEmbeddings(model=OLLAMA_EMBED_MODEL, base_url=OLLAMA_BASE_URL)
    LanceDB.from_documents(
        documents=chunks,
        embedding=embeddings,
        connection=db,
        table_name=LANCEDB_TABLE,
    )

    row_count = db.open_table(LANCEDB_TABLE).count_rows()
    print(f"  {row_count} vector(s) written")
    print()
    print("Done.")


if __name__ == "__main__":
    main()
