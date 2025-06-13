chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("✅ Received message:", message + sender);
  sendResponse({ status: "received" });
});

// background.js or service_worker.js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id ?? 0 },
    func: toggleChatbot,
  });
});

function toggleChatbot() {
  console.log("Toggling chatbot popup...");
  const existing = document.getElementById("chatbot-popup");
  if (existing) {
    console.log("Chatbot popup already exists, removing it...");
    existing.remove(); // 👈 Closes the iframe popup
  } else {
    console.log("Injecting chatbot popup...");
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("index.html");
    iframe.id = "chatbot-popup";
    Object.assign(iframe.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "30rem",
      height: "20rem",
      border: "none",
      zIndex: "999999",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      borderRadius: "12px",
    });
    iframe.onload = () => {
      iframe.contentWindow?.postMessage({ type: "INIT" }, "*");
    };
    document.body.appendChild(iframe);
  }
}

console.log("Background script loaded");
