"use client";

import { FiSearch } from "react-icons/fi";
import { FiCommand } from "react-icons/fi";
import { useState } from "react";
import { CommandMenu } from "./CommandMenu";
export const Search = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="bg-stone-200 mb-4 relative 
    rounded flex items-center px-2 py-1.5 text-sm"
      >
        <FiSearch className="mr-2" />
        <input
        onFocus={(e) => {
            e.target.blur();
            setOpen(true);
        }}
          type="text"
          placeholder="search"
          className="w-full bg-transparent
        placeholder:text-stone-400 focus:outline-none"
        />
        <span
          className="p-1 text-xs flex gap-0.5 items-center
         shadow bg-stone-500 rounded absolute right-1.5 top-2/3 -translate-y-1/3"
        >
          <FiCommand />K
        </span>
      </div>
      <CommandMenu open={open} setOpen={setOpen}/>
    </>
  );
};
