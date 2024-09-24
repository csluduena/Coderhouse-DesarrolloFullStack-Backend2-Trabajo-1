import mongoose from "mongoose";
import bcrypt from "bcrypt";
import CartModel from "./cart.model.js"; // Importa el modelo de carrito

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart", // Referencia al modelo de carrito
    },
    role: {
        type: String,
        default: "user",
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    console.log('Comparando:', password, 'con:', this.password);
    return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;