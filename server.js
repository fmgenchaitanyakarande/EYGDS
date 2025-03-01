const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('./models/User');
const Recipe = require('./models/Recipe');

const app = express();
const PORT = 3000;

app.use(express.json());

// Multer Configuration for File Uploads (Images/Videos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Home page API
app.get('/', (req, res) => {
    res.send("<h1 align=center>Welcome to the MERN Recipe Sharing Platform</h1>");
});

// User Registration API
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User Registered Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// User Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        res.json({ message: "Login Successful", username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Create Recipe API
app.post('/recipes/create', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        const { title, description, ingredients, instructions, createdBy } = req.body;
        const image = req.files['image'] ? req.files['image'][0].path : null;
        const video = req.files['video'] ? req.files['video'][0].path : null;

        const newRecipe = new Recipe({
            title,
            description,
            ingredients: JSON.parse(ingredients),
            instructions: JSON.parse(instructions),
            image,
            video,
            createdBy
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// View All Recipes API
app.get('/recipes/all', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('createdBy', 'username email');
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// View Single Recipe API
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username email');
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("DB connected successfully..")
).catch(
    (err) => console.log(err)
);

// Start Server
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port :" + PORT);
});
