import cv2
import numpy as np
import json
import base64
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")


def extract_strokes(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    return [[(int(x), int(y)) for [[x, y]] in cnt] for cnt in contours]


def detect_text(image_path):
    with open(image_path, "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read()).decode()

    url = f"https://vision.googleapis.com/v1/images:annotate?key={config.GOOGLE_VISION_API_KEY}"
    payload = {
        "requests": [{
            "image": {"content": img_base64},
            "features": [{"type": "DOCUMENT_TEXT_DETECTION"}]
        }]
    }

    response = requests.post(url, json=payload).json()

    if 'responses' not in response:
        print("Error from Vision API:", response)
        return []  # Return empty if failed

    annotations = response['responses'][0].get('fullTextAnnotation', {})
    boxes = []

    for page in annotations.get('pages', []):
        for block in page['blocks']:
            for paragraph in block['paragraphs']:
                for word in paragraph['words']:
                    text = ''.join([s['text'] for s in word['symbols']])
                    vertices = word['boundingBox']['vertices']
                    x_min = min(v.get('x', 0) for v in vertices)
                    y_min = min(v.get('y', 0) for v in vertices)
                    x_max = max(v.get('x', 0) for v in vertices)
                    y_max = max(v.get('y', 0) for v in vertices)
                    boxes.append({'char': text, 'box': (x_min, y_min, x_max, y_max)})

    return boxes



def get_stroke_center(stroke):
    xs = [x for x, y in stroke]
    ys = [y for x, y in stroke]
    return (sum(xs) // len(xs), sum(ys) // len(ys))


def is_point_in_box(point, box):
    x, y = point
    x_min, y_min, x_max, y_max = box
    return x_min <= x <= x_max and y_min <= y <= y_max


def label_strokes(image_path):
    strokes = extract_strokes(image_path)
    char_boxes = detect_text(image_path)

    labeled_data = []

    for char_info in char_boxes:
        char_strokes = []
        for stroke in strokes:
            center = get_stroke_center(stroke)
            if is_point_in_box(center, char_info['box']):
                char_strokes.append(stroke)

        labeled_data.append({
            'char': char_info['char'],
            'strokes': char_strokes
        })

    return labeled_data



if __name__ == "__main__":
    img_path = "handwriting.jpg"  # Your image file
    data = label_strokes(img_path)

    with open("labeled_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print("Done. Output saved to labeled_data.json")
