import React, { useEffect, useRef, useState } from "react";
import "../css/messenger.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAxiosData, postAxiosData } from "../../axios/axiosConfig";
import { selectAuth } from "../../features/auth/authSlice";
import Topbar from "../../features/messenger/components/Topbar/Topbar";
import { IConversation, IMessage } from "../../features/messenger/types";
import Message from "../../features/messenger/components/Message/Message";
import socketIOClient from "socket.io-client";
import { socketURL } from "../../constants";

const socket = socketIOClient(socketURL);

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
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const scrollRef = useRef();
  // const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // lay thong tin cua cac user nhan dc tin nhan qua mang receiverIds
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

  // save message vao dung dia chi cua nguoi nhan
  useEffect(() => {
    if (arrivalMessage) {
      // neu tin nhan den dung voi cua so chat. chi thay doi khi co tin nhan moi den
      if (currentChat?.members.includes(arrivalMessage.sender)) {
        setMessages((prev) => [...prev, arrivalMessage] as any);
      }
      // neu chua mo cua so chat
      if (!currentChat) {
        console.log("!currentChat");
      }
      // da mo cua so chat nhung tin nhan den ko phai cua cua so chat
      if (
        currentChat &&
        !currentChat?.members.includes(arrivalMessage.sender)
      ) {
        console.log("currentChat");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  // socket logic start very importa ==========================
  // ket noi socket va disconnect
  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});

    socket.on("getMessageFromSocket", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("getMessageFromSocket");
    };
  }, []);

  // add user khi da ket noi va get user ve client
  useEffect(() => {
    socket.emit("addUserFromClient", user.id);
    socket.on("getUsersFromSocket", (users) => {
      // setOnlineUsers(
      //   user.followings.filter((f) =>
      //     users.some((u: { userId: string }) => u.userId === f)
      //   )
      // );
    });
  }, [user]);

  // neu co cua so chat thi lay tin nhan cua cuoc hoi thoai do
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

  //gui tinh nhan
  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (newMessage) {
      const message = {
        sender: user.id,
        text: newMessage,
        conversationId: currentChat?.id,
      };
      const receiverId = currentChat?.members.find(
        (member: string) => member !== user.id
      );
      socket.emit("sendMessageFromClient", {
        senderId: user.id,
        receiverId,
        text: newMessage,
      });
      const { resData, reFetchData } = (await postAxiosData(
        "/api/messages/create",
        accessToken,
        message,
        dispatch,
        `/api/messages/${currentChat?.id}`
      )) as any;
      if (resData && reFetchData) {
        setMessages(reFetchData.data.messages);
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    const current = scrollRef.current as any;
    current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                        <div key={index}  ref={scrollRef as any}>
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
