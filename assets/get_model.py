import os
import requests

# Production target directory inside your compiled standalone build
target_dir = "H:\\MahimaSandbox\\MahimaAI\\core\\dist\\mahima-core\\_internal\\openwakeword\\resources\\models"
os.makedirs(target_dir, exist_ok=True)

models = {
    "melspectrogram.onnx": "https://github.com/dscripka/openWakeWord/releases/download/v0.5.1/melspectrogram.onnx",
    "embedding_model.onnx": "https://github.com/dscripka/openWakeWord/releases/download/v0.5.1/embedding_model.onnx"
}

for model_name, url in models.items():
    target_path = os.path.join(target_dir, model_name)
    print(f"Downloading required base layer: {model_name}...")
    response = requests.get(url, stream=True)
    
    if response.status_code == 200:
        with open(target_path, 'wb') as f:
            f.write(response.content)
        print(f" -> Success! Seated at: {target_path}\n")
    else:
        print(f" -> Failed to download {model_name}. Status: {response.status_code}\n")