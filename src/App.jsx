import { useEffect, useRef, useState } from "react";
import "./App.css";
import FileManager from "./components/FileManager";

const fileData = [
  { id: 1, name: "Folder 1", type: "directory" },
  { id: 2, name: "File 1.txt", type: "file" },
  { id: 3, name: "Folder 2", type: "directory" },
  { id: 4, name: "File 2.txt", type: "file" },
  { id: 5, name: "Folder 2", type: "directory" },
  { id: 6, name: "File 2.txt", type: "file" },
  { id: 7, name: "Folder 2", type: "directory" },
  { id: 8, name: "File 2.txt", type: "file" },
  { id: 9, name: "Folder 2", type: "directory" },
  { id: 10, name: "File 2.txt", type: "file" },
  { id: 11, name: "Folder 2", type: "directory" },
  { id: 12, name: "File 2.txt", type: "file" },
  { id: 13, name: "Folder 2", type: "directory" },
  { id: 14, name: "File 2.txt", type: "file" },
  { id: 15, name: "Folder 2", type: "directory" },
  { id: 16, name: "File 2.txt", type: "file" },
  { id: 17, name: "Folder 2", type: "directory" },
  { id: 18, name: "File 2.txt", type: "file" },
  { id: 19, name: "Folder 2", type: "directory" },
  { id: 20, name: "File 2.txt", type: "file" },
];

const useFiles = () => {
  const [filePathObjs, setFilePathObjs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/ls");
      const ls = await res.json();
      const _filePathObjs = [];
      for (const item of ls)
        _filePathObjs.push({
          id: item.seq,
          key: item.key,
          size: item.value.blob.byteLength,
        });

      setFilePathObjs(_filePathObjs);
    })();
  }, []);

  return filePathObjs;
};

