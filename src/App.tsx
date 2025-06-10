// import { useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
import "./App.css";

function App() {
  const onclose = () => {
    window.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Key pressed:", e.key);
    }
  };

  return (
    <>
      <div className="top-div">
        <div className="header">
          <div className="stich">
            <div>
              <img src="icon.png" width={30} height={30} />
            </div>
            <h1>Stich</h1>
          </div>
          <button className="close-btn" onClick={onclose}>
            X
          </button>
        </div>
        <div>
          <button className="addContext-btn">
            <RiPlayListAddLine />
            <p>Add Context</p>
          </button>
        </div>
        <div className="text-area-div">
          <textarea
            className="text-area"
            id="myTextarea"
            placeholder="Type something..."
            onKeyDown={(e) => handleKeyDown(e)}
          ></textarea>
          <div className="search-div">
            <button>Change tone +</button>
            <button>Length +</button>
            <button>
              <MdOutlineSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
