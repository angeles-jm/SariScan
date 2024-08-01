import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = ({
  searchValue,
  handleSearchChange,
  onSubmit,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between  px-6 space-x-6 bg-slate-50 ">
        <form className="w-full max-w-md" onSubmit={onSubmit}>
          <div className=" relative flex items-center mt-3 text-gray-400 focus-within:text-gray-600">
            <CiSearch className="absolute left-0 ml-3 w-5 h-5" />
            <input
              value={searchValue}
              onChange={handleSearchChange}
              type="text"
              className="pl-10 pr-3 py-2 font-semibold border-2 rounded-3xl w-full "
              placeholder="Input the item"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
