from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import base64
import io
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from PIL import Image

load_dotenv()
app = Flask(__name__)
CORS(app)

supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

# Load the model from the .h5 file
model = tf.keras.models.load_model("Model_2.h5")

li = ['Apple Scab Leaf', 'Apple leaf', 'Apple rust leaf', 'Bell_pepper leaf', 'Bell_pepper leaf spot', 'Blueberry leaf', 'Cherry leaf', 'Corn Gray leaf spot', 'Corn leaf blight', 'Corn rust leaf', 'Peach leaf', 'Potato leaf early blight', 'Potato leaf late blight', 'Raspberry leaf', 'Soyabean leaf', 'Squash Powdery mildew leaf', 'Strawberry leaf', 'Tomato Early blight leaf', 'Tomato Septoria leaf spot', 'Tomato leaf', 'Tomato leaf bacterial spot', 'Tomato leaf late blight', 'Tomato leaf mosaic virus', 'Tomato leaf yellow virus', 'Tomato mold leaf', 'grape leaf', 'grape leaf black rot']

plant_diseases = {
  "Apple Scab Leaf": {
    "prescription": "Apply fungicides containing captan or mancozeb.",
    "diagnosis": "Circular, scab-like lesions on leaves and fruit, often with a velvety texture.",
    "steps_to_be_taken": "Remove and destroy infected leaves and fruit. Improve air circulation around trees to reduce humidity."
  },
  "Apple leaf": {
    "prescription": "Maintain proper orchard hygiene, prune infected branches, and apply appropriate fungicides.",
    "diagnosis": "Yellowing or browning of leaves, sometimes with spots or lesions.",
    "steps_to_be_taken": "Monitor for signs of disease, improve tree nutrition, and control pests that may contribute to leaf damage."
  },
  "Apple rust leaf": {
    "prescription": "Apply fungicides containing sulfur or copper-based compounds.",
    "diagnosis": "Yellow or orange spots on leaves, often accompanied by raised lesions.",
    "steps_to_be_taken": "Remove and destroy infected leaves. Prune trees to improve air circulation."
  },
  "Bell_pepper leaf": {
    "prescription": "Apply appropriate fungicides and practice crop rotation.",
    "diagnosis": "Dark spots or lesions on leaves, which may lead to defoliation.",
    "steps_to_be_taken": "Remove and destroy infected plant material. Monitor for signs of disease in nearby plants."
  },
  "Bell_pepper leaf spot": {
    "prescription": "Apply fungicides containing copper or chlorothalonil.",
    "diagnosis": "Circular lesions with a dark border on leaves, which may enlarge over time.",
    "steps_to_be_taken": "Improve air circulation and avoid overhead irrigation to reduce leaf wetness."
  },
  "Blueberry leaf": {
    "prescription": "Apply fungicides labeled for blueberry diseases.",
    "diagnosis": "Reddish spots or lesions on leaves, sometimes accompanied by leaf curling or distortion.",
    "steps_to_be_taken": "Prune infected branches and provide adequate water and nutrients to the plant."
  },
  "Cherry leaf": {
    "prescription": "Apply appropriate fungicides and practice good orchard management.",
    "diagnosis": "Brown or black spots on leaves, which may lead to premature defoliation.",
    "steps_to_be_taken": "Remove infected leaves and improve air circulation to reduce leaf wetness."
  },
  "Corn Gray leaf spot": {
    "prescription": "Apply fungicides containing strobilurins or triazoles.",
    "diagnosis": "Grayish lesions with yellow halos on corn leaves, which may coalesce under favorable conditions.",
    "steps_to_be_taken": "Rotate crops, remove crop debris, and provide adequate spacing between plants."
  },
  "Corn leaf blight": {
    "prescription": "Apply appropriate fungicides and practice crop rotation.",
    "diagnosis": "Large, irregular lesions on corn leaves, which may lead to significant yield loss.",
    "steps_to_be_taken": "Remove and destroy infected plant material. Implement cultural practices to reduce disease spread."
  },
  "Corn rust leaf": {
    "prescription": "Apply fungicides containing triazoles or strobilurins.",
    "diagnosis": "Orange to reddish-brown pustules on corn leaves, often appearing in linear patterns.",
    "steps_to_be_taken": "Plant resistant varieties, remove infected debris, and practice crop rotation."
  },
  "Peach leaf": {
    "prescription": "Apply appropriate fungicides and maintain good orchard sanitation.",
    "diagnosis": "Purple or reddish spots on peach leaves, sometimes with a velvety appearance.",
    "steps_to_be_taken": "Prune infected branches, remove fallen leaves, and monitor for signs of disease."
  },
  "Potato leaf early blight": {
    "prescription": "Apply fungicides containing chlorothalonil or mancozeb.",
    "diagnosis": "Circular lesions with a target-like appearance on potato leaves, often with concentric rings.",
    "steps_to_be_taken": "Implement crop rotation, space plants adequately, and provide good soil drainage."
  },
  "Potato leaf late blight": {
    "prescription": "Apply fungicides containing chlorothalonil or copper-based compounds.",
    "diagnosis": "Large, irregular lesions on potato leaves, which may appear water-soaked in humid conditions.",
    "steps_to_be_taken": "Destroy infected plant material, avoid overhead irrigation, and improve air circulation."
  },
  "Raspberry leaf": {
    "prescription": "Apply appropriate fungicides labeled for raspberry diseases.",
    "diagnosis": "Purple or reddish spots on raspberry leaves, sometimes with yellow halos.",
    "steps_to_be_taken": "Prune infected canes, remove fallen leaves, and provide adequate plant spacing."
  },
  "Soyabean leaf": {
    "prescription": "Apply fungicides labeled for soybean diseases.",
    "diagnosis": "Yellow or brown spots on soybean leaves, which may lead to premature defoliation.",
    "steps_to_be_taken": "Implement crop rotation, plant disease-resistant varieties, and monitor for signs of disease."
  },
  "Squash Powdery mildew leaf": {
    "prescription": "Apply fungicides containing sulfur or potassium bicarbonate.",
    "diagnosis": "White powdery patches on squash leaves, often accompanied by leaf distortion.",
    "steps_to_be_taken": "Provide good air circulation, avoid overhead watering, and remove infected plant material."
  },
  "Strawberry leaf": {
    "prescription": "Apply appropriate fungicides labeled for strawberry diseases.",
    "diagnosis": "Brown or black spots on strawberry leaves, sometimes with yellow halos.",
    "steps_to_be_taken": "Prune infected runners, remove fallen leaves, and provide adequate plant spacing."
  },
  "Tomato Early blight leaf": {
    "prescription": "Apply fungicides containing chlorothalonil or copper-based compounds.",
    "diagnosis": "Circular, dark lesions with concentric rings on tomato leaves, often starting from the bottom of the plant.",
    "steps_to_be_taken": "Remove infected plant material, avoid overhead irrigation, and provide good air circulation."
  },
  "Tomato Septoria leaf spot": {
    "prescription": "Apply appropriate fungicides and practice crop rotation.",
    "diagnosis": "Small, circular lesions with dark centers on tomato leaves, often surrounded by yellow halos.",
    "steps_to_be_taken": "Prune lower leaves, remove infected debris, and provide adequate plant spacing."
  },
  "Tomato leaf": {
    "prescription": "Apply fungicides labeled for tomato diseases.",
    "diagnosis": "Varied symptoms including spots, lesions, and yellowing of leaves.",
    "steps_to_be_taken": "Monitor for signs of disease, improve plant nutrition, and control pests."
  },
  "Tomato leaf bacterial spot": {
    "prescription": "Apply copper-based fungicides or bactericides.",
    "diagnosis": "Water-soaked lesions with brown centers on tomato leaves, often accompanied by leaf yellowing.",
    "steps_to_be_taken": "Remove infected plant material, avoid overhead watering, and provide good air circulation."
  },
  "Tomato leaf late blight": {
    "prescription": "Apply appropriate fungicides containing chlorothalonil or copper-based compounds.",
    "diagnosis": "Large, irregular lesions with a water-soaked appearance on tomato leaves, often spreading rapidly in humid conditions.",
    "steps_to_be_taken": "Remove infected plant material, avoid overhead irrigation, and provide good air circulation."
  },
  "Tomato leaf mosaic virus": {
    "prescription": "There is no cure for viral infections. Control aphids and other vectors to prevent spread.",
    "diagnosis": "Mottled or distorted leaf patterns on tomato plants, sometimes with stunted growth.",
    "steps_to_be_taken": "Remove infected plants, control weeds, and use disease-free seedlings."
  },
  "Tomato leaf yellow virus": {
    "prescription": "There is no cure for viral infections. Control whiteflies and other vectors to prevent spread.",
    "diagnosis": "Yellowing of tomato leaves, sometimes with mosaic patterns and stunted growth.",
    "steps_to_be_taken": "Remove infected plants, control weeds, and use disease-resistant varieties."
  },
  "Tomato mold leaf": {
    "prescription": "Apply fungicides containing chlorothalonil or copper-based compounds.",
    "diagnosis": "Fuzzy white or gray patches on tomato leaves, often appearing in humid conditions.",
    "steps_to_be_taken": "Remove infected plant material, avoid overhead irrigation, and provide good air circulation."
  },
  "grape leaf": {
    "prescription": "Apply appropriate fungicides labeled for grape diseases.",
    "diagnosis": "Brown or reddish spots on grape leaves, sometimes with yellow halos.",
    "steps_to_be_taken": "Prune infected vines, remove fallen leaves, and provide adequate plant spacing."
  },
  "grape leaf black rot": {
    "prescription": "Apply fungicides containing copper or mancozeb.",
    "diagnosis": "Circular, black lesions with a reddish border on grape leaves, often leading to defoliation.",
    "steps_to_be_taken": "Prune infected vines, remove fallen leaves, and provide good air circulation."
  }
}

