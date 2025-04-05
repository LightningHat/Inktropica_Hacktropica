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
    sa_key_path = r"" # <-- YOUR HARDCODED PATH HERE
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
imagen_model_name_short = "imagen-3.0-fast-generate-001" # Or another ID from Model Garden if needed
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
print(f"\n--- Task 3: Attempting image generation using Vertex AI Imagen ({imagen_model_name_short}) ---")
style_description = results.get("style_description")
output_filename = "generated_handwriting_vertexai.png"

if style_description:
    target_text = results.get("recognized_text") or "Hello world - AI generated text."
    if not results.get("recognized_text"): print("Warning: Using default target text.")

    imagen_prompt = f"""Generate a realistic image of the text: '{target_text}'.
The text should look handwritten and visually match this style description: {style_description}.
Focus on slant, size, spacing, loops, connection, pressure, neatness.""" # Simplified prompt

    print("\nSending prompt to Vertex AI Imagen model...")

    try:
        # --- Primary Method: Using GenerativeModel ---
        if GenerativeModel: # Check if the specific GenerativeModel class was imported successfully
            print(f"Instantiating Vertex AI GenerativeModel for: {imagen_model_name_short}")
            model_vertex_gen = GenerativeModel(imagen_model_name_short)
            print("Vertex AI GenerativeModel instantiated.")

            print("Requesting image generation via generate_content...")
            # --- FIX: Removed the generation_config argument ---
            response_imagen = model_vertex_gen.generate_content(
                 contents=[imagen_prompt]
                 # No generation_config needed if default (1 image) is okay
            )
            # --- END FIX ---
            print("Vertex AI Imagen generate_content response received.")

            # --- Process generate_content Response ---
            if not response_imagen.candidates: raise ValueError("Response has no candidates.")
            candidate = response_imagen.candidates[0]
            if not candidate.content.parts: raise ValueError("Candidate has no parts.")
            image_part = None
            for part in candidate.content.parts:
                if part.mime_type.startswith("image/"):
                    image_part = part
                    break
            if not image_part: raise ValueError("No image part found.")
            if not (hasattr(image_part, 'inline_data') and hasattr(image_part.inline_data, 'data')):
                 raise ValueError("Image part missing inline_data.")
            image_bytes = image_part.inline_data.data
            print("Image data extracted from generate_content response part.")
            method_used = "generate_content"
        else:
            # --- Fallback Method: Using aiplatform.Model ---
            print("GenerativeModel class not found, attempting fallback using aiplatform.Model...")
            # Reconstruct full model name if needed
            full_model_name_fallback = f"projects/{PROJECT_ID}/locations/{LOCATION}/models/{imagen_model_name_short}"
            print(f"Instantiating Vertex AI Model reference for: {full_model_name_fallback} (fallback)")
            model_vertex_pred = aiplatform.Model(model_name=full_model_name_fallback)
            print("Vertex AI Model reference obtained (fallback).")

            print("Requesting image generation via model.predict() (fallback)...")
            instances = [{"prompt": imagen_prompt}]
            # Use 'sampleCount' parameter for the predict method
            parameters = {"sampleCount": 1}
            response_imagen = model_vertex_pred.predict(instances=instances, parameters=parameters)
            print("Vertex AI Imagen prediction response received (fallback).")

            # Process .predict() response
            if not response_imagen.predictions: raise ValueError("Prediction response has no predictions.")
            prediction = response_imagen.predictions[0]
            if "bytesBase64Encoded" not in prediction: raise ValueError("Missing 'bytesBase64Encoded' key.")
            if base64 is None: import base64 # Ensure base64 is imported
            image_bytes = base64.b64decode(prediction["bytesBase64Encoded"])
            print("Image data decoded from base64 (fallback).")
            method_used = "predict (fallback)"

        # --- Common Image Saving & Display ---
        generated_image = PIL.Image.open(io.BytesIO(image_bytes))
        generated_image.save(output_filename)
        results["generated_image_path"] = output_filename
        print(f"\nSuccessfully generated image (via {method_used}) saved to: {output_filename}")
        try:
             print("Displaying generated image (opens in default viewer)...")
             generated_image.show()
        except Exception as display_err:
             print(f"Warning: Could not automatically display generated image: {display_err}")

    except ImportError as e:
         # This might catch the case where neither GenerativeModel import worked
         print(f"\nERROR: Failed to import necessary Vertex AI classes: {e}")
         results["error_task3"] = f"ImportError: {e}"
    except Exception as e:
        print(f"\nERROR during Task 3 (Vertex AI Imagen generation or processing): {e}")
        # ... (Keep troubleshooting print statements) ...
        results["error_task3"] = str(e)

else:
    print("\nSkipping Task 3 because style description was not obtained in Task 2.")
    # ... (Keep reasons for skipping) ...

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