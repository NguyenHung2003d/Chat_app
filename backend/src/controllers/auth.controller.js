import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../configs/emailTransporter.js";

const validateSignupInput = ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    return "Vui lòng điền đầy đủ thông tin.";
  }

  if (fullName.trim().length < 2) {
    return "Tên phải có ít nhất 2 ký tự.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email không hợp lệ.";
  }

  if (password.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  return null;
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  const validationError = validateSignupInput({ fullName, email, password });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email đã được sử dụng. Vui lòng dùng email khác." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.message);
    res.status(500).json({ message: "Máy chủ lỗi. Vui lòng thử lại sau." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đầy đủ email và mật khẩu." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    generateToken(user._id, res);

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Vui lòng nhập email." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản với email này.",
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 phút

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Mã xác nhận đặt lại mật khẩu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Khôi phục mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Mã xác nhận của bạn là:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 16px 0;">
            ${resetCode}
          </div>
          <p style="color: #666; font-size: 14px;">
            Mã này sẽ hết hạn sau 10 phút.
          </p>
          <p style="color: #666; font-size: 14px;">
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "Đã gửi mã xác nhận đến email. Vui lòng kiểm tra hộp thư của bạn.",
    });
  } catch (error) {
    console.error("Lỗi khi gửi email khôi phục:", error.message);
    res.status(500).json({
      message: "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới." });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Mật khẩu phải có ít nhất 6 ký tự.",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.",
    });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error.message);
    res.status(500).json({
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

export const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn.",
      });
    }

    res.status(200).json({
      message: "Token hợp lệ.",
      email: user.email,
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra token:", error.message);
    res.status(500).json({
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Thiếu ảnh đại diện kìa bạn ơi ..." });
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
    res
      .status(500)
      .json({ message: "Lỗi ở máy chủ rồi. Liên hệ admin ngay nhé ..." });
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
