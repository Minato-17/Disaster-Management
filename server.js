const express = require("express");
const { spawn } = require("child_process");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Initialize Firebase Admin
const serviceAccount = require("./stormify-363d8-firebase-adminsdk-fbsvc-b698d8471e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.post("/predict", async (req, res) => {
  const pythonProcess = spawn("python", ["app.py"]);

  let output = "";
  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on("close", async (code) => {
    console.log(`Python script exited with code ${code}`);

    if (output.trim()) {
      try {
        const predictions = JSON.parse(output);
        const docRef = db.collection("predictions").doc();
        await docRef.set(predictions);
        res.json({ success: true, message: "Prediction stored", data: predictions });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        res.status(500).json({ success: false, message: "Error saving to Firestore" });
      }
    } else {
      res.status(500).json({ success: false, message: "No output from Python script" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
