import React from "react";
import { Route, Routes } from "react-router-dom";
import MessengerHomePage from "../pages/messenger/MessengerHomePage";
import MessengerPage from "../pages/messenger";
import MessengerId from "../pages/messenger/MessengerId";


type Props = {};

const MessengerRoute = (props: Props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MessengerPage />}>
          <Route index element={<MessengerHomePage />} />
          <Route path=":id" element={<MessengerId />} />
        </Route>
      </Routes>
    </>
  );
};

export default MessengerRoute;
