const ReconnectingWebSocket = require('reconnecting-websocket')
const WebSocket = require("ws")
const options = {
  WebSocket: WebSocket,
  connectionTimeout: 5000
}
exports.instance = function(wsurl, app) {
  const ws = new ReconnectingWebSocket(wsurl, [], options)
  ws.onerror = function(e) {
    console.log(e.message)
  }
  ws.onclose = function() {
    console.log(`[${app}] logging socket closed`);
  }
  return new Promise(resolve => {
    ws.onopen = function() {
      const logApi = {
        log(...args) {
          ws.send(JSON.stringify({ app, type: "log", data: args.join(" ") }));
        },
        error(...args) {
          ws.send(JSON.stringify({ app, type: "error", data: args.join(" ") }));
        },
        info(...args) {
          ws.send(JSON.stringify({ app, type: "info", data: args.join(" ") }));
        },
        close() {
          if (ws.readyState !== ws.CLOSED) {
            ws.close();
          }
        },
        connected() {
          return ws.readyState === ws.OPEN
        }
      };
      resolve(logApi);
    };
  })
}
