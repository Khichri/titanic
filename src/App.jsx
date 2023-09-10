import { useEffect, useRef, useState } from "react";
import "./App.css";
import FileManager from "./components/FileManager";

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

  const [hyperdriveKey, setHyperdriveKey] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/info");
      const info = await res.json();
      // if (localStorage.getItem("currKey") !== info.key)
      //   setHyperdriveKey(localStorage.getItem("currKey"));
      // else 
      setHyperdriveKey(info.key);
    })();
  }, []);

  const fileUploaderRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(0);
  const [copiedItem, setCopiedItem] = useState(0);
  const [cwdData, setCwdData] = useState([]);
  const [fileDisplayData, setFileDisplayData] = useState(cwdData);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFileName, setSelectedFileName] = useState("");

  let filePathObjs = useFiles();

  useEffect(() => {
    for (const filePathObj of filePathObjs) {
      const cwdItemName = filePathObj.key.slice(pwd().length);
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

  useEffect(() => {
    console.log(searchQuery);
    setFileDisplayData(
      cwdData.filter((item) => item.name.toLowerCase().includes(searchQuery))
    );
    setCwdData(
      cwdData.filter((item) => item.name.toLowerCase().includes(searchQuery))
    );
    console.log("after searching", fileDisplayData);
  }, [searchQuery]);
  // console.log(searchQuery);

  return (
    <>
      <div className="flex-col">
        <main className="font-serif w-[100%] m-auto rounded-3xl pt-0 p-5 h-[90vh]  bg-[#3c3836]">
          <div className="flex flex-col gap-2 h-full">
            <div className="mt-5">
              <span className="font-['Comfortaa'] text-[3rem] text-[#ebdbb2] font-semibold">
                Titanic
              </span>
            </div>
            <div className="flex gap-2 h-12">
              {/* <div className="flex-1 px-3 bg-[#dfc4a1] shadow-xl rounded-xl flex items-center font-['Comfortaa']">
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
                  {hyperdriveInfo.id}
                </span>
              </div> */}
              <input
                type="text"
                name="search"
                autoComplete="off"
                value={hyperdriveKey}
                onChange={(e) => setHyperdriveKey(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    localStorage.setItem("newKey", hyperdriveKey);
                    const res = await fetch(`/api/open/?key=${hyperdriveKey}`);
                    window.location.reload();
                  }
                }}
                className="text-[#1d2021] font-['Comfortaa'] focus:outline-none h-full w-full px-2 rounded-xl"
              />
              {/* <div className="flex flex-1 shadow-lg h-12">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  className="text-[#1d2021] font-['Comfortaa'] focus:outline-none h-full px-2 rounded-tr-xl rounded-br-xl w-full"
                />
              </div> */}
            </div>
            <div className="flex gap-3 h-[80%]">
              <div className="flex text-[#ebdbb2]  flex-col w-80 box gap-3 pr-5 pt-4 overflow-y-scroll font-['Comfortaa'] font-semibold text-[1.1rem]">
                <form
                  action={`/api/upload/?path=${pwd()}&name=${selectedFileName}`}
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
                          <span className="font-semibold">Click to upload</span>
                        </p>
                      </div>
                      <input
                        name="uploadedFile"
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          setSelectedFileName(e.target.files[0].name);
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={selectedFileName}
                    onChange={(e) => setSelectedFileName(e.target.value)}
                    className={`${
                      selectedFileName === "" ? "hidden" : "block"
                    } text-[#1d2021] font-['Comfortaa'] focus:outline-none py-2 px-2 mb-4 rounded-xl w-full`}
                  />
                  <input
                    type="submit"
                    value="Upload File"
                    className={`${
                      selectedFileName === "" ? "hidden" : "block"
                    } bg-[#458588] hover:bg-[#83a59pdf8] w-full py-3 rounded-xl hover:cursor-pointer`}
                  />
                </form>

                <form
                  className="mt-auto w-full"
                  // action={`/api/del/?path=/${selectedItem.name}`}
                  // method="get"
                >
                  <button
                    type="submit"
                    onClick={async (e) => {
                      // e.preventDefault();
                      const res = await fetch(
                        `/api/del/?path=/${selectedItem.name}`
                      );
                      // console.log(`/api/del/?path=${pwd() + selectedItem.name}`)
                      setCwdData((prev) =>
                        prev.filter((item) => item.id !== selectedItem.id)
                      );
                      console.log("after deleting", cwdData);
                    }}
                    className={`${
                      !selectedItem ? "hidden" : "block"
                    } w-full flex items-center p-3 hover:cursor-pointer bg-[#d65d0e]/80 hover:bg-[#fe8019]/80 rounded-xl`}
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
                  </button>
                </form>
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
