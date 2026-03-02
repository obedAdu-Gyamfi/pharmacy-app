import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import api from "./axiosClient";

interface UserData {
  id: number;
  username: string;
  fullname: string;
  email?: string;
  phone?: string;
}

export const UserInformation = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState<UserData | null>(null);

  let decoded: any;
  let username: string | null = null;
  if (token) {
    decoded = jwtDecode(token);
    username = decoded?.sub;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!username || !token) return;
      try {
        const response = await api.get(`/get-user/${username}`);
        setUserData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [username, token]);

  return userData;
};
