import React, { useEffect, useState } from "react";
import "../css/messenger.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAxiosData, postAxiosData } from "../../axios/axiosConfig";
import { selectAuth } from "../../features/auth/authSlice";
import Topbar from "../../features/messenger/components/Topbar/Topbar";
import { IConversation, IMessage } from "../../features/messenger/types";
import Message from "../../features/messenger/components/Message/Message";

type Props = {
  conversations: IConversation[];
  receiverIds: any[];
};

const MessengerHomePage = ({ conversations = [], receiverIds = [] }: Props) => {
  const { user, accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const [receiverUsers, setReceiverUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    (async () => {
      if (receiverIds.length > 0) {
        const { resData } = (await postAxiosData(
          "/api/auth/receivers",
          accessToken,
          { receiverIds },
          dispatch
        )) as any;
        if (resData) {
          const users = resData.data.users.map((user: any) => {
            return {
              id: user.id,
              email: user.email,
            };
          });
          setReceiverUsers(users);
        }
      }
    })();
  }, [accessToken, dispatch, receiverIds]);

  useEffect(() => {
    (async () => {
      if (currentChat) {
        const resData = (await getAxiosData(
          `/api/messages/${currentChat.id}`,
          accessToken,
          dispatch
        )) as any;
        setMessages(resData.data.messages);
      }
    })();
  }, [accessToken, currentChat, dispatch]);

  const onSetCurrentChat = async (conversation: IConversation) => {
    setCurrentChat(conversation);
  };

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: currentChat?.id,
    };

    const { resData } = (await postAxiosData(
      "/api/messages/create",
      accessToken,
      message,
      dispatch
    )) as any;
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {receiverUsers &&
              receiverUsers.length > 0 &&
              receiverUsers.map((receiver: any, index: number) => {
                const conver = conversations.filter((conv: any) => {
                  return (
                    conv.members.includes(receiver.id) &&
                    conv.members.includes(user.id)
                  );
                });
                return (
                  <div
                    onClick={() => onSetCurrentChat(conver[0] as IConversation)}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    {receiver.email}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages &&
                    messages.length > 0 &&
                    messages.map((m, index) => {
                      return (
                        <div key={index}>
                          <Message message={m} own={m.sender === user.id} />
                        </div>
                      );
                    })}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {/* <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={onSetCurrentChat}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessengerHomePage;
