import "./message.css";
// import { format } from "timeago.js";
import { IMessage } from "../../types";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../auth/authSlice";

type Props = {
  recievePicture?: string;
  own: boolean;
  message: IMessage;
};

export default function Message({
  message,
  own,
  recievePicture = "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
}: Props) {
  const { user } = useAppSelector(selectAuth);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={recievePicture}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        {/* {format(message.createdAt)} */ message.createdAt}
      </div>
    </div>
  );
}