function App() {
  const [path, setPath] = useState(["/"]);

  const pwd = () => {
    if (path.length === 1) return "/";
    return "/" + path.slice(1, path.length).join("/");
  };

  const fileUploaderRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(0);
  const [copiedItem, setCopiedItem] = useState(0);
  const [cwdData, setCwdData] = useState([]);

  const filePathObjs = useFiles();
  console.log(pwd());

  useEffect(() => {
    for (const filePathObj of filePathObjs) {
      const cwdItemName = filePathObj.key.slice(pwd().length + 1);
      if (cwdItemName.includes("/")) {
        // it's a folder
        if (!cwdData.find((file) => file.id === filePathObj.id))
          setCwdData((prev) => [
            ...prev,
            { id: filePathObj.id, name: cwdItemName, type: "folder" },
          ]);
      } else {
        // it's a file
        if (!cwdData.find((file) => file.id === filePathObj.id))
          setCwdData((prev) => [
            ...prev,
            { id: filePathObj.id, name: cwdItemName, type: "file" },
          ]);
      }
    }
  }, [filePathObjs]);

  console.log(filePathObjs)

  return (
    <>
      <div className="flex-col">
        <main className="font-serif w-[100%] m-auto rounded-3xl pt-0 p-5 h-[90vh]  bg-[#3c3836]">
          <div className="flex flex-col gap-2 h-full">
            {/* <div className="ml-auto w-15 p-2 my-2 text-[#ebdbb2] hover:bg-[#665c54] rounded-2xl hover:cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.43 12.98c.04-.32.07-.64.07-.98c0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.566.566 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98c0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73c0 .21-.02.43-.05.73l-.14 1.13l.89.7l1.08.84l-.7 1.21l-1.27-.51l-1.04-.42l-.9.68c-.43.32-.84.56-1.25.73l-1.06.43l-.16 1.13l-.2 1.35h-1.4l-.19-1.35l-.16-1.13l-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7l-1.06.43l-1.27.51l-.7-1.21l1.08-.84l.89-.7l-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13l-.89-.7l-1.08-.84l.7-1.21l1.27.51l1.04.42l.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43l.16-1.13l.2-1.35h1.39l.19 1.35l.16 1.13l1.06.43c.43.18.83.41 1.23.71l.91.7l1.06-.43l1.27-.51l.7 1.21l-1.07.85l-.89.7l.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z"
                />
              </svg>
            </div> */}
            <div className="mt-5">
              <span className="font-['Comfortaa'] text-[3rem] text-[#ebdbb2] font-semibold">
                Titanic
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-grow px-3 bg-[#dfc4a1] shadow-xl rounded-xl flex items-center font-['Comfortaa'] text-[1.1rem]">
                <span className="flex">
                  <span className="p-1">/</span>
                  {path.slice(1, path.length).map((folder, idx) => (
                    <div key={idx}>
                      <button
                        onClick={() => {
                          console.log(path.slice(0, idx + 1).join("/"));
                        }}
                        className="p-1 px-2 hover:bg-[#fbf1c7] rounded-lg"
                      >
                        {folder}
                      </button>
                      <span className="p-1">/</span>
                    </div>
                  ))}
                </span>
              </div>
              <div className="flex shadow-lg">
                <button
                  type="submit"
                  className="bg-[#fbf1c7] hover:bg-[#a89984] p-2 rounded-tl-xl rounded-bl-xl "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16Zm0-2q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search.."
                  name="search"
                  autoComplete="off"
                  className="font-['Comfortaa'] focus:outline-none h-full px-2 rounded-tr-xl rounded-br-xl "
                />
              </div>
            </div>
            <div className="flex gap-3 h-[80%]">
              <div className="flex text-[#ebdbb2]  flex-col w-80 box gap-3 pr-5 pt-4 overflow-y-scroll font-['Comfortaa'] font-semibold text-[1.1rem]">
                {/* <input
                  type="file"
                  class="form-control-file"
                  name="uploaded_file"
                />
                <div
                  type="submit"
                  className="flex items-center p-4 mb-7 hover:cursor-pointer bg-[#b16286]/70 hover:bg-[#d3869b] rounded-xl"
                >
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6Z"
                      />
                    </svg>
                  </span>
                  Add File/Folder
                </div> */}
                <form
                  action={`/api/upload/?path=${pwd()}`}
                  encType="multipart/form-data"
                  method="post"
                >
                  <div className="flex items-center justify-center w-full pb-5">
                    <label
                      htmlFor="dropzone-file"
                      className="flex px-5 flex-col items-center justify-center w-full h-28 border-2 border-[#ebdbb2] border-dashed rounded-lg cursor-pointer bg-[#b16286]/40 hover:bg-[#d3869b]/70"
                    >
                      <div className="flex flex-col items-center justify-center pt-8 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-[#ebdbb2]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 px-2 text-sm text-[#ebdbb2]">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                      </div>
                      <input
                        name="uploadedFile"
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        directory
                        webkitdirectory
                        mozdirectory
                      />
                    </label>
                  </div>
                  <input type="submit" value="Upload File" className="bg-[#79740e] w-full p" />
                </form>
                <div
                  className={`${
                    !selectedItem ? "hidden" : "block"
                  } flex items-center p-3 hover:cursor-pointer hover:bg-[#665c54] rounded-xl`}
                >
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                    >
                      <g fill="currentColor">
                        <path d="M3 6.524c0-.395.327-.714.73-.714h4.788c.006-.842.098-1.995.932-2.793A3.68 3.68 0 0 1 12 2a3.68 3.68 0 0 1 2.55 1.017c.834.798.926 1.951.932 2.793h4.788c.403 0 .73.32.73.714a.722.722 0 0 1-.73.714H3.73A.722.722 0 0 1 3 6.524Z" />
                        <path
                          fillRule="evenodd"
                          d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.34 1.181-5.246l.267-4.187c.1-1.577.15-2.366-.303-2.866c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5c-.454.5-.404 1.289-.303 2.866l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886Zm-1.35-9.812c-.04-.433-.408-.75-.82-.707c-.413.044-.713.43-.672.865l.5 5.263c.04.434.408.75.82.707c.413-.044.713-.43.672-.864l-.5-5.264Zm4.329-.707c.412.044.713.43.671.865l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.04-.433.409-.75.82-.707Z"
                          clipRule="evenodd"
                        />
                      </g>
                    </svg>
                  </span>
                  Delete{" "}
                  {selectedItem.type === "directory"
                    ? "Folder"
                    : selectedItem.type === "file"
                    ? "File"
                    : ""}
                </div>
                <div
                  className={`${
                    !selectedItem ? "hidden" : "block"
                  } flex items-center p-3 hover:cursor-pointer hover:bg-[#665c54] rounded-xl`}
                  onClick={() => {
                    setCopiedItem(selectedItem);
                  }}
                >
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
                      />
                    </svg>
                  </span>
                  Copy{" "}
                  {selectedItem.type === "directory"
                    ? "Folder"
                    : selectedItem.type === "file"
                    ? "File"
                    : ""}
                </div>
                <div
                  className={`${
                    !copiedItem ? "hidden" : "block"
                  } mt-auto flex items-center p-3 hover:cursor-pointer hover:bg-[#665c54] rounded-xl`}
                  onClick={() => {
                    setCopiedItem(0);
                    // handle copying
                  }}
                >
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill="currentColor"
                        d="M4.085 2H3.5A1.5 1.5 0 0 0 2 3.5v10A1.5 1.5 0 0 0 3.5 15h2.612v-1H3.5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h.585A1.5 1.5 0 0 0 5.5 4h3a1.5 1.5 0 0 0 1.415-1h.585a.5.5 0 0 1 .5.5V5h1V3.5A1.5 1.5 0 0 0 10.5 2h-.585A1.5 1.5 0 0 0 8.5 1h-3a1.5 1.5 0 0 0-1.415 1ZM5 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM8.5 6A1.5 1.5 0 0 0 7 7.5v6A1.5 1.5 0 0 0 8.5 15h4a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 12.5 6h-4ZM8 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-6Z"
                      />
                    </svg>
                  </span>
                  Paste "{copiedItem.name}"
                </div>
              </div>
              <div className="flex w-full h-full mt-2 text-[#ebdbb2]">
                <FileManager
                  data={cwdData}
                  path={path}
                  setPath={setPath}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
