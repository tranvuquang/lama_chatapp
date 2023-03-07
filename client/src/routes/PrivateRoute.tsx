import React, { ReactNode } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

type Props = { children: ReactNode };

const PrivateRoute = ({ children }: Props) => {
  //   const [user] = useAuthState(auth);
  const user = true;
  return (
    <>
      {user ? children : <Navigate to="/login" />}
      {/* {children} */}
    </>
  );
};

export default PrivateRoute;
