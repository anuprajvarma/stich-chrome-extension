// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("Received message:", message, "from sender:", sender);
//   if (message.type === "AI") {
//     console.log("Received AI message:", message.payload + sender);
//     // Call AI API or process here
//   } else if (message.type === "TRANSLATE") {
//     console.log("Received Translate message:", message.payload);
//     // Call Translate API or process here
//   }

//   // Optional: send a response
//   sendResponse({ status: "ok" });

//   return true; // needed if response is async
// });

// background.js or service_worker.js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id ?? 0 },
    func: toggleChatbot,
  });
});

function toggleChatbot() {
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
    document.body.appendChild(iframe);
  }
}

console.log("Background script loaded");
