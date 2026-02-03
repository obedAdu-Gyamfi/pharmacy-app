import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./auth";
import { Link } from "react-router-dom";
import { startTokenWatcher } from "./StartTokenWatcher";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const result = await login(username, password);
      localStorage.setItem("token", result.access_token);
      const decoded: any = jwtDecode(result.access_token);
      const role = decoded?.role;
      if (role !== "admin" && role !== "manager") {
        navigate("/pos");
      } else {
        navigate("/dashboard");
      }
      startTokenWatcher();
    } catch (err) {
      alert("Invalid credentials");
    }
  }
  return (
    <>
      <div>
        <section
          id="login"
          className="flex justify-center items-center min-h-screen bg-transparent"
        >
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Login
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-gray-600" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>

            <div className="flex justify-between text-sm text-gray-500">
              <Link to="/reset-password" className="hover:text-blue-500">
                Forgot Password?
              </Link>
              <a href="#" className="hover:text-blue-500">
                Sign Up
              </a>
            </div>
          </div>
        </section>
      </div>
      <Link to="/">Login</Link>
    </>
  );
};

export default Login;
