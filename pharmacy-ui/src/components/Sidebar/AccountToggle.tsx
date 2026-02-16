
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { UserInformation } from "../Login/UserInformation";
import { useNavigate } from "react-router-dom";

export const AccountToggle = () => {
  const user = UserInformation();
  const navigate = useNavigate();

  if (!user) return <div>Loading User info...</div>;

  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button
        onClick={() => navigate("/profile")}
        className="flex p-0.5 hover:bg-stone-200 rounded 
        transition-colors relative gap-2 w-full items-center"
      >
        <img
          src="https://api.dicebear.com/9.x/fun-emoji/svg"
          alt="avater"
          className="size-8 rounded shrink-0 bg-brightRed-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">{user.fullname}</span>
          <span className="text-xs block text-darkGreyishBlue-500">
            <h3>@{user.username}</h3>
          </span>
        </div>
        <FiChevronDown
          className="absolute right-2 top-1/2 
       translate-y-[calc(-50%+2px)] text-xs"
        />
        <FiChevronUp
          className="absolute right-2 top-1/2
       translate-y-[calc(-50%-2px)] text-xs"
        />
      </button>
    </div>
  );
}
