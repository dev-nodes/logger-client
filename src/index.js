const WebSocket = require("ws")

exports.instance = function(wsurl,app) {
const url = new URL(wsurl)
url.protocol = url.protocol == "ws:" ? "http:": "https:"
const ws = new WebSocket(wsurl,{ origin: url.origin})
ws.onerror = function(e) {
  console.log(e.message)
}
return new Promise(resolve => {
  ws.onopen = function() {
    const logApi = {
      log(...args) {
        ws.send(JSON.stringify({app, type: "log", data: args.join(" ")}));
      },
      error(...args) {
        ws.send(JSON.stringify({app, type: "error", data: args.join(" ")}));
      },
      info(...args) {
        ws.send(JSON.stringify({app, type: "info", data: args.join(" ")}));
      }
    };
    resolve(logApi);
  };
})
}
