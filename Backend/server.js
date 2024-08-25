import app from "./app.js";
import cloudinary from "cloudinary"
import path from "path"
import express from "express";


const port = process.env.PORT || 5000;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const __dirname = path.resolve();


app.use(express.static(path.join(__dirname, '/Frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
})