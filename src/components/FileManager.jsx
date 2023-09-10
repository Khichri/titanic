import React, { useState } from "react";
import FileListItem from "./FileListItem";

const FileManager = ({ data, path, setPath, selectedItem, setSelectedItem }) => {
  if (!data) return <>a</>
  const directories = data.filter((item) => item.type === "directory");
  const files = data.filter((item) => item.type === "file");


  return (
    <div className="w-full h-full m-auto pt-0 pb-10 px-4 bg-gray-100 rounded-lg bg-transparent overflow-y-scroll"
    
    onClick={() => {
      setSelectedItem(0)
    }}>
      <div className="sticky top-0 bg-[#3c3836]">
        {/* <h1 className="text-[2rem] font-['Comfortaa']  py-2 font-semibold mb-8">
          File Manager
        </h1> */}
      </div>
      <ul className="grid grid-cols-7 gap-x-3 gap-y-1">
        {[...directories, ...files].map((item, index) => (
          <FileListItem
            key={index}
            item={item}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            path={path}
            setPath={setPath}
          />
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
