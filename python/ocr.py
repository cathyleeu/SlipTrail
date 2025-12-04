import sys
import json
from paddleocr import PaddleOCR

def ocr_image(image_path):
    ocr = PaddleOCR(
        lang='en',
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False
    )

    results = ocr.predict(image_path)[0]
    all_texts = "\n".join(results['rec_texts'])

    print(all_texts)
    return all_texts

if __name__ == "__main__":
    if len(sys.argv) != 2: # Expecting exactly one argument: the image path
        print("Usage: python ocr.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    ocr_result = ocr_image(image_path)

    # JSON 출력 (한글 깨짐 방지: ensure_ascii=False)
    print(json.dumps(ocr_result, ensure_ascii=False, indent=2))