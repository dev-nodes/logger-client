const ReconnectingWebSocket = require('reconnecting-websocket')
const WebSocket = require("ws")
const options = {
  WebSocket: WebSocket,
  connectionTimeout: 5000
}
let queue = [];
exports.instance = function(wsurl, app) {
  const ws = new ReconnectingWebSocket(wsurl, [], options)
  ws.onerror = function(e) {
    console.log(e.message)
  }
  ws.onclose = function() {
    console.log(`[${app}] logging socket closed`);
  }
  const queuRunner = () => {
    if(queue.length) {
      for(const l of queue) {
        if (ws.readyState === ws.OPEN) {
          ws.send(l);
        }
      }
      queue = [];
    }
  }
  ws.onopen = function() {
    console.log(`[${app}] logging socket connected`)
    queuRunner();
  }
  const logApi = {
    log(...args) {
      const payload = JSON.stringify({ app, type: "log", data: args.join(" ") })
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
      }else {
        queue.push(payload)
      }
    },
    error(...args) {
      const payload = JSON.stringify({ app, type: "log", data: args.join(" ") })
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
      }else {
        queue.push(payload)
      }
    },
    info(...args) {
      const payload = JSON.stringify({ app, type: "log", data: args.join(" ") })
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
      }else {
        queue.push(payload)
      }
    },
    close() {
      if (ws.readyState !== ws.CLOSED) {
        queue = []
        ws.close();
      }
    },
    connected() {
      return ws.readyState === ws.OPEN
    }
  };
  return logApi;
}
