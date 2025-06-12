// let popup: HTMLDivElement | null = null;

// document.addEventListener("mouseup", () => {
//   const selection = window.getSelection();
//   const text = selection?.toString().trim();

//   if (popup) popup.remove();

//   if (text && text.length > 0 && selection?.rangeCount) {
//     const range = selection.getRangeAt(0);
//     const rect = range.getBoundingClientRect();

//     popup = document.createElement("div");
//     popup.id = "selection-popup";

//     const aiBtn = document.createElement("button");
//     aiBtn.textContent = "AI";
//     aiBtn.onclick = () => {
//       console.log(`AI Feature: "${text}"`);
//     };

//     const translateBtn = document.createElement("button");
//     translateBtn.textContent = "Translate";
//     translateBtn.onclick = () => {
//       console.log(`Translate Feature: "${text}"`);
//     };

//     popup.appendChild(aiBtn);
//     popup.appendChild(translateBtn);

//     popup.style.position = "absolute";
//     popup.style.zIndex = "9999"; // Optional styling
//     popup.style.background = "white";
//     popup.style.border = "1px solid #ccc";
//     popup.style.padding = "5px";

//     document.body.appendChild(popup);

//     const scrollTop = window.scrollY || document.documentElement.scrollTop;
//     popup.style.top = `${rect.bottom + scrollTop + 5}px`;
//     popup.style.left = `${rect.left + window.scrollX}px`;
//   }
// });

// document.addEventListener("mousedown", (e: MouseEvent) => {
//   if (popup && e.target instanceof Node && !popup.contains(e.target)) {
//     popup.remove();
//   }
// });

// function injectPopup() {
//   const existing = document.getElementById("chatbot-overlay");
//   if (existing) existing.remove();

//   const iframe = document.createElement("iframe");
//   iframe.src = chrome.runtime.getURL("popup.html");
//   iframe.style.position = "fixed";
//   iframe.style.top = "50%";
//   iframe.style.left = "50%";
//   iframe.style.transform = "translate(-50%, -50%)";
//   iframe.style.zIndex = "999999";
//   iframe.style.width = "400px";
//   iframe.style.height = "300px";
//   iframe.style.border = "1px solid #ccc";
//   iframe.style.borderRadius = "10px";
//   iframe.style.background = "white";
//   iframe.id = "chatbot-overlay";

//   document.body.appendChild(iframe);
// }

// // 🟡 Optional: Add test button on all pages to trigger popup
// const triggerBtn = document.createElement("button");
// triggerBtn.textContent = "Open Chatbot";
// triggerBtn.style.position = "fixed";
// triggerBtn.style.bottom = "20px";
// triggerBtn.style.right = "20px";
// triggerBtn.style.zIndex = "999999";
// triggerBtn.style.padding = "8px 12px";
// triggerBtn.style.border = "none";
// triggerBtn.style.background = "#007bff";
// triggerBtn.style.color = "white";
// triggerBtn.style.borderRadius = "5px";
// triggerBtn.style.cursor = "pointer";

// triggerBtn.onclick = injectPopup;

// document.body.appendChild(triggerBtn);

// const existing = document.getElementById("chatbot-popup");

// if (existing) {
//   console.log("Chatbot popup already exists, removing it...");
//   existing.remove(); // 👈 Close the popup if it already exists
// } else {
//   console.log("Injecting chatbot popup...");
//   const iframe = document.createElement("iframe");
//   iframe.src = chrome.runtime.getURL("index.html");
//   iframe.id = "chatbot-popup";

//   Object.assign(iframe.style, {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "50rem",
//     height: "40rem",
//     border: "none",
//     zIndex: "999999",
//     boxShadow: "0 0 10px rgba(0,0,0,0.3)",
//     borderRadius: "12px",
//   });

//   document.body.appendChild(iframe);
// }

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "getData") {
//     console.log("Content script received message:", message.action);
//   }
// });

// document.addEventListener("mouseup", function () {
//   const selectedText = window.getSelection()?.toString().trim();
//   if (selectedText) {
//     chrome.runtime.sendMessage({ type: "TEXT_SELECTED", text: selectedText });
//   }
// });
