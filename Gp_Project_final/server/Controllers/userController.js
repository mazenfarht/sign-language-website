const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await userModel.findOne({ email });

        if (user)
            return res.status(400).json("User with the given email already exists...");

        if (!name || !email || !password)
            return res.status(400).json("All fields are required...");

        if (!validator.isEmail(email))
            return res.status(400).json("Email must be a valid email...");

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password must be a strong password...");

        user = new userModel({ name, email, password, role });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name, email, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (!user)
            return res.status(400).json("Invalid email or Password...");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(400).json("Invalid email or Password...");

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json("User not found");
        }

        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json("Profile updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
};
const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Find and delete the user
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


module.exports = {registerUser, loginUser, findUser , getUsers,updateUser, deleteUser};
