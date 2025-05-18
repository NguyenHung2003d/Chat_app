import { useEffect, useState } from "react";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { Users } from "lucide-react";
import { useChat } from "../../store/useChat";
import { useAuth } from "../../store/useAuth";

const SlideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } =
    useChat();

  // Lấy danh sách người dùng từ useChat
  const { onlineUsers } = useAuth();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUserLoading) return <SideBarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">
            Những liên hệ khác
          </span>
        </div>
        {/* Tìm kiếm người dùng */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span className="text-sm">Chỉ hiển thị người hoạt động</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} người đang hoạt động)
          </span>
        </div>
        {/* Danh sách liên hệ */}
        <div className="overflow-y-auto w-full py-3">
          {Array.isArray(users) &&
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id
                    ? "bg-base-200 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar-15-32.png"}
                    alt={user.name}
                    className="size-12 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border ring-2 ring-base-900 rounded-full" />
                  )}
                </div>
                {/* Thông tin người dùng */}
                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-sm text-zinc-500">
                    {onlineUsers.includes(user._id)
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </div>
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center text-sm text-zinc-500 py-4">
                Không có người dùng nào
              </div>
            )}
        </div>
      </div>
    </aside>
  );
};
export default SlideBar;
