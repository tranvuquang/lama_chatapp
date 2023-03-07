import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";

type Props = { children: ReactNode };

const PrivateRoute = ({ children }: Props) => {
  const { user, accessToken } = useAppSelector(selectAuth);
  return (
    <>
      {user && accessToken ? children : <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
