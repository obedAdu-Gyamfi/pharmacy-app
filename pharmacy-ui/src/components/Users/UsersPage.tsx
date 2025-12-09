
import { CreateUser } from "./CreateUser";
import { Outlet, Link } from "react-router-dom";
export const Users = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users Page</h1>
      <Link to="create-user" className="text-blue-600 hover:underline">
        Go to Create User
      </Link>
      <Outlet /> {/* Nested routes render here */}
    </div>
  );
}
