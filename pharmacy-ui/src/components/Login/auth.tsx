import api from './axiosClient'

export async function login(username: string, password: string) {
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);

    const res = await api.post("/login/", data);
  return res.data;
}

export function logout(){
    localStorage.removeItem("token");
}