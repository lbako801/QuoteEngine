import sys
import os
import pytesseract
from pdf2image import convert_from_path
import requests

POPPLER_PATH = r"C:\Tools\poppler-24.08.0\Library\bin"
TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
AI_ENDPOINT = "http://localhost:11434/api/analyze-pdf"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def extract_text(file_path):
    images = convert_from_path(file_path, dpi=400, poppler_path=POPPLER_PATH)
    full_text = "\n\n".join(
        pytesseract.image_to_string(img, config="--psm 6").strip()
        for img in images
    )
    with open("ocr_output.txt", "w", encoding="utf-8") as f:
        f.write(full_text)
    return full_text


def ask_ai(prompt):
    response = requests.post(
        AI_ENDPOINT,
        json={"model": "deepseek-r1", "prompt": prompt, "stream": True}
    )
    response.raise_for_status()
    return response.json()["response"]


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python analyze_pdf.py <path_to_pdf>")
        sys.exit(1)

    text = extract_text(sys.argv[1])
    print("=== OCR Output ===\n", text[:1000], "...\n")  # Optional preview

    try:
        print("=== AI Response ===\n")
        print(ask_ai(text))
    except Exception as e:
        print(f"AI call failed: {e}")
