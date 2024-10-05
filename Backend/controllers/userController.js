import validator from "validator";
import userModel from "../models/userModel.js";

// Route for user login
const loginUser = async (req, res) => {};

/// Route for user register
const registerUser = async (req, res) => {
    try {
        const{name , email, password} = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, massage:"user already exists"});
        }

        // validating email format & storng password
        if (!validator.isEmail(email)) {
            return res.json({success:false, massage:"Please enter a valid email"});
        } 
        // 6:03:27 making register
    } catch (error) {
        
    }
};

// Route for admin login

const adminLogin = async (req, res) => {};

export { loginUser, registerUser, adminLogin };
