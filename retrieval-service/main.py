import os
import secrets
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from dotenv import load_dotenv
from rag_agent import run_query

load_dotenv()

app = FastAPI(title="PI Retrieval Service")
security = HTTPBasic()

BASIC_AUTH_USER = os.getenv("BASIC_AUTH_USER", "")
BASIC_AUTH_PASS = os.getenv("BASIC_AUTH_PASS", "")


def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    correct_user = secrets.compare_digest(
        credentials.username.encode("utf-8"), BASIC_AUTH_USER.encode("utf-8")
    )
    correct_pass = secrets.compare_digest(
        credentials.password.encode("utf-8"), BASIC_AUTH_PASS.encode("utf-8")
    )
    if not (correct_user and correct_pass):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    answer: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "PI Retrieval"}


@app.post("/query", response_model=QueryResponse)
def query(request: QueryRequest, _: HTTPBasicCredentials = Depends(verify_credentials)):
    answer = run_query(request.query)
    return QueryResponse(answer=answer)
