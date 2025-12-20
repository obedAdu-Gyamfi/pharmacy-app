import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../Login/axiosClient';

export const CreateUser = () => {
     const navigate = useNavigate();
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [fullname, setFullname] = useState("");
     const [role, setRole] = useState("");
     const [email, setEmail] = useState("");
     const [phone, setPhone] = useState("");


     async function handleSubmit(e: any) {
       e.preventDefault();
       try {
         const data = new URLSearchParams();
         data.append("username", username);
         data.append("password", password);
         data.append("fullname", fullname);
         data.append("role", role);
         data.append("email", email);
         data.append("phone", phone);
         const res = await api.post("/sign-up/", data);
         alert ("New User Created Successfully")
         setUsername("");
         setPassword("");
         setFullname("");
         setRole("");
         setEmail("");
         setPhone("");
       } catch (err) {
         alert("Unable to create user");
       }
     }

  return (

    <div>
      <section
        id="create user"
        className="flex justify-center items-center min-h-screen bg-gray-100"
      >
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create New User
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-gray-600" htmlFor="username">
                Create Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600" htmlFor="password">
                Create Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600" htmlFor="fullname">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-600" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="e.g username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create New User
            </button>
          </form>
          {/**
               * <div className="flex justify-between text-sm text-gray-500">
              <a href="#" className="hover:text-blue-500">
                Forgot Password?
              </a>
              <a href="#" className="hover:text-blue-500">
                Sign Up
              </a>
            </div>
               * 
                */}
        </div>
      </section>
    </div>
  );
}
