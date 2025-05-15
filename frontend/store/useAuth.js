import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";

export const useAuth = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignup: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Lỗi trong checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Đăng nhập thành công", { position: "top-center" });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSignup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Tài khoản được tạo thành công", {
        position: "top-center",
      });
    } catch (error) {
      console.log("Signup Error:", error);
      toast.error(
        error.response?.data?.message || "Đăng ký lỗi. Vui lòng thử lại"
      );
    } finally {
      set({ isSignup: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Đăng xuất tài khoản thành công", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },
}));
