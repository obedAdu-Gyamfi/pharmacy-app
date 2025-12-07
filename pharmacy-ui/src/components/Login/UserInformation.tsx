import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";

interface UserData {
  id: number;
  username: string;
  fullname: string;
  email?: string;
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
        const response = await axios.get(
          `http://127.0.0.1:8000/get-user/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [username, token]);

  return userData;
};
