import mongoose from "mongoose";

const db = "MongoDB"

mongoose.connect("mongodb+srv://csluduena:coderhouse@cluster0.xa9uk.mongodb.net/GuitarStore?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log(`Successful connection - ${db}`))
    .catch((error) => console.log(`Error connecting - ${db}`, error))
    