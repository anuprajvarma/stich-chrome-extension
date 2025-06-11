import { useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const onclose = () => {
    window.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Key pressed:", e.key);
    }
  };

  const handleChat = async () => {
    console.log(apiKey);
    if (question.trim() === "") {
      console.log("Please enter a question.");
      return;
    }

    const userMsg = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: question,
            },
          ],
        }),
      });

      const data = await res.json();
      console.log("Response from OpenRouter:", data);
      console.log("Response text:", data.choices[0].message.content);
      console.log(messages);
    } catch (error) {
      console.error("Error fetching from OpenRouter or saving to DB:", error);
    }
    setQuestion(""); // Clear the input after sending
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
            value={question}
            className="text-area"
            id="myTextarea"
            placeholder="Type something..."
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          ></textarea>
          <div className="search-div">
            <div>
              <button>Change tone +</button>
              <button>Length +</button>
            </div>
            <div className="">
              <button onClick={handleChat}>
                <MdOutlineSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
