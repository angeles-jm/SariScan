import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = ({
  searchValue,
  handleSearchChange,
  onSubmit,
  className,
}) => {
  return (
    <div className={`${className} w-full`}>
      <form className="w-full" onSubmit={onSubmit}>
        <div className="relative flex items-center text-gray-400 focus-within:text-gray-600">
          <CiSearch className="absolute left-3 w-5 h-5" />
          <input
            value={searchValue}
            onChange={handleSearchChange}
            type="text"
            className="w-full pl-10 pr-3 py-2 font-semibold border-2 border-gray-200 rounded-full focus:outline-none focus:border-emerald-500 transition-colors duration-300"
            placeholder="Input the item"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
