import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaRegCopy } from "react-icons/fa6";
import "react-tooltip/dist/react-tooltip.css";
import { GiSpeaker } from "react-icons/gi";
import { Tooltip } from "react-tooltip";
import { IoStopCircleOutline } from "react-icons/io5";
import { BotMessageSquare } from "lucide-react";

const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [question, setQuestion] = useState("");
  const [copy, setCopy] = useState(false);
  const [speak, setSpeak] = useState(true);
  const [isTypeExist, setIsTypeExist] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const speakText = (text: string) => {
    console.log("Speaking text:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    console.log("app mount ho gya");
    const handleMessage = (event: MessageEvent) => {
      console.log("📩 React got message:", event.data);
      if (event.data?.type === "PASS_TEXT") {
        console.log("🧠 Received from content.js:", event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
              content: `You are a helpful assistant. Respond in long and detail formate and in english`,
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-4 left-4
          rounded-lg 
          flex gap-1 items-center justify-center font-semibold
          shadow-lg
          transition-all duration-300 bg-[#303030] px-4 py-2
          cursor-pointer
          z-[99999]
        "
      >
        <BotMessageSquare size={25} className="font-semibold" />
        <p>Ask me</p>
      </button>

      {isOpen && (
        <div
          className="flex flex-col fixed bottom-14 left-4 pb-3 px-2
          rounded-t-2xl w-100 h-11/12
           items-center justify-center
          shadow-lg bg-[#212121]
          transition-all duration-300
          z-[99999]"
        >
          <div className="w-full h-8 flex justify-end items-center text-lg px-2 py-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-[#303030] px-2 py-1 rounded-lg"
            >
              X
            </button>
          </div>
          <div className="flex w-full h-full overflow-y-scroll scrollbar-none pt-2">
            {messages.length > 0 ? (
              <div className="flex flex-col w-full h-full">
                {messages.map((msg, index) => (
                  <div key={index} className="flex flex-col gap-2.5 w-full">
                    {msg.text ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems:
                            msg.sender === "user" ? "flex-end" : "flex-start", // use correct values
                          justifyContent:
                            msg.sender === "user" ? "end" : "start", // probably what you meant instead of justifyItems
                        }}
                      >
                        <div
                          ref={textRef}
                          key={index}
                          className={`message ${
                            msg.sender === "user"
                              ? "bg-[#303030] rounded-2xl text-[12px] py-2 px-4 w-fit max-w-60"
                              : "bg-[#303030] px-2.5 py-1.5 rounded-2xl mb-2.5 text-[12px] w-full"
                          }`}
                        >
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#303030] px-4 py-2 rounded-2xl text-[12px] w-fit">
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
                      <div>
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
                      </div>
                    </div>
                    <div ref={bottomRef} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-xl font-semibold">
                <p>What can i help with?</p>
              </div>
            )}
          </div>
          <div className="w-full bg-[#303030] rounded-3xl">
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={question}
              rows={1}
              className="w-full border-none outline-none rounded-3xl px-3 py-2 resize-none"
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
