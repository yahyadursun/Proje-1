import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const CreateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, massage: "User doesn't exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = CreateToken(user._id);
      res.json({ success: true, token });
    }
    else{
        res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false,message:error.message });
  }
};

/// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, massage: "user already exists" });
    }

    // validating email format & storng password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        massage: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        massage: "Please enter a strong password",
      });
    }

    // hashing user paswword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    // Creating token
    const user = await newUser.save(); // for store database

    const token = CreateToken(user._id); // _id is auto genereted value in mongodb

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = CreateToken(email+password)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        res.json({success:false,message:error.message})
    }
};

export { loginUser, registerUser, adminLogin };
