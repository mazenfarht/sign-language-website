import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useEffect } from "react";

const BoxChat = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const [textMessage, setTextMessage] = useState("");
  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  const [showChat, setShowChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleButtonClick = () => {
    // Change the URL
    window.location.href = 'http://127.0.0.1:5000';
    // Show the video call component
    setShowVideoCall(true);
  };

  // Exclude chat with admin users
  if (recipientUser?.role === 'admin')
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Chat with admin is not allowed...
      </p>
    );

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation selected yet...
      </p>
    );

  if (isMessagesLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Loading chat...
      </p>
    );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
        {showChat}
        {!showChat && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="button"
            width="25"
            height="20"
            fill="currentColor"
            className="bi bi-camera-video-fill"
            onClick={handleButtonClick}
            viewBox="0 0 16 16"
            style={{ marginLeft: "750px" }}
          >
            <path
              fill-rule="evenodd"
              d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
            />
          </svg>
        )}
      </div>

      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === user?._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>

      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,233,0.2)"
        />

        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat?._id, setTextMessage)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default BoxChat;
