import { useChat } from "../../store/useChat";
import { X } from "lucide-react";
import { useAuth } from "../../store/useAuth";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 relative rounded-full">
              <img
                src={selectedUser?.profilePic || "/avatar-15-32.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>
          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Close Button */}
        <button onClick={() => setSelectedUser(null)}>
        <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
