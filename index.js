const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const userModel = require("./models/datify");

const app = express();
const PORT = 3001;

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from React
app.use("/uploads", express.static(uploadDir)); // Serve uploaded images statically

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set destination folder to "uploads"
  },
  filename: (req, file, cb) => {
    const filename = `photo-${Date.now()}.${file.mimetype.split("/")[1]}`; // Create a unique filename
    cb(null, filename);
  },
});

const upload = multer({ storage });

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/datify", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ** API Endpoints **

// Register route
app.post("/register", upload.single("photo"), (req, res) => {
  const { name, email, college, gender, insta, password, age, bio } = req.body;
  const photo = req.file ? req.file.filename : null; // Use the filename from multer

  userModel
    .create({
      name,
      email,
      college,
      gender,
      insta,
      password,
      photo,
      age,
      bio,
    })
    .then((user) => res.json({ message: "User registered successfully", user }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("success");
        } else {
          res.json("password is incorrect");
        }
      } else {
        res.json("no record existed");
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Fetch users route for Swipeable Cards
app.get("/api/users", (req, res) => {
  userModel
    .find({}, "name age photo bio insta") // Fetch only name, age, photo, and bio
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});   
