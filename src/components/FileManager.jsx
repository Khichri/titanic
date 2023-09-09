import React from "react";
import FileListItem from "./FileListItem";


const FileManager = ({ data }) => {
  const directories = data.filter((item) => item.type === 'directory');
  const files = data.filter((item) => item.type === 'file');

  return (
    <div className="w-full h-full m-auto pt-0 pb-10 px-4 bg-gray-100 rounded-lg bg-transparent overflow-y-scroll">
      <div className="sticky top-0  bg-[#3c3836]">
        <h1 className="text-[2rem] font-['Comfortaa'] shadow-lg py-2 font-semibold mb-6">File Manager</h1>
      </div>
      <ul className="grid grid-cols-7 h-full">
        {([...directories, ...files]).map((item, index) => (
          <FileListItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
