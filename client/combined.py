# combined_workflow.py (VERSION WITH HARDCODED SA PATH & TASK 3 FIX)

import google.generativeai as genai # For Tasks 1 & 2
# Try importing the specific GenerativeModel class first
try:
    # Updated import path based on newer google-cloud-aiplatform versions
    from vertexai.generative_models import GenerativeModel, Part
    print("Imported GenerativeModel from vertexai.generative_models")
except ImportError:
    # Fallback to older import path if the above fails
    try:
        from google.cloud.aiplatform.gapic import GenerativeModel # Older SDK structure?
        print("Imported GenerativeModel from google.cloud.aiplatform.gapic")
    except ImportError:
        print("Warning: Could not import GenerativeModel from specific paths. Will rely on aiplatform.Model fallback.")
        GenerativeModel = None # Flag that specific class is unavailable

from google.cloud import aiplatform # Still needed for init and fallback Model class
from google.oauth2 import service_account # Needed for explicit credentials
import PIL.Image
import os
import sys
import io     # For handling image bytes
import base64 # Needed for fallback .predict response processing
import numpy as np
import cv2      

# ================================================
# Configuration & Setup
# ================================================
print("--- Script Starting: Combined Gemini & Vertex AI Workflow (Using Hardcoded SA Path) ---")

# --- Standard Gemini API Key Setup (Still required from Env Var) ---
try:
    gemini_api_key = os.environ["GOOGLE_API_KEY"]
    genai.configure(api_key=gemini_api_key)
    print("Standard Gemini API configured using GOOGLE_API_KEY.")
except KeyError:
    print("\nFATAL ERROR: The GOOGLE_API_KEY environment variable is not set.")
    print("This key is needed for the google-generativeai library (Tasks 1 & 2).")
    sys.exit(1)
except Exception as e:
    print(f"\nFATAL ERROR: Failed to configure standard Gemini API: {e}")
    sys.exit(1)


# --- Vertex AI Configuration (Using Hardcoded SA Key Path) ---
try:
    # ---!!! WARNING: HARDCODED CREDENTIALS - INSECURE !!!---
    sa_key_path = r"C:\Users\Sumit Chatterjee\Desktop\handwriting-recog-455814-ff53e7290e78.json" # <-- YOUR HARDCODED PATH HERE
    print(f"WARNING: Using hardcoded Service Account Key Path (INSECURE): {sa_key_path}")
    # ---!!! ------------------------------------------ !!!---

    if not os.path.exists(sa_key_path):
        print(f"\nFATAL ERROR: Hardcoded Service Account key file not found at: {sa_key_path}")
        sys.exit(1)
    else:
         print("Hardcoded key file path exists.")

    try:
        credentials = service_account.Credentials.from_service_account_file(sa_key_path)
        print("Credentials loaded successfully from hardcoded key file.")
    except Exception as cred_err:
        print(f"\nFATAL ERROR: Failed to load credentials from key file '{sa_key_path}': {cred_err}")
        sys.exit(1)

    # Get Project ID (Prefer environment variable, fallback to derived/hardcoded)
    try:
        PROJECT_ID = os.environ["GOOGLE_CLOUD_PROJECT"]
        print(f"Using GCP Project ID from GOOGLE_CLOUD_PROJECT: {PROJECT_ID}")
    except KeyError:
        print("Warning: GOOGLE_CLOUD_PROJECT env var not set. Attempting to derive from key filename...")
        try:
            filename = os.path.basename(sa_key_path)
            project_id_parts = filename.split('-')
            if len(project_id_parts) >= 3:
                 PROJECT_ID = "-".join(project_id_parts[:-1])
                 print(f"Using Project ID derived from key filename: {PROJECT_ID}")
            else: raise ValueError("Could not derive Project ID.")
        except Exception as derive_err:
             print(f"Warning: Could not derive Project ID from filename ({derive_err}). Using placeholder.")
             PROJECT_ID = "handwriting-recog-455814" # Fallback - REPLACE IF NEEDED
             print(f"Using placeholder Project ID: {PROJECT_ID}")

    LOCATION = "us-central1" # Your desired region

    # Initialize Vertex AI SDK using the explicit credentials
    print(f"Initializing Vertex AI SDK for Project: {PROJECT_ID}, Location: {LOCATION} using specified key file.")
    aiplatform.init(project=PROJECT_ID, location=LOCATION, credentials=credentials)
    print("Vertex AI SDK initialized successfully.")

except Exception as e:
    print(f"\nFATAL ERROR: Failed during Vertex AI setup: {e}")
    # ... (keep detailed troubleshooting steps) ...
    sys.exit(1)


