const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const postRoute = require("./Routes/postRoute");
const userModel = require("./Models/userModel");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
    res.send("Welcome to our chat app...");
});

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000;
const uri = process.env.ALIAS_URI;

const createAdminAccount = async () => {
    const email = "admin@example.com";
    const password = "Admin@123";
    const role = "admin";

    let user = await userModel.findOne({ email });

    if (!user) {
        user = new userModel({ name: "Admin", email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        console.log("Admin account created.");
    } else {
        console.log("Admin account already exists.");
    }
    console.log("Admin User: ", user);  // Log the admin user
};

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connection established");
        createAdminAccount();
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

  // Define a Video schema
  const videoSchema = new mongoose.Schema({
    title: String,
    url: String,
    letter: String,
  });

const Video = mongoose.model('Video', videoSchema);
// Create a new video
app.post('/api/videos', async (req, res) => {
    const { title, url, letter } = req.body;
    const video = new Video({ title, url, letter });
    await video.save();
    res.send(video);
  });
  
  // Get videos by letter
  app.get('/api/videos/:letter', async (req, res) => {
    const { letter } = req.params;
    const videos = await Video.find({ letter });
    res.send(videos);
  });
  
  // Get all videos
  app.get('/api/videos', async (req, res) => {
    const videos = await Video.find();
    res.send(videos);
  });
  
  app.delete('/api/videos/:id', async (req, res) => {
      const { id } = req.params;
      const result = await Video.findByIdAndDelete(id);
      res.send(result);
    });
