import { useState } from "react";
import { Mail, LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";
import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Vui lòng nhập email.");

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      console.log(response);
      navigate('/reset-password')
      toast.success("Đang chuyển đến trang nhập mã xác nhận...");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Gửi email thất bại, thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-base-200 grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Quên mật khẩu?</h1>
              <p className="text-base-content/60">
                Nhập email để nhận liên kết khôi phục
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  <span className="ml-2">Đang gửi...</span>
                </>
              ) : (
                "Gửi liên kết khôi phục"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Quay lại{" "}
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Reset your password"
        subtitle="We'll help you recover your account in just a few steps"
      />
    </div>
  );
};

export default ForgotPasswordPage;