# --- Model Selection ---
gemini_model_name = 'gemini-1.5-flash-latest'
print(f"Using Gemini model for analysis: {gemini_model_name}")
gemini_model = genai.GenerativeModel(gemini_model_name)

# Use a specific Imagen model ID identified as potentially working
imagen_model_name_short = "imagen-3.0-generate-002" # Or another ID from Model Garden if needed
print(f"Using Vertex AI Imagen model identifier: {imagen_model_name_short}")


# --- Load the Handwritten Input Image ---
image_path = "handwriting_sample.png"
print(f"\nLoading input image: {image_path}")
try:
    img_input_pil = PIL.Image.open(image_path)
    print("Input image loaded successfully.")
except FileNotFoundError:
    print(f"FATAL ERROR: Input image file not found at {image_path}")
    sys.exit(1)
except Exception as e:
    print(f"FATAL ERROR: Failed to load image {image_path}: {e}")
    sys.exit(1)

# Initialize results dictionary
results = {
    "recognized_text": None, "style_description": None, "generated_image_path": None,
    "error_task1": None, "error_task2": None, "error_task3": None,
}

# ================================================
# Task 1: Read Text using Gemini API
# ================================================
print(f"\n--- Task 1: Reading text using {gemini_model_name} ---")
try:
    prompt_read = "Carefully read and transcribe all the text visible in this handwritten image."
    content_read = [prompt_read, img_input_pil]
    print("Sending request to Gemini for text recognition...")
    response_read = gemini_model.generate_content(content_read, request_options={"timeout": 180})
    results["recognized_text"] = response_read.text.strip()
    print("\nRecognized Text (Task 1):")
    print(results["recognized_text"] or "[No text recognized]")
except Exception as e:
    print(f"\nERROR during Task 1 (Gemini Read): {e}")
    results["error_task1"] = str(e)

# ================================================
# Task 2: Describe Style using Gemini API
# ================================================
print(f"\n--- Task 2: Describing style using {gemini_model_name} ---")
try:
    prompt_describe = """Analyze the visual style... (your full describe prompt)""" # Keep full prompt
    content_describe = [prompt_describe, img_input_pil]
    print("Sending request to Gemini for style description...")
    response_describe = gemini_model.generate_content(content_describe, request_options={"timeout": 180})
    results["style_description"] = response_describe.text.strip()
    print("\nHandwriting Style Description (Task 2):")
    print(results["style_description"] or "[No style description generated]")
except Exception as e:
    print(f"\nERROR during Task 2 (Gemini Describe): {e}")
    results["error_task2"] = str(e)


# ================================================
# Task 3: Generate New Text Image using Vertex AI Imagen
# ================================================
# Inside Task 3, after getting style_description
# ================================================
# Task 3: Generate New Text Image (OpenCV Approximation)
# ================================================
print("\n--- Task 3: Generating Image (OpenCV Approximation based on Description) ---")

target_text = results.get("recognized_text") or "Hello world - AI generated text."
style_description = results.get("style_description")
output_filename = "generated_handwriting_opencv.png" # Output file