# Define a route for the root URL ("/")
@app.route("/")
def hello():
    return "Hello, You are not allowed here!"

def decode_base64_image(base64_string):
    img_data = base64.b64decode(base64_string)
    img = np.array(Image.open(io.BytesIO(img_data)).convert('RGB').resize((200, 200)))
    return img

@app.route('/predict/<string:problem_id>', methods=['POST'])
def predict(problem_id):
    # Fetch the farmerProblem data
    data = supabase.table('farmerProblem').select('*').eq('problem_id', problem_id).execute()

    if data.data:
        farmer_problem = data.data[0]
        farmer_id = farmer_problem['farmer_id']
        status = farmer_problem['status']

        # Check if the status is 'Incomplete'
        if status == 'Incomplete':
            base64image = farmer_problem['photo']
            img_array = decode_base64_image(base64image)
            preprocessed_img = np.expand_dims(img_array, axis=0)  # Add batch dimension

            predictions = model.predict(preprocessed_img)
            predicted_label_index = np.argmax(predictions)
            predicted_label = li[predicted_label_index]

            if predicted_label in plant_diseases:
                disease_info = plant_diseases[predicted_label]
                prescription = disease_info.get('prescription', 'Prescription not available')
                diagnosis = disease_info.get('diagnosis', 'Description not available')
                steps_to_be_taken = disease_info.get('steps_to_be_taken', 'No Steps To be Taken available')

                # Insert farmerResponse data
                supabase.table('farmerResponse').insert({
                    'problem_id': problem_id,
                    'farmer_id': farmer_id,
                    'predicted_label': predicted_label,
                    'prescription': prescription,
                    'diagnosis': diagnosis,
                    'steps_to_be_taken': steps_to_be_taken
                }).execute()

                # Update farmerProblem status to 'Completed'
                supabase.table('farmerProblem').update({'status': 'Completed'}).eq('problem_id', problem_id).execute()

                return jsonify({'predicted_label': predicted_label, 'prescription': prescription, 'diagnosis': diagnosis, 'steps_to_be_taken': steps_to_be_taken})
            else:
                return "Not Available in the dictionary"
        else:
            return jsonify({'error': 'The problem status is not "Incomplete"'}), 400
    else:
        return jsonify({'error': 'FarmerProblem not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
