import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

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
    current_data["Land_Use_Type"] = current_data["Land_Use_Type"].map(
        lambda x: label_enc.transform([x])[0] if x in label_enc.classes_ else -1
    )

# Save the label encoder
joblib.dump(label_enc, "label_encoder.joblib")

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

# Save the scaler
joblib.dump(scaler, "scaler.joblib")

# Train-test split
X_train, X_test, y_train_likelihood, y_test_likelihood = train_test_split(X_scaled, y_likelihood, test_size=0.2, random_state=42)
X_train, X_test, y_train_magnitude, y_test_magnitude = train_test_split(X_scaled, y_magnitude, test_size=0.2, random_state=42)

# Train Random Forest models
rf_likelihood = RandomForestRegressor(n_estimators=200, random_state=42)
rf_magnitude = RandomForestRegressor(n_estimators=200, random_state=42)

rf_likelihood.fit(X_train, y_train_likelihood)
rf_magnitude.fit(X_train, y_train_magnitude)

# Save the trained models
joblib.dump(rf_likelihood, "rf_likelihood_model.joblib")
joblib.dump(rf_magnitude, "rf_magnitude_model.joblib")

# Predict and evaluate
y_pred_likelihood = rf_likelihood.predict(X_test)
y_pred_magnitude = rf_magnitude.predict(X_test)

mae_likelihood = mean_absolute_error(y_test_likelihood, y_pred_likelihood)
mae_magnitude = mean_absolute_error(y_test_magnitude, y_pred_magnitude)

# Process current data
X_current_scaled = scaler.transform(current_data[features])
current_data["Predicted_Likelihood_Score"] = rf_likelihood.predict(X_current_scaled)
current_data["Predicted_Magnitude"] = rf_magnitude.predict(X_current_scaled)
current_data["Earthquake_Occurs"] = np.where(current_data["Predicted_Likelihood_Score"] > 50, "Yes", "No")

# Select top 5 earthquakes with the highest magnitude
top_earthquakes = current_data.sort_values(by="Predicted_Magnitude", ascending=False).head(5)

# Display predictions
print("Mean Absolute Error - Likelihood Score:", mae_likelihood)
print("Mean Absolute Error - Magnitude:", mae_magnitude)
print(top_earthquakes[["Latitude", "Longitude", "Predicted_Likelihood_Score", "Predicted_Magnitude", "Earthquake_Occurs"]])