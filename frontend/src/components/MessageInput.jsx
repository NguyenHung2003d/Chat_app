import React, { useState, useRef } from "react";
import { useChat } from "../../store/useChat";
import { toast } from "react-toastify";
import { X, Image, Send } from "lucide-react";


const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChat();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) {
      toast.error("Vui lòng nhập tin nhắn hoặc chọn ảnh");
      return;
    }
    try {
        await sendMessage({
            text: text.trim(),
            image: imagePreview,
        });

        setText("");
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    } catch (error) {
        console.log('Lỗi khi gửi tin nhắn: ',error);
        toast.error("Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-base-300 rounded-full flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form
        className="flex  items-center gap-2"
        onSubmit={handleSendMessage}
      >
        <div className="flex-1 flex gap-2">
            <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="input w-full input-border rounded-lg input-sm sm:input-md"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <button
                type="button"
                className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <Image size={25}/>
            </button>
        </div>
        <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={!text.trim() && !imagePreview}
        >
            <Send size={25}/>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
