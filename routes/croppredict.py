import pickle
import json
import sys

# Mapping of predictions to crop names
crop_mapping = {
    0: 'apple',
    1: 'banana',
    2: 'blackgram',
    3: 'chickpea',
    4: 'coconut',
    5: 'coffee',
    6: 'cotton',
    7: 'grapes',
    8: 'jute',
    9: 'kidneybeans',
    10: 'lentil',
    11: 'maize',
    12: 'mango',
    13: 'mothbeans',
    14: 'mungbean',
    15: 'muskmelon',
    16: 'orange',
    17: 'papaya',
    18: 'pigeonpeas',
    19: 'pomegranate',
    20: 'rice',
    21: 'watermelon',
}

# Load 
with open("./data/model.pkl", "rb") as f:
    model = pickle.load(f)

# Read input data 
input_data_json = sys.stdin.read().strip()
input_data = json.loads(input_data_json)

# Extract input features
temperature = input_data['temp']
humidity = input_data['humidity']
rainfall = input_data['rainfall']
ph = input_data['ph']
N = input_data['N']
P = input_data['P']
K = input_data['K']

# Make predictions 
prediction = model.predict([[N,P,K,temperature, humidity, ph, rainfall]])

# Convert to crop name
predicted_crop = crop_mapping[prediction[0]]

# Prepare as JSON
prediction_result = {"prediction": predicted_crop}

print(json.dumps(prediction_result))

