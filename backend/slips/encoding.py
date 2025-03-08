import base64
import json

# Read the service account key file
with open("serviceAccountKey.json", "r") as file:
    json_data = file.read()

# Encode the JSON as a Base64 string
encoded = base64.b64encode(json_data.encode()).decode()

print("Encoded JSON:", encoded)
