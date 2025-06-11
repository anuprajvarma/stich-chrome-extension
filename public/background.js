// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "TEXT_SELECTED") {
//     const urlWithQuery = chrome.runtime.getURL(
//       `index.html?text=${encodeURIComponent(message.text)}`
//     );
//     chrome.windows.create({
//       url: urlWithQuery,
//       type: "popup",
//       width: 400,
//       height: 600,
//     });
//   }
// });
