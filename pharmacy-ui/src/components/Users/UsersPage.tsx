import { Outlet } from "react-router-dom";
import { SalesTopBar } from "../Sales/SalesTopBar";
import { SearchBar } from "../Sidebar/SearchBar";
import { useState } from "react";

export const Users = () => {

  const [user_id, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

const handleUserSelect = (user: { id?: number | string; username?: string; fullname?: string; email?: string; role?: string }) =>{
  setUserID(user.id?.toString() || "");
  setUsername(user.username || "");
  setFullname(user.fullname || "");
  setEmail(user.email || "");
  setRole(user.role || "")
}

return (
  <div className="flex flex-col min-h-screen bg-transparent">
    <SalesTopBar />
    <SearchBar endpoint="/search-user/" onSelect={handleUserSelect} />
    <main className="flex p-4">
      {/* <Link to="create-user" className="text-blue-600 hover:underline">
          <FiArrowLeft /> Back{" "}
        </Link> */}
      <Outlet />
    </main>
    <div className="rounded border border-stone-300 p-4">
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600" htmlFor="user_id">
            User ID
          </label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            placeholder="Enter your user_id"
            value={user_id}
            onChange={(e) => setUserID(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600" htmlFor="username">
            Username
          </label>
          <input
            type="username"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <label className="block mb-1 text-gray-600" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600" htmlFor="role">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            placeholder="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>
    </div>
  </div>
);
};