# Proceed only if style features were successfully extracted in Task 2
if style_description:
    print("Attempting OpenCV generation based on style description...")

    # --- Estimate Parameters from Description (CRUDE MAPPING) ---
    estimated_slant = 0.0 # Default to upright
    style_desc_lower = style_description.lower() # Lowercase for easier matching
    if "forward slant" in style_desc_lower:
        estimated_slant = 10.0
        if "slightly" in style_desc_lower: estimated_slant = 5.0
        elif "strongly" in style_desc_lower: estimated_slant = 15.0
    elif "backward slant" in style_desc_lower:
        estimated_slant = -10.0
        if "slightly" in style_desc_lower: estimated_slant = -5.0
        elif "strongly" in style_desc_lower: estimated_slant = -15.0
    # Add more estimations for size, spacing etc. if desired
    print(f"Interpreted slant angle (approx): {estimated_slant:.1f} degrees")
    # --- End Estimation ---


    # ==============================================================
    # >>> ADD/ENSURE THIS OpenCV Setup & Rendering IS PRESENT <<<
    # ==============================================================
    try: # Add error handling for rendering part
        # --- Parameters for Rendering ---
        canvas_h = 150 # Adjust base height as needed
        canvas_w = 1200
        background_color = (255, 255, 255) # White
        text_color = (0, 0, 0)             # Black

        # --- Create the Canvas ---
        # IMPORTANT: Ensure dtype is uint8
        canvas = np.full((canvas_h, canvas_w, 3), background_color, dtype=np.uint8)
        print(f"Created canvas {canvas_w}x{canvas_h}, dtype: {canvas.dtype}")

        # Font parameters
        font = cv2.FONT_HERSHEY_SIMPLEX
        base_font_scale = 0.7
        thickness = 1
        adjusted_scale = base_font_scale # Keep scale simple for now

        # --- Render Text Word-by-Word (or line-by-line) ---
        words = target_text.split(' ')
        start_x = 20
        start_y = int(canvas_h * 0.6)
        current_x = start_x
        min_word_spacing = 5
        # Crude spacing based on description (optional)
        word_spacing = min_word_spacing
        if "wide" in style_desc_lower and "spacing" in style_desc_lower: word_spacing = 10
        elif "narrow" in style_desc_lower and "spacing" in style_desc_lower: word_spacing = 3
        word_spacing = int(word_spacing)
        print(f"Using word spacing: {word_spacing} pixels")

        print("Rendering text word by word...")
        for i, word in enumerate(words):
            if not word: continue
            (word_width, word_height), baseline = cv2.getTextSize(word, font, adjusted_scale, thickness)

            if current_x + word_width > canvas_w - start_x:
                 current_x = start_x
                 start_y += int(word_height * 1.5)
                 if start_y > canvas_h - (word_height * 0.5):
                      print("Warning: Text exceeds canvas height, stopping rendering.")
                      break

            # Ensure canvas is contiguous before drawing (good practice)
            canvas = np.ascontiguousarray(canvas)
            cv2.putText(canvas, word, (current_x, start_y), font, adjusted_scale, text_color, thickness, cv2.LINE_AA)
            current_x += word_width + word_spacing

        # --- Now 'canvas' exists and has text drawn on it ---
        generated_image_no_slant = canvas.copy() # This line should now work
        print("Finished rendering text to canvas.")
        # ==============================================================
        # >>> END OF OpenCV Setup & Rendering <<<
        # ==============================================================


        # --- Apply Interpreted Slant ---
        clamped_slant_angle = max(-40.0, min(estimated_slant, 40.0))
        print(f"Applying clamped interpreted slant: {clamped_slant_angle:.1f} deg")
        slant_radians = np.radians(clamped_slant_angle)
        shear_factor = np.tan(slant_radians)
        M_shear = np.array([[1, shear_factor, 0], [0, 1, 0]], dtype=np.float32)
        sheared_image = cv2.warpAffine(generated_image_no_slant, M_shear, (canvas_w, canvas_h),
                                       borderMode=cv2.BORDER_CONSTANT, borderValue=background_color)

        # --- Save and Display ---
        cv2.imwrite(output_filename, sheared_image)
        print(f"\nSimplified generated image saved to: {output_filename}")
        results["generated_image_path"] = output_filename # Store path

        try:
            print("Displaying generated image (OpenCV Approximation)...")
            generated_img_pil = PIL.Image.open(output_filename)
            generated_img_pil.show()
        except Exception as display_err:
            print(f"Warning: Could not automatically display image: {display_err}")

    except ImportError:
         print("ERROR: Failed to import OpenCV (cv2) or NumPy (np). Cannot perform Task 3.")
         results["error_task3"] = "Missing OpenCV/NumPy for generation."
    except Exception as e:
        print(f"ERROR during Task 3 (OpenCV Generation): {e}")
        results["error_task3"] = str(e)

else:
    # Handle case where Task 2 failed or produced no description
    print("\nSkipping Task 3 (OpenCV Generation) because style description was not obtained in Task 2.")
    if results.get("error_task2"): print(f"Reason: Task 2 failed with error: {results['error_task2']}")
    else: print("Reason: Style description result from Task 2 was empty.")


# ================================================
# Final Summary
# ================================================
# ... (Keep Final Summary code) ...
print("\n--- Combined Workflow Script Finished: Summary ---")
# ...
# ================================================
# Final Summary
# ================================================
print("\n--- Combined Workflow Script Finished: Summary ---")
print(f"Task 1 Error: {results.get('error_task1', 'None')}")
print(f"Task 2 Error: {results.get('error_task2', 'None')}")
print(f"Task 3 Error: {results.get('error_task3', 'None')}")
print("-" * 40)
print(f"Recognized Text Found:          {'Yes' if results.get('recognized_text') else 'No'}")
print(f"Style Description Generated:    {'Yes' if results.get('style_description') else 'No'}")
print(f"Generated Image Path:           {results.get('generated_image_path', 'N/A')}")
print("-" * 40)