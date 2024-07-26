const User = require("../models/userSchema");
const Errorhandler = require("../utils/Errorhandler");
const bcrypt = require("bcrypt");
const savetoken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const register = async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      password,
      avatar: {
        public_id: "id",
        url: "url",
      },
    });
    const savedUser = await newUser.save();
    savetoken(savedUser, res, 201);

  } catch (error) {

    return next(new Errorhandler(error.message, 401));
  }
};

const getUserProfile = async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id);
   
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
   
    return next(new Errorhandler(error.message, 401));
  }
};
const updatePassword = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const isMatching = user.comparePassword(oldPassword);
    if (!isMatching)
      return next(new Errorhandler("Old password is incorrect", 400));
    if (newPassword !== confirmPassword)
      return next(new Errorhandler("Password not matching"));
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    savetoken(user, res, 201);
  } catch (error) {
    return next(new Errorhandler(error.message, 400));
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(201).json({ success: true, users });
  } catch (error) {
    return next(new Errorhandler(error.message, 400));
  }
};
const getUserInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new Errorhandler("invalid user", 401));
    const userInfo = await User.findById(id);
    if (!userInfo) return next(new Errorhandler("User does not exist", 400));
    return res.json({ success: true, userInfo });
  } catch (error) {
    return next(new Errorhandler(error.message, 400));
  }
};
const updateUserRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new Errorhandler("invalid user", 401));
    const role = req.body.role;
    const newUser = await User.findByIdAndUpdate(id, { role }, { new: true });
  
    res.json({ success: true, newUser });
  } catch (error) {
    return next(new Errorhandler(error.message, 401));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new Errorhandler("invalid user", 401));
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return next(new Errorhandler("User does not exist", 402));

    return res.json({ success: true, deletedUser });
  } catch (error) {
    return next(new Errorhandler(error.message, 401));
  }
};
const login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email) return next(new Errorhandler("Please enter your email", 400));
    if (!password)
      return next(new Errorhandler("Please enter your password", 400));
    const user = await User.findOne({ email }).select("+password");
     if (!user)
      return next(new Errorhandler("Invalid username or password", 400));
    const result = await user.comparePassword(password);
    if (!result)
      return next(new Errorhandler("Invalid email or password", 400));

    savetoken(user, res, 201);
  } catch (error) {
   
    return next(new Errorhandler(error.message, 401));
  }
};
const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return res.json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
   
    return next(new Errorhandler(error.message, 401));
  }
};
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.user;
    if (!email) return next(new Errorhandler("not a valid email", 401));
    sendEmail({ email, userId: req.user._id });
    return res.json({
      success: true,
      message: "successfully sned the email to the recipient",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 401));
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    if (decodedData.id.toString() !== req.user._id.toString())
      return res.send("error");
    const hashedPassowrd = await bcrypt.hash(newPassword, 10);
    const response = await User.findByIdAndUpdate(decodedData.id, {
      password: hashedPassowrd,
    });
    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 401));
  }
};
module.exports = {
  getUserProfile,
  updatePassword,
  getAllUsers,
  getUserInfo,
  updateUserRole,
  deleteUser,
  register,
  login,
  logout,
  forgetPassword,
  resetPassword,
};
