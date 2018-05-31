'use strict';

const ss = require('socket.io-stream');
const merge = require('merge');

module.exports = simpleSocketStream;

const defaults = {
  messages: {
    sendFile: 'send-file',
    streamFile: 'stream-file',
  }
}

simpleSocketStream.defaults = merge({}, defaults);

function simpleSocketStream(socket, send, receive, opts) {
  if (!socket) {
    throw new Error('Need a socket instance');
  }
  if (!send || typeof send !== 'function') {
    throw new Error('Need a send callback function');
  }
  if (!receive || typeof receive !== 'function') {
    throw new Error('Need a receive callback function');
  }

  opts = merge({}, defaults, simpleSocketStream.defaults, opts);

  const streamSocket = ss(socket);

  socket.on(opts.messages.sendFile, function(data) {
    const stream = ss.createStream();
    const args = [stream].concat([].slice.call(arguments));
    streamSocket.emit.apply(streamSocket, [opts.messages.streamFile].concat(args));
    return receive.apply(null, args);
  });

  streamSocket.on(opts.messages.streamFile, function(stream, data) {
    send.apply(null, arguments);
  });

  return function initiate(data) {
    const args = [opts.messages.sendFile].concat([].slice.call(arguments));
    return socket.emit.apply(socket, args);
  };
}
