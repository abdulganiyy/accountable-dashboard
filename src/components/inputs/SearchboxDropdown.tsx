import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { GET_BANKS } from "@/graphql/queries";

import { twMerge } from "tailwind-merge";

const SearchboxDropdown = ({ selectedItem, items, setSelectedItem }: any) => {
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //   const [items, setItems] = useState<any>([]);
  // const [bankName, setBankName] = useState<string>("");

  let filteredItems: any[] = [];

  if (searchText !== "" && items?.length) {
    filteredItems = items.filter((item: any) => {
      const name = `${item?.firstName} ${item?.lastName}`;

      return name?.toLowerCase().startsWith(searchText.toLowerCase());
    });
  }

  const handleInputChange = (event: any) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={
          searchText ||
          `${
            selectedItem
              ? selectedItem?.firstName + " " + selectedItem?.lastName
              : ""
          }`
        }
        onChange={handleInputChange}
        className="w-full h-[48px] pl-[52px] pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Search a manager"
      />
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 bg-[#F2F3F7] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]"
        // onClick={handleSearch}
      >
        <FaSearch />
      </button>
      {searchText !== "" && (
        <div className="absolute top-[60px] w-full">
          <div className="flex flex-col gap-y-2">
            {filteredItems?.length !== 0 &&
              filteredItems?.slice(0, 6).map((item: any, index: number) => (
                <div
                  onClick={() => {
                    setSelectedItem(item);
                    setSearchText("");
                  }}
                  key={index}
                  className={twMerge(
                    `flex h-[56px] gap-x-2 cursor-pointer items-center`
                  )}
                >
                  <span className="text-[14px] leading-[17px] w-[40px] h-[40px] flex items-center justify-center bg-[#FAEAD4] rounded-full">
                    {`${item?.firstName?.slice(0, 1)}${item?.lastName?.slice(
                      0,
                      1
                    )}` || "JJ"}
                  </span>
                  {`${item?.firstName} ${item?.lastName}` || "Jacob Jones"}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchboxDropdown;
