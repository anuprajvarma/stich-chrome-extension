// let popup: HTMLDivElement | null = null;

// document.addEventListener("mousedown", (e) => {
//   // If the user clicks outside the popup, remove it
//   if (popup && e.target instanceof Node && !popup.contains(e.target)) {
//     popup.remove();
//     popup = null;
//   }
// });

// document.addEventListener("mouseup", (e) => {
//   const selection = window.getSelection();
//   const text = selection?.toString().trim();

//   // ✅ Don't show popup if clicked inside existing popup
//   if (popup && e.target instanceof Node && popup.contains(e.target)) {
//     return;
//   }

//   if (popup) {
//     popup.remove();
//     popup = null;
//   }

//   if (text && text.length > 0 && selection?.rangeCount) {
//     console.log("✅ Mouse up event detected, selection text:", text);
//     const range = selection.getRangeAt(0);
//     const rect = range.getBoundingClientRect();

//     popup = document.createElement("div");
//     popup.id = "selection-popup";

//     const aiBtn = document.createElement("button");
//     aiBtn.textContent = "AI";
//     aiBtn.style.backgroundColor = "blue";
//     aiBtn.onclick = () => {
//       toggleChatbot(text);
//     };

//     const translateBtn = document.createElement("button");
//     translateBtn.textContent = "Translate";
//     translateBtn.onclick = () => {
//       toggleChatbot(text);
//     };

//     popup.appendChild(aiBtn);
//     popup.appendChild(translateBtn);

//     Object.assign(popup.style, {
//       position: "absolute",
//       zIndex: "9999",
//       background: "white",
//       border: "1px solid #ccc",
//       padding: "5px",
//       width: "100px",
//     });

//     document.body.appendChild(popup);

//     popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
//     popup.style.left = `${rect.left + window.scrollX}px`;
//   }
// });

// export async function toggleChat() {
//   if (document.getElementById("custom-popup")) return;

//   const res = await fetch(chrome.runtime.getURL("index.html"));
//   console.log("✅ Fetched HTML content:", res.status, res.statusText, res);
//   const html = await res.text();

//   const container = document.createElement("div");
//   container.innerHTML = html;
//   document.body.appendChild(container);
// }

// function toggleChatbot(text: string) {
//   if (popup) {
//     popup.remove();
//     popup = null;
//   }
//   console.log("Toggling chatbot popup...");
//   const existing = document.getElementById("chatbot-popup");

//   if (existing) {
//     console.log("Chatbot popup already exists, removing it...");
//     existing.remove(); // 👈 Closes the iframe popups
//   } else {
//     const iframe = document.createElement("iframe");

//     iframe.src = chrome.runtime.getURL("index.html");
//     iframe.id = "chatbot-popup";

//     Object.assign(iframe.style, {
//       position: "fixed",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       width: "42rem",
//       height: "30rem",
//       border: "none",
//       zIndex: "999999",
//       boxShadow: "0 0 10px rgba(0,0,0,0.3)",
//       borderRadius: "12px",
//     });
//     iframe.onload = () => {
//       console.log("✅ iframe loaded, sending text to React...");
//       // ⏳ delay added in case React isn't mounted
//       setTimeout(() => {
//         iframe.contentWindow?.postMessage(
//           { type: "PASS_TEXT", payload: text },
//           "*"
//         );
//       }, 200); // increase if needed
//     };
//     console.log("chal gya pahle");
//     document.body.appendChild(iframe);
//   }
// }

// window.addEventListener("message", (event) => {
//   console.log("✅ Message received from iframe:", event.data);
//   // You can also verify origin if needed: event.origin === 'chrome-extension://...'
//   if (event.data.type === "REMOVE_IFRAME") {
//     const iframe = document.getElementById("chatbot-popup");
//     if (iframe) iframe.remove();
//   }
// });

// src/contentScript.tsx
// import tailwindCss from "./index.css?inline"; // using vite raw import
// import { ChatButton } from "./ChatBot";
// import { createRoot } from "react-dom/client";

// // 1️⃣ Create a container on the webpage
// const host = document.createElement("div");
// document.body.appendChild(host);

// // 2️⃣ Create a Shadow Root to isolate styles
// const shadow = host.attachShadow({ mode: "open" });

// // 3️⃣ Inject Tailwind CSS into the shadow root
// const style = document.createElement("style");
// style.textContent = tailwindCss;
// shadow.appendChild(style);

// // 4️⃣ Create root element for React
// const rootDiv = document.createElement("div");
// shadow.appendChild(rootDiv);

// // 5️⃣ Render React app inside the shadow root
// createRoot(rootDiv).render(<ChatButton />);

import "./index.css";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ChatButton } from "./ChatBot";

const root = document.createElement("div");
root.id = "__leetcode_ai_whisper_container";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ChatButton />
  </StrictMode>
);
