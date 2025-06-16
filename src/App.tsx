import { useEffect, useRef, useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { MdOutlineDeleteOutline } from "react-icons/md";
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const email = import.meta.env.VITE_MY_EMAIL;
// const google_apiKey = import.meta.env.VITE_API_KEY;
import "./App.css";

function App() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [question, setQuestion] = useState("");
  const [contextExists, setContextExists] = useState(false);
  const [isAskAIActive, setIsAskAIActive] = useState(true);
  const [context, setContext] = useState("");
  const [translate1, setTranslate1] = useState("en");
  const [translate2, setTranslate2] = useState("zh-TW");
  const [translateText, setTranslateText] = useState("");
  // const [isTranslateActive, setIsTranslateActive] = useState(false);
  const [isTypeExist, setIsTypeExist] = useState(false);
  const [isLengthExist, setIsLengthExist] = useState(false);
  const [isToneExist, setIsToneExist] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const onclose = () => {
    window.parent.postMessage({ type: "REMOVE_IFRAME" }, "*");
  };

  useEffect(() => {
    console.log("app mount ho gya");
    const handleMessage = (event: MessageEvent) => {
      console.log("📩 React got message:", event.data);
      if (event.data?.type === "PASS_TEXT") {
        console.log("🧠 Received from content.js:", event.data.payload);
        setContextExists(true);
        setContext(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const callTranslatorAPI = async () => {
      console.log(
        "Calling translator API with context:",
        translate1 + context + translate2 + email
      );
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          context
        )}&langpair=${translate1}|${translate2}&de=${email}`
      );
      const data = await res.json();
      console.log("Translation data:", data);
      setTranslateText(data.matches[0].translation);
      console.log("Translation result:", data.matches[0].translation);
    };
    if (
      context !== "" &&
      translate1 &&
      translate2 &&
      translate1 !== translate2
    ) {
      callTranslatorAPI();
    }
  }, [isAskAIActive, context, translate1, translate2]);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.click();
    }
  }, []);

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

  const handleContext = () => {
    setContext("");
    setTranslateText("");
    setContextExists(!contextExists);
  };

  const handleAskAI = () => {
    setIsAskAIActive(true);
  };

  const handleTranslate = () => {
    setIsAskAIActive(false);
  };

  // const handleImroveWriting = () => {};

  const handleTone = () => {
    setIsToneExist(!isToneExist);
    setSelectedTone("profesional");
  };

  const handleTranslateOption1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTranslate1(e.target.value);
  };

  const handleTranslateOption2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTranslate2(e.target.value);
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

  const handleContextInput = (value: string) => {
    setContext(value);
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
        <div className="wrap-div">
          <div className="header">
            <div className="stich">
              <div className="stich-div">
                <img src="icon.png" width={25} height={25} />
              </div>
              <div className="tabs">
                <div className="ask-ai" onClick={handleAskAI}>
                  Ask AI
                </div>
                <div className="translate" onClick={handleTranslate}>
                  Translate
                </div>
              </div>
            </div>
            <div className="close-btn" onClick={onclose}>
              X
            </div>
          </div>
          <div>
            {contextExists ? (
              <div>
                <input
                  value={context}
                  onChange={(e) => handleContextInput(e.target.value)}
                />
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
          </div>
          {isAskAIActive ? (
            <div className="text-area-div">
              <div className="chatbot-div">
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
              </div>
              <textarea
                ref={textareaRef}
                onInput={handleInput}
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
                    <button className="btn" onClick={handleType}>
                      Type +
                    </button>
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
                    <button className="btn" onClick={handleTone}>
                      Change tone +
                    </button>
                  )}
                  {isLengthExist ? (
                    <div>
                      <select
                        value={selectedLength}
                        onChange={handleLegthOption}
                      >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                      </select>
                      <button onClick={handleLength}>X</button>
                    </div>
                  ) : (
                    <button className="btn" onClick={handleLength}>
                      Length +
                    </button>
                  )}
                </div>
                <div onClick={handleChat}>
                  <MdOutlineSend className="send-btn" size={20} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="language-options-div">
                <div>
                  <select
                    value={translate1}
                    onChange={(e) => handleTranslateOption1(e)}
                  >
                    <option value="en">English</option>
                    <option value="ko">Korean</option>
                    <option value="zh-CN">Chinese, Simplefied</option>
                    <option value="zh-TW">Chinese, Traditional</option>
                    <option value="ja">Japanese</option>
                    <option value="es">Spanish</option>
                    <option value="ru">Russian</option>
                    <option value="fr">French</option>
                    <option value="pt">Portuguese</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="nl">Dutch</option>
                    <option value="id">Indonesian</option>
                  </select>
                </div>
                <div>
                  <select
                    value={translate2}
                    onChange={(e) => handleTranslateOption2(e)}
                  >
                    <option value="zh-TW">Chinese, Traditional</option>
                    <option value="en">English</option>
                    <option value="ko">Korean</option>
                    <option value="zh-CN">Chinese, Simplefied</option>
                    <option value="ja">Japanese</option>
                    <option value="es">Spanish</option>
                    <option value="ru">Russian</option>
                    <option value="fr">French</option>
                    <option value="pt">Portuguese</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="nl">Dutch</option>
                    <option value="id">Indonesian</option>
                  </select>
                </div>
              </div>
              <div>{translateText}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
