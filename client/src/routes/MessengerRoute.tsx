import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import MessengerHomePage from "../pages/messenger/MessengerHomePage";
import MessengerPage from "../pages/messenger";
import MessengerId from "../pages/messenger/MessengerId";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { useFetch } from "../axios/axiosConfig";
import { IConversation } from "../features/messenger/types";

type Props = {};

const MessengerRoute = (props: Props) => {
  const { user, accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [receiverIds, setReceiverIds] = useState([]);
  const { data } = useFetch(
    `/api/conversations/${user.id}`,
    accessToken,
    dispatch
  );
  useEffect(() => {
    if (data && data.conversations && data.conversations.length > 0) {
      setConversations(data.conversations as IConversation[]);
      const arr = data.conversations.map((conv: any) => {
        const id = conv.members.filter((member: any) => {
          return member !== user.id;
        });
        return id[0];
      });
      setReceiverIds(arr);
    }
  }, [data, user.id]);
  return (
    <>
      <Routes>
        <Route path="/" element={<MessengerPage />}>
          {data && (
            <Route
              index
              element={
                <MessengerHomePage
                  conversations={conversations}
                  receiverIds={receiverIds}
                />
              }
            />
          )}
          <Route path=":id" element={<MessengerId />} />
        </Route>
      </Routes>
    </>
  );
};

export default MessengerRoute;
