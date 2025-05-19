import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, password, email } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập các trường bắt buộc ... ",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải ít nhất 6 kí tự ...",
      });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email đã tồn tại. Vui lòng dùng email khác và thử lại..." });
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Không thể xác định thông tin người dùng ... " });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Lỗi máy chủ. Vui lòng liên hệ admin ..." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Kiểm tra đầu vào thiếu
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đầy đủ email và mật khẩu." });
  }

  try {
    // 2️⃣ Kiểm tra người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." }); // Ẩn thông tin chi tiết để tránh dò người dùng
    }

    // 3️⃣ So sánh mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." }); // Tránh phân biệt email đúng hay sai
    }

    // 4️⃣ Tạo token và gửi về client (cookie hoặc token thường)
    generateToken(user._id, res);

    // 5️⃣ Gửi thông tin người dùng (không bao gồm password)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Thiếu ảnh đại diện kìa bạn ơi ..." });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).json({ updateUser });
  } catch (error) {
    console.log("Lỗi trong cập nhật ảnh đại diện ... ", error);
    res.status(500).json({ message: "Lỗi ở máy chủ rồi. Liên hệ admin ngay nhé ..." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
