import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./useAuth";

export const useChat = create(
  persist(
    (set, get) => ({
      messages: [],
      users: [],
      selectedUser: null,
      isUserLoading: false,
      isMessageLoading: false,

      setSelectedUser: (user) => set({ selectedUser: user }),

      getUsers: async () => {
        set({ isUserLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          const usersData = Array.isArray(res.data.filteredUsers)
            ? res.data.filteredUsers
            : [];
          set({ users: usersData });
        } catch (error) {
          toast.error(error?.response?.data?.messages || "Đã có lỗi xảy ra");
        } finally {
          set({ isUserLoading: false });
        }
      },

      getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          const { message } = res.data;
          set({ messages: message });
        } catch (error) {
          toast.error(error?.response?.data?.messages || "Đã có lỗi xảy ra");
        } finally {
          set({ isMessageLoading: false });
        }
      },

      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        if (!selectedUser || !selectedUser._id) {
          toast.error("Không có người nhận tin nhắn");
          return;
        }

        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData
          );

          const newMessage = res.data;
          const newMessages = Array.isArray(messages)
            ? [...messages, newMessage]
            : [newMessage];

          set({ messages: newMessages });
        } catch (error) {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Đã có lỗi xảy ra";
          toast.error(message);
        }
      },

      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuth.getState().socket;

        socket.on("newMessage", (newMessage) => {
          const isFromOrToSelectedUser =
            newMessage.senderId === selectedUser._id ||
            newMessage.receiveId === selectedUser._id;

          if (!isFromOrToSelectedUser) return;

          const currentMessages = get().messages;

          // Optional: Check if message already exists
          const exists = currentMessages.some(
            (msg) => msg._id === newMessage._id
          );
          if (exists) return;

          set({
            messages: [...currentMessages, newMessage],
          });
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuth.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        selectedUser: state.selectedUser,
        messages: state.messages,
      }),
    }
  )
);
