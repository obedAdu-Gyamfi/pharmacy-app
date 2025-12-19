import { FiArrowLeft } from "react-icons/fi";
import { CreateUser } from "./CreateUser";
import { Outlet, Link } from "react-router-dom";
import { SalesTopBar } from "../Sales/SalesTopBar";
import { SearchBar } from "../Sidebar/SearchBar";

export const Users = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SalesTopBar />
      <SearchBar
        endpoint="/search-user/"
        onSelect={(user) => console.log("Selected user", user)}
      />
      <main>
        {/* <Link to="create-user" className="text-blue-600 hover:underline">
          <FiArrowLeft /> Back{" "}
        </Link> */}
        <Outlet />
      </main>
    </div>
  );
};
