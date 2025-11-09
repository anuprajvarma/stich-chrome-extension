import { useEffect, useRef, useState } from "react";
import { MdOutlineSend } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { FaRegCopy } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import "react-tooltip/dist/react-tooltip.css";
import { GiSpeaker } from "react-icons/gi";
import { Tooltip } from "react-tooltip";
import { IoStopCircleOutline } from "react-icons/io5";
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

function App() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [question, setQuestion] = useState("");
  const [copy, setCopy] = useState(false);
  const [speak, setSpeak] = useState(true);
  // const [contextExists, setContextExists] = useState(false);
  // const [isAskAIActive, setIsAskAIActive] = useState(true);
  // const [context, setContext] = useState("");
  // const [translate1, setTranslate1] = useState("en");
  // const [translate2, setTranslate2] = useState("zh-TW");
  // const [translateText, setTranslateText] = useState("");
  // const [isTranslateActive, setIsTranslateActive] = useState(false);
  const [isTypeExist, setIsTypeExist] = useState(false);
  const [isLengthExist, setIsLengthExist] = useState(false);
  const [isToneExist, setIsToneExist] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scrolls when messages change

  const handleCopy = async () => {
    if (textRef.current) {
      try {
        await navigator.clipboard.writeText(textRef.current.innerText);
        console.log("Text copied to clipboard:", textRef.current.innerText);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSpeak = () => {
    speakText(messages[1].text);
    setSpeak(false);
  };

  // const onclose = () => {
  //   window.parent.postMessage({ type: "REMOVE_IFRAME" }, "*");
  // };

  const speakText = (text: string) => {
    console.log("Speaking text:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Change language if needed
    utterance.rate = 1; // Speed (0.1 to 10)
    utterance.pitch = 1; // Pitch (0 to 2)
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    console.log("app mount ho gya");
    const handleMessage = (event: MessageEvent) => {
      console.log("📩 React got message:", event.data);
      if (event.data?.type === "PASS_TEXT") {
        console.log("🧠 Received from content.js:", event.data.payload);
        // setContextExists(true);
        // setContext(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // useEffect(() => {
  //   const callTranslatorAPI = async () => {
  //     console.log(
  //       "Calling translator API with context:",
  //       translate1 + context + translate2 + email
  //     );
  //     const res = await fetch(
  //       `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
  //         context
  //       )}&langpair=${translate1}|${translate2}&de=${email}`
  //     );
  //     const data = await res.json();
  //     console.log("Translation data:", data);
  //     setTranslateText(data.matches[0].translation);
  //     console.log("Translation result:", data.matches[0].translation);
  //   };
  //   if (
  //     context !== "" &&
  //     translate1 &&
  //     translate2 &&
  //     translate1 !== translate2
  //   ) {
  //     callTranslatorAPI();
  //   }
  // }, [context, translate1, translate2]);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.click();
    }
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
      }
      handleChat();
    }
  };

  const handleLength = () => {
    setIsLengthExist(!isLengthExist);
    setSelectedLength("short");
  };

  // const handleContext = () => {
  //   // setContext("");
  //   // setTranslateText("");
  //   setContextExists(!contextExists);
  // };

  // const handleAskAI = () => {
  //   setIsAskAIActive(true);
  // };

  // const handleTranslate = () => {
  //   setIsAskAIActive(false);
  // };

  // const handleImroveWriting = () => {};

  const handleTone = () => {
    setIsToneExist(!isToneExist);
    setSelectedTone("profesional");
  };

  // const handleTranslateOption1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setTranslate1(e.target.value);
  // };

  // const handleTranslateOption2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setTranslate2(e.target.value);
  // };

  // const handleType = () => {
  //   setIsTypeExist(!isTypeExist);
  // };

  const handleLegthOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLength(e.target.value);
    console.log("Selected:", e.target.value);
  };

  const handleToneOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTone(e.target.value);
    console.log("Selected tone:", e.target.value);
  };

  // const handleContextInput = (value: string) => {
  //   setContext(value);
  // };

  const handleChat = async () => {
    if (question.trim() === "") {
      console.log("Please enter a question.");
      return;
    }
    setCopy(false);
    const userMsg = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      // console.log(`tone ${selectedTone} length ${selectedLength}`);
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
            setCopy(true);
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
      <div className="flex flex-col">
        <div className="w-96">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-1">
              <div className="stich-div">
                <img src="icon.png" width={20} height={20} />
              </div>
              <p className="font-bold text-2xl">Stich</p>
            </div>
          </div>
          {/* <div>
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
          </div> */}

          <div className="mt-2.5 w-full">
            <div className="flex flex-col w-full max-h-80 overflow-y-scroll">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2.5 w-full mb-2.5"
                >
                  {msg.text ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems:
                          msg.sender === "user" ? "flex-end" : "flex-start", // use correct values
                        justifyContent: msg.sender === "user" ? "end" : "start", // probably what you meant instead of justifyItems
                      }}
                    >
                      <div
                        ref={textRef}
                        key={index}
                        className={`message ${
                          msg.sender === "user"
                            ? "bg-white rounded-full text-[12px] py-0.5 px-5 w-fit max-w-60"
                            : "bg-white px-2.5 py-1.5 rounded mb-2.5 text-[12px] w-full"
                        }`}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "white",
                        padding: "2px 20px",
                        width: "fit-content",
                        borderRadius: "50px",
                        font: "12px",
                      }}
                    >
                      <p>searching...</p>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <>
                      {msg.sender === "user" ? (
                        <></>
                      ) : msg.text ? (
                        copy ? (
                          <FaRegCopy
                            size={15}
                            data-tooltip-id="copy-text"
                            data-tooltip-content="Copy"
                            onClick={handleCopy}
                            style={{
                              cursor: "pointer",
                              border: "none",
                              outline: "none",
                            }}
                          />
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                      <Tooltip id="copy-text" />
                    </>
                    <>
                      {msg.sender === "user" ? (
                        <></>
                      ) : msg.text ? (
                        copy ? (
                          speak ? (
                            <GiSpeaker
                              size={18}
                              data-tooltip-id="speak-text"
                              data-tooltip-content="voice"
                              onClick={handleSpeak}
                              style={{
                                cursor: "pointer",
                                border: "none",
                                outline: "none",
                              }}
                            />
                          ) : (
                            <>
                              <IoStopCircleOutline
                                size={18}
                                data-tooltip-id="stop-text"
                                data-tooltip-content="stop"
                                onClick={() => {
                                  speechSynthesis.cancel();
                                  setSpeak(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                  border: "none",
                                  outline: "none",
                                }}
                              />
                              <Tooltip id="stop-text" />
                            </>
                          )
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                      <Tooltip id="speak-text" />
                    </>
                  </div>
                  <div ref={bottomRef} />
                </div>
              ))}
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                onInput={handleInput}
                value={question}
                className="w-full border border-gray-300 rounded p-2.5 text-base h-full shadow-sm"
                id="myTextarea"
                placeholder="Ask anything"
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
              ></textarea>
              <div className="flex items-center absolute bottom-2.5 justify-between w-[96%] gap-2 ">
                <div className="flex">
                  <button
                    className={`${
                      isTypeExist
                        ? "text-[#1955db] px-3 py-1.5 rounded text-center no-underline inline-block cursor-pointer text-[12px]"
                        : "border-none px-3 py-1.5 rounded text-center no-underline inline-block cursor-pointer text-[12px]"
                    }`}
                    onClick={() => setIsTypeExist(!isTypeExist)}
                  >
                    Reasoning
                  </button>
                  {/* {isTypeExist ? (
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
                  )} */}
                  {isToneExist ? (
                    <div className="flex items-center justify-center">
                      <select value={selectedTone} onChange={handleToneOption}>
                        <option value="profesional">profesional</option>
                        <option value="casual">casual</option>
                        <option value="straightforward">straightforward</option>
                        <option value="confident">confident</option>
                        <option value="friendly">friendly</option>
                      </select>
                      <MdOutlineDeleteOutline
                        style={{ cursor: "pointer" }}
                        size={18}
                        onClick={handleTone}
                      />
                    </div>
                  ) : (
                    <button
                      className="border-none px-3 py-1.5 rounded text-center no-underline inline-block cursor-pointer text-[12px]"
                      onClick={handleTone}
                    >
                      Change tone +
                    </button>
                  )}
                  {isLengthExist ? (
                    <div className="flex items-center justify-center">
                      <select
                        value={selectedLength}
                        onChange={handleLegthOption}
                      >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                      </select>

                      <MdOutlineDeleteOutline
                        style={{ cursor: "pointer" }}
                        size={18}
                        onClick={handleLength}
                      />
                    </div>
                  ) : (
                    <button
                      className="border-none px-3 py-1.5 rounded text-center no-underline inline-block cursor-pointer text-[12px]"
                      onClick={handleLength}
                    >
                      Length +
                    </button>
                  )}
                </div>
                <div onClick={handleChat}>
                  <MdOutlineSend
                    className="border-none text-[#1955db] cursor-pointer"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
