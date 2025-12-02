from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import math
from itertools import permutations, combinations
from typing import List
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Allow React (Vite) frontend to call this API
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NVIDIA LLM client
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
)

class ProblemInput(BaseModel):
    items: List[str]
    r: int
    calculation_type: str  # "perm" or "comb"
    explanation_mode: str = "Tutor"  # "Tutor" or "Expert"

def factorial(n: int) -> int:
    return math.factorial(n)

def calculate_permutation(n: int, r: int) -> int:
    if r > n:
        return 0
    return factorial(n) // factorial(n - r)

def calculate_combination(n: int, r: int) -> int:
    if r > n:
        return 0
    return factorial(n) // (factorial(r) * factorial(n - r))

@app.get("/")
async def root():
    return {"message": "Welcome to PerC AI - Permutation & Combination Solver"}

@app.post("/solve")
async def solve_problem(data: ProblemInput):
    n = len(data.items)

    if data.calculation_type == "perm":
        count = calculate_permutation(n, data.r)
        all_results = list(permutations(data.items, data.r))
    elif data.calculation_type == "comb":
        count = calculate_combination(n, data.r)
        all_results = list(combinations(data.items, data.r))
    else:
        return {"error": "Invalid calculation_type. Use 'perm' or 'comb'"}

    # Dynamic prompt based on explanation mode
    tutor_prompt = f"""
You are a friendly and encouraging math tutor explaining to a college student.

Problem: Choose {data.r} items from {data.items} ({data.calculation_type}utation).

Instructions:
1. Start with a simple real-world analogy (like choosing team captains, arranging books, etc.)
2. Explain what "{data.calculation_type}utation" means - does order matter or not?
3. Break down the counting process step-by-step with the actual items
4. Show the formula: P(n,r) or C(n,r) and plug in values
5. End with why we got {count} total possibilities

Keep it conversational, clear, and under 400 words. Use emojis sparingly for clarity.
"""

    expert_prompt = f"""
You are a university mathematics professor providing a rigorous explanation.

Problem: Calculate the number of {data.calculation_type}utations when selecting {data.r} items from the set {data.items} where n = {n}.

Structure your response:

**Definition**: Precisely define {data.calculation_type}utation in mathematical terms.

**Formula**: State the formula explicitly:
- If permutation: P(n,r) = n! / (n-r)!
- If combination: C(n,r) = n! / (r!(n-r)!)

**Calculation**: Show step-by-step arithmetic:
- Calculate factorials
- Perform division
- Arrive at {count}

**Application Context**: Mention 1-2 real-world applications in computer science, cryptography, or statistics where this calculation is crucial.

**Complexity Note**: Briefly mention algorithmic complexity of generating all arrangements.

Keep it formal, precise, and under 500 words.
"""

    prompt = expert_prompt if data.explanation_mode == "Expert" else tutor_prompt

    try:
        completion = client.chat.completions.create(
            model="qwen/qwen3-next-80b-a3b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            top_p=0.7,
            max_tokens=600,
            stream=False,
        )
        ai_explanation = completion.choices[0].message.content
    except Exception as e:
        ai_explanation = f"AI explanation unavailable: {str(e)}"

    return {
        "items": data.items,
        "n": n,
        "r": data.r,
        "calculation_type": data.calculation_type,
        "total_count": count,
        "sample_results": all_results[:10],
        "ai_explanation": ai_explanation,
    }
