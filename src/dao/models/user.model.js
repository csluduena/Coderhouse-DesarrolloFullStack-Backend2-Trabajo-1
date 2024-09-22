import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
        ref: "Cart",
    },
    role: {
        type: String,
        default: "user",
    },
});

// Hash de la contraseña antes de guardarla
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
    console.log('Comparando:', password, 'con:', this.password);
    return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
