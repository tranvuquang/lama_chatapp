import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { baseURL } from "../constants";

import {
  setAccessTokenRedux,
  setLoadingRedux,
  setUserRedux,
} from "../features/auth/authSlice";
import { userDefaultData } from "../features/auth/types";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
  },
  // withCredentials: true,
});

export const useFetch = (
  url: string = "",
  accessToken: string | null = "",
  dispatch: Dispatch<AnyAction>
) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      dispatch(setLoadingRedux(true));
      try {
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
        dispatch(setLoadingRedux(false));
      }
    })();
  }, [accessToken, dispatch, url]);

  return { error, loading, data: data as AxiosResponse<any, any> } as any;
};

export const getAxiosData = async (
  url: string = "",
  accessToken: string | null = "",
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(setLoadingRedux(true));
  try {
    const resData = (await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as AxiosResponse<any, any>;
    return resData;
  } catch (error: any) {
    console.log(error.message);
    return;
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const putAxiosData = async (
  url: string = "",
  accessToken: string | null = "",
  payload: any = {},
  dispatch: Dispatch<AnyAction>,
  reFetchUrl: string = ""
) => {
  dispatch(setLoadingRedux(true));
  try {
    let reFetchData = {};
    const resData = (await axiosInstance.put(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as AxiosResponse<any, any>;
    if (resData && reFetchUrl) {
      let reFetchData = (await getAxiosData(
        reFetchUrl,
        accessToken,
        dispatch
      )) as any;
      return { resData, reFetchData };
    }
    return { resData, reFetchData };
  } catch (error: any) {
    console.log(error.message);
    return;
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const postAxiosData = async (
  url: string = "",
  accessToken: string | null = "",
  payload: any = {},
  dispatch: Dispatch<AnyAction>,
  reFetchUrl: string = ""
) => {
  dispatch(setLoadingRedux(true));
  try {
    let reFetchData = {};
    const resData = (await axiosInstance.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as AxiosResponse<any, any>;

    if (resData && reFetchUrl) {
      let reFetchData = (await getAxiosData(
        reFetchUrl,
        accessToken,
        dispatch
      )) as any;
      return { resData, reFetchData };
    }
    return { resData, reFetchData };
  } catch (error: any) {
    console.log(error.message);
    return;
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const deleteAxiosData = async (
  url: string = "",
  accessToken: string | null = "",
  payload: any = {},
  dispatch: Dispatch<AnyAction>,
  reFetchUrl: string = ""
) => {
  dispatch(setLoadingRedux(true));
  try {
    let reFetchData = {};
    const resData = (await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: payload,
    })) as AxiosResponse<any, any>;
    if (resData && reFetchUrl) {
      let reFetchData = (await getAxiosData(
        reFetchUrl,
        accessToken,
        dispatch
      )) as any;
      return { resData, reFetchData };
    }
    return { resData, reFetchData };
  } catch (error: any) {
    console.log(error.message);
    return;
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const login = async (
  data: { email: string; password: string },
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(setLoadingRedux(true));
  try {
    const res = await axios.post(`${baseURL}/api/auth/login`, data);
    if (res) {
      const { accessToken, user } = res.data;
      dispatch(setUserRedux(user));
      dispatch(setAccessTokenRedux(accessToken));
      return { success: true };
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const register = async (
  data: { email: string; password: string },
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(setLoadingRedux(true));
  try {
    const res = await axios.post(`${baseURL}/api/auth/register`, data);
    if (res) {
      const { accessToken, user } = res.data;
      dispatch(setUserRedux(user));
      dispatch(setAccessTokenRedux(accessToken));
      return { success: true };
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const logout = async (dispatch: Dispatch<AnyAction>) => {
  dispatch(setUserRedux(userDefaultData));
  dispatch(setAccessTokenRedux(""));
  return { success: true };
};
