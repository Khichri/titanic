"use client";

import React from "react";

const FileListItem = ({ item }) => {
  const handleClick = () => {
    if (item.type === "directory") {
      alert(`Open directory: ${item.name}`);
    } else {
      alert(`Open file: ${item.name}`);
    }
  };

  const itemClass =
    item.type === "directory"
      ? "font-semibold font-['Comfortaa'] cursor-pointer text-[1rem] text-[#d79921]"
      : "cursor-pointer text-[#689d6a]";

  return (
    <li className={`mb-2 font-['Comfortaa'] font-semibold text-[1rem] flex flex-col items-center p-3 hover:bg-[#665c54] rounded-xl ${itemClass}`} onClick={handleClick}>
      {item.type === "directory" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.588 1.413T20 20H4Zm0-2h16V8h-8.825l-2-2H4v12Zm0 0V6v12Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"
          />
        </svg>
      )}
      {item.name}
    </li>
  );
};

export default FileListItem;
