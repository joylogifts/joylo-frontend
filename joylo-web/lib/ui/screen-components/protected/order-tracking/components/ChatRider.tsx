import React, { useState } from "react";
import { useLangTranslation } from "@/lib/context/global/language.context";
import ChatWithRiderModal from "./chatwithrider-modal";

interface ChatRiderProps {
    orderId: string;
    customerId: string;
}

const ChatRider: React.FC<ChatRiderProps> = ({ orderId, customerId }) => {
    const [showChats, setShowChats] = useState(false);

    const showChatWithRider = () => {
        setShowChats(true);
    };
    const { getTranslation } = useLangTranslation();
    return (
        <div>
            <button
                onClick={showChatWithRider}
                className="p-2 bg-[#FFA500] mx-2 my-2 rounded text-white w-[300px]"
            >
                {getTranslation("chat_with_rider_button")}
            </button>
            <ChatWithRiderModal
                visible={showChats}
                onHide={() => setShowChats(false)}
                orderId={orderId}
                currentUserId={customerId}
            />
        </div>
    );
};

export default ChatRider;
