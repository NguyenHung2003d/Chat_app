import { useState } from "react";
import { useAuth } from "../../store/useAuth";
import {
  MessageSquare,
  User,
  Mail,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSignup } = useAuth();

  const validateForm = () => {
    if (!formData.fullName.trim())
      return toast.error("Vui lòng nhập họ và tên", { position: "top-center" });
    if (!formData.email.trim())
      return toast.error("Vui lòng nhập email", { position: "top-center" });
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return toast.error("Định dạng email sai", { position: "top-center" });
    if (!formData.password.trim())
      return toast.error("Vui lòng nhập mật khẩu", { position: "top-center" });
    if (formData.password.length < 6)
      return toast.error("Mật khẩu phải có ít nhất 6 kí tự", {
        position: "top-center",
      });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return
    try {
      await signup(formData); 
      navigate("/login");
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
    }
  };
  
  return (
    <div className="min-h-screen bg-base-200 grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12  ">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Tạo tài khoản mới</h1>
              <p className="text-base-content/60">
                Đăng ký tài khoản miễn phí để bắt đầu!
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Họ và tên</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="email@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mật khẩu</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSignup}
            >
              {isSignup ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Đã có tài khoản ? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments and stay in touch with you"
      />
    </div>
  );
};

export default SignUpPage;
