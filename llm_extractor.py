import ollama
import json

def extract_details_llm(summary):

    prompt = f"""
You are an AI that extracts structured information about monuments.

Extract the following fields STRICTLY:
- Architecture
- Built (year or period)
- Builder (person or dynasty)
- Location

Rules:
- Use only the given text
- Do NOT guess
- If missing → return "Not available"
- Return ONLY JSON

Text:
{summary}
"""

    response = ollama.chat(
        model="mistral",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    text = response["message"]["content"]

    try:
        return json.loads(text)
    except:
        return {
            "Architecture": "Not available",
            "Built": "Not available",
            "Builder": "Not available",
            "Location": "Not available"
        }