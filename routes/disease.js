const multer = require("multer");
const path = require("path");
const express = require("express");
const app = express.Router();
const { spawn } = require('child_process');

// Storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000
    }
});

/* GET Endpoint for disease prediction
 * req must have form-data containting 
 * the plant image
 */
app.post("/upload", upload.single('crop'), (req,res) => {
    console.log(req.file.path);

    const inputData = JSON.stringify(req.file.path);
    
    // Call Python script for prediction
    const pythonProcess = spawn('python', ['./routes/predict.py'], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

    // Send input data to Python script
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    // Listen for data from Python script
    let predictionResult = '';
    pythonProcess.stdout.on('data', (data) => {
        predictionResult += data.toString();
    });

    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
        console.error("Error executing Python script:", data.toString().trim());
        res.status(500).json({ error: 'An error occurred during model inference.' });
    });

    // When Python script finishes
    pythonProcess.on('exit', (code) => {
        if (code === 0) {
            try {
                const prediction = JSON.parse(predictionResult);
                console.log("Prediction:", prediction.prediction); 
                res.json({ prediction: prediction.prediction }); 
            } catch (error) {
                console.error("Error parsing prediction result:", error);
                res.status(500).json({ error: 'An error occurred during prediction result parsing.' });
            }
        } else {
            console.error("Python script exited with non-zero exit code:", code);
            res.status(500).json({ error: 'An error occurred during model inference.' });
        }
    });
});

module.exports = app;
