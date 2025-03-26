from flask import Flask, jsonify
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)

# Load the saved models and preprocessors
rf_likelihood = joblib.load("rf_likelihood_model.joblib")
rf_magnitude = joblib.load("rf_magnitude_model.joblib")
scaler = joblib.load("scaler.joblib")
label_enc = joblib.load("label_encoder.joblib")

# Load and preprocess the current data
current_file_path = "current_seismic_activity.csv"
current_data = pd.read_csv(current_file_path)

# Convert date-time to proper format
current_data["Date_Time"] = pd.to_datetime(current_data["Date_Time"], errors="coerce")

# Encode categorical variables
if "Land_Use_Type" in current_data.columns:
    current_data["Land_Use_Type"] = current_data["Land_Use_Type"].map(
        lambda x: label_enc.transform([x])[0] if x in label_enc.classes_ else -1
    )

# Define features
features = [
    "Latitude", "Longitude", "Depth_km", "Fault_Line_Proximity_km",
    "Previous_Earthquake_Occurrences", "Population_Density", "Building_Density",
    "Land_Use_Type", "Temperature_C", "Humidity_%", "Rainfall_mm", "Tidal_Pressure_hPa"
]

# Process current data
X_current_scaled = scaler.transform(current_data[features])
current_data["Predicted_Likelihood_Score"] = rf_likelihood.predict(X_current_scaled)
current_data["Predicted_Magnitude"] = rf_magnitude.predict(X_current_scaled)
current_data["Earthquake_Occurs"] = np.where(current_data["Predicted_Likelihood_Score"] > 50, "Yes", "No")

# Select top 5 earthquakes with the highest magnitude
top_earthquakes = current_data.sort_values(by="Predicted_Magnitude", ascending=False).head(5)

@app.route('/api/earthquakes', methods=['GET'])
def get_earthquakes():
    # Convert the top earthquakes to a list of dictionaries
    earthquake_list = top_earthquakes[["Latitude", "Longitude", "Predicted_Likelihood_Score", "Predicted_Magnitude", "Earthquake_Occurs"]].to_dict('records')
    return jsonify(earthquake_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)