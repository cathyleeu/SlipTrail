import sys
import json
from paddleocr import PaddleOCR

def ocr_image(image_path):
    ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)

    # Perform OCR on the image
    result = ocr.predict(image_path, cls=True)

    # Extract text from the result
    extracted_text = []
    for line in result:
        for word_info in line:
            extracted_text.append(word_info[1][0])

    return extracted_text

if __name__ == "__main__":
    if len(sys.argv) != 2: # Expecting exactly one argument: the image path
        print("Usage: python ocr.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    text_lines = ocr_image(image_path)

    # Output the extracted text as a JSON array
    print(json.dumps(text_lines, indent=2))