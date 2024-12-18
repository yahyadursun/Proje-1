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
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = CreateToken(email + password);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const {userId} = req.body; // authUser middleware'den gelen kullanıcı ID'si
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {userId} = req.body; // auth middleware'den gelen user id
    const { name, surname, email } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, surname, email },
      { new: true, runValidators: true } // `new` updated user'ı döner, `runValidators` doğrulamayı etkinleştirir
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({
      success: true,
      message: "Profil güncellendi.",
      user: {
        name: updatedUser.name,
        surname: updatedUser.surname,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};



export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile};
