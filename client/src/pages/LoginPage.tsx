import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { login } from "../axios/axiosConfig";
import { useAuthen } from "../helpers/useAuthen";
import "./login.scss";

const formDataDefaultValue = {
  email: "admin@gmail.com",
  password: "123456",
};
type Props = {};

const LoginPage = (props: Props) => {
  useAuthen();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(formDataDefaultValue);
  const { email, password } = formData;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    login(formData, dispatch);
  };
  return (
    <div className="login">
      <div className="background"></div>
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="Password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <button type="submit">Log In</button>
        <div className="social">
          <div className="go">
            <i className="fab fa-google" /> Google
          </div>
          <div className="fb">
            <i className="fab fa-facebook" /> Facebook
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
