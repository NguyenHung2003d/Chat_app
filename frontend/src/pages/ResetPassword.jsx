import { useState } from "react";
import { Lock, LoaderCircle, KeyRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [inputToken, setInputToken] = useState(token || "");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputToken || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ mã xác nhận và mật khẩu mới.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        `/auth/reset-password/${inputToken}`,
        { password: newPassword }
      );
      console.log(response);

      toast.success("Nhập mã xác minh thành công !!!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Đặt lại mật khẩu thất bại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-base-200 grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <KeyRound className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Đặt lại mật khẩu</h1>
              <p className="text-base-content/60">
                Nhập mã xác nhận và mật khẩu mới để tiếp tục
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mã xác nhận</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Mã từ email"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mật khẩu mới</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  <span className="ml-2">Đang cập nhật...</span>
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Quay lại{" "}
              <span
                className="text-primary hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Secure your account"
        subtitle="Enter your reset code and set a new password"
      />
    </div>
  );
};

export default ResetPasswordPage;
