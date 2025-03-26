import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Initialize Firebase Admin
cred = credentials.Certificate("stormify-363d8-firebase-adminsdk-fbsvc-b698d8471e.json")  # Path to your Firebase key
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load the datasets
historic_file_path = "historic_earthquake_data.csv"
current_file_path = "current_seismic_activity.csv"

historic_data = pd.read_csv(historic_file_path)
current_data = pd.read_csv(current_file_path)

# Convert date-time to proper format
historic_data["Date_Time"] = pd.to_datetime(historic_data["Date_Time"], errors="coerce")
current_data["Date_Time"] = pd.to_datetime(current_data["Date_Time"], errors="coerce")

# Encode categorical variables
label_enc = LabelEncoder()
if "Land_Use_Type" in historic_data.columns:
    historic_data["Land_Use_Type"] = label_enc.fit_transform(historic_data["Land_Use_Type"].astype(str))
if "Land_Use_Type" in current_data.columns:
    current_data["Land_Use_Type"] = current_data["Land_Use_Type"].map(lambda x: label_enc.transform([x])[0] if x in label_enc.classes_ else -1)

# Define features and targets
features = [
    "Latitude", "Longitude", "Depth_km", "Fault_Line_Proximity_km", 
    "Previous_Earthquake_Occurrences", "Population_Density", "Building_Density",
    "Land_Use_Type", "Temperature_C", "Humidity_%", "Rainfall_mm", "Tidal_Pressure_hPa"
]

X = historic_data[features]
y_likelihood = historic_data["Earthquake_Likelihood_Score"]
y_magnitude = historic_data["Magnitude"]

# Standardize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split
X_train, X_test, y_train_likelihood, y_test_likelihood = train_test_split(X_scaled, y_likelihood, test_size=0.2, random_state=42)
X_train, X_test, y_train_magnitude, y_test_magnitude = train_test_split(X_scaled, y_magnitude, test_size=0.2, random_state=42)

# Train Random Forest models
rf_likelihood = RandomForestRegressor(n_estimators=200, random_state=42)
rf_magnitude = RandomForestRegressor(n_estimators=200, random_state=42)

rf_likelihood.fit(X_train, y_train_likelihood)
rf_magnitude.fit(X_train, y_train_magnitude)

# Process current data
X_current_scaled = scaler.transform(current_data[features])
current_data["Predicted_Likelihood_Score"] = rf_likelihood.predict(X_current_scaled)
current_data["Predicted_Magnitude"] = rf_magnitude.predict(X_current_scaled)
current_data["Earthquake_Occurs"] = np.where(current_data["Predicted_Likelihood_Score"] > 50, "Yes", "No")

# Select top 3 earthquakes with the highest magnitude
top_earthquakes = current_data.sort_values(by="Predicted_Magnitude", ascending=False).head(5)

# Store in Firestore
data_to_store = top_earthquakes[["Latitude", "Longitude", "Predicted_Likelihood_Score", "Predicted_Magnitude", "Earthquake_Occurs"]].to_dict(orient="records")
db.collection("earthquake_predictions").add({"predictions": data_to_store})

# Print Output for Debugging
print(data_to_store)
