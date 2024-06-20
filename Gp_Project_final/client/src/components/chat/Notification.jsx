import React, { useContext, useState, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";
import "./Notification.css"; // Make sure to import the CSS file

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = useMemo(
    () => unreadNotificationsFunc(notifications),
    [notifications]
  );

  const modifiedNotifications = useMemo(
    () =>
      notifications.map((n) => {
        const sender = allUsers.find((user) => user._id === n.senderId);
        return {
          ...n,
          senderName: sender?.name,
        };
      }),
    [notifications, allUsers]
  );

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification, userChats, user, notifications);
    setIsOpen(false);
  };

  return (
    <div className="notifications">
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="white"
          className="bi bi-chat-left-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        </svg>
        {unreadNotifications.length > 0 && (
          <span className="notification-count">
            <span>{unreadNotifications.length}</span>
          </span>
        )}
      </div>
      {isOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationAsRead(notifications)}
            >
              Mark all as read
            </div>
          </div>
          <div className="notifications-content">
            {modifiedNotifications.map((n, index) => (
              <div
                key={index}
                className={`notification ${n.isRead ? "" : "not-read"}`}
                onClick={() => handleNotificationClick(n)}
              >
                <span>{`${n.senderName} sent you a new message`}</span>
                <span className="notification-time">
                  {moment(n.date).calendar()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
