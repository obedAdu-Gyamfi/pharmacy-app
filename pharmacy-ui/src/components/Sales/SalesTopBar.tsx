import React from "react";
import { FiCalendar } from "react-icons/fi";
import { UserInformation } from "../Login/UserInformation";

export const SalesTopBar = () => {
  const user = UserInformation();
  if (!user) return <div>Loading User ...</div>;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold block">
            Welcome, {user.fullname}
          </span>
          <span className="text-xs block text-stone-500">{formattedDate}</span>
        </div>
        <div>
          <label className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded">
            <FiCalendar /> Today
          </label>
        </div>
      </div>
    </div>
  );
};
