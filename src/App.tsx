import { useEffect, useRef, useState } from "react";
// import { RiPlayListAddLine } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
import ReactMarkdown from "react-markdown";
// import { MdOutlineDeleteOutline } from "react-icons/md";
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
import "./App.css";

function App() {
  const selectRef = useRef<HTMLSelectElement>(null);
  // const [selectedText, setSelectedText] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [question, setQuestion] = useState("");
  // const [contextExists, setContextExists] = useState(false);
  const [isTypeExist, setIsTypeExist] = useState(false);
  const [isLengthExist, setIsLengthExist] = useState(false);
  const [isToneExist, setIsToneExist] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const onclose = () => {
    window.close();
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.click();
    }
  }, []);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const text = params.get("text");
  //   if (text) {
  //     setSelectedText(text);
  //     // setContextExists(true);
  //     console.log("Received selected text:", text);
  //   }
  // }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  const handleLength = () => {
    setIsLengthExist(!isLengthExist);
    setSelectedLength("short");
  };

  // const handleContext = () => {
  //   setContextExists(!contextExists);
  // };

  const handleTone = () => {
    setIsToneExist(!isToneExist);
    setSelectedTone("profesional");
  };

  const handleType = () => {
    setIsTypeExist(!isTypeExist);
  };

  const handleLegthOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLength(e.target.value);
    console.log("Selected:", e.target.value);
  };

  const handleToneOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTone(e.target.value);
    console.log("Selected tone:", e.target.value);
  };

  const handleChat = async () => {
    if (question.trim() === "") {
      console.log("Please enter a question.");
      return;
    }

    const userMsg = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      console.log(`tone ${selectedTone} length ${selectedLength}`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          stream: true,
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant. Respond in a ${selectedLength} formatwith a ${selectedTone} tone.`,
            },
            {
              role: "user",
              content: `${question}`,
            },
          ],
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botReply = "";

      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk
          .split("\n")
          .filter((line) => line.trim().startsWith("data:"));

        console.log("Stream completed");

        for (const line of lines) {
          const jsonStr = line.replace(/^data:\s*/, "");

          if (jsonStr === "[DONE]") {
            return;
          }

          try {
            let delta = "";
            const parsed = JSON.parse(jsonStr);
            if (isTypeExist) {
              delta = parsed.choices?.[0]?.delta?.reasoning;
            } else {
              delta = parsed.choices?.[0]?.delta?.content;
            }

            console.log("Parsed chunk:", parsed);
            if (delta) {
              botReply += delta;
              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = { ...updated[lastIndex], text: botReply };
                return updated;
              });
            }
          } catch (err) {
            console.error("Error parsing chunk:", err);
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
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
            <p className="stich-title">Stich</p>
          </div>
          <button className="close-btn" onClick={onclose}>
            X
          </button>
        </div>
        {/* <div>
          {contextExists ? (
            <div>
              <input value={selectedText} />
              <button onClick={handleContext}>
                <MdOutlineDeleteOutline />
              </button>
            </div>
          ) : (
            <button className="addContext-btn" onClick={handleContext}>
              <RiPlayListAddLine />
              <p>Add Context</p>
            </button>
          )}
        </div> */}
        <div className="text-area-div">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              {msg.text ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <p>searching...</p>
              )}
            </div>
          ))}
          <textarea
            value={question}
            className="text-area"
            id="myTextarea"
            placeholder="Type something..."
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          ></textarea>
          <div className="search-div">
            <div className="type">
              {isTypeExist ? (
                <div>
                  <select ref={selectRef}>
                    <option value="reasoning">reasoning</option>
                  </select>
                  <button onClick={handleType}>X</button>
                </div>
              ) : (
                <button onClick={handleType}>Type +</button>
              )}
              {isToneExist ? (
                <div>
                  <select value={selectedTone} onChange={handleToneOption}>
                    <option value="profesional">profesional</option>
                    <option value="casual">casual</option>
                    <option value="straightforward">straightforward</option>
                    <option value="confident">confident</option>
                    <option value="friendly">friendly</option>
                  </select>
                  <button onClick={handleTone}>X</button>
                </div>
              ) : (
                <button onClick={handleTone}>Change tone +</button>
              )}
              {isLengthExist ? (
                <div>
                  <select value={selectedLength} onChange={handleLegthOption}>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                  <button onClick={handleLength}>X</button>
                </div>
              ) : (
                <button onClick={handleLength}>Length +</button>
              )}
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
