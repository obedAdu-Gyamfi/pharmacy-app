import { jwtDecode } from "jwt-decode";
import { logout } from "./auth";

export const startTokenWatcher = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded: any = jwtDecode(token);
    const expMs = decoded.exp * 1000; // convert seconds → milliseconds
    const now = Date.now();

    const timeout = expMs - now;
    if (timeout <= 0) {
      logout();
      window.location.href = "/login";
      return;
    }

    // logout exactly at expiration time
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, timeout);
  } catch (err) {
    console.error("Invalid token found in local storage", err);
    logout();
    window.location.href = "/login";
  }
}
