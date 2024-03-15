const express = require("express");
const cors = require("cors");
const multer = require("multer");

// routes
const app = express();
const disease = require("./routes/disease");
const recommend = require("./routes/recommend");

// cors
app.use(cors({ origin: true, credentials: true }));

// init middleware
app.use(express.json());
app.use(express.urlencoded());

// use routes
app.use("/disease", disease);
app.use("/recommend", recommend);

const port = 8082;

app.listen(port, () => console.log(`server running on port ${port}`));

app.get("/", async (req, res) => {
    try {
        res.json({ message: "samrat op" });
    } catch (e) {
        console.log(e);
    }
});


function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        });
    }
}

app.use(errHandler);

app.use('/crop', express.static('upload/images'));
