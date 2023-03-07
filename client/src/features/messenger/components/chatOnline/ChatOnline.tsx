import axios from "axios";
import { useEffect, useState } from "react";
import { IUser } from "../../../auth/types";
import { IConversation } from "../../types";
import "./chatOnline.css";

type Props = {
  onlineUsers: string[];
  currentId: string;
  setCurrentChat: (data: IConversation) => void;
};

export default function ChatOnline({
  onlineUsers = [],
  currentId = "",
  setCurrentChat = () => {},
}: Props) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {

      const res = await axios.get(
        "http://localhost:5001/api/users/friends/" + currentId
      );
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f: any) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user: IUser) => {
    try {
      const res = (await axios.get(
        `http://localhost:5001/api/conversations/find/${currentId}/${user._id}`
      )) as any;
      setCurrentChat(res.data as any);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o: any, index) => (
        <div
          className="chatOnlineFriend"
          onClick={() => handleClick(o)}
          key={index}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                // o?.profilePicture
                //   ? PF + o.profilePicture
                //   : PF + "person/noAvatar.png"
                o.profilePicture
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
