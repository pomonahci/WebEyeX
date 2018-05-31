# simple-socket-stream

A simple wrapper to make [socket.io-stream] easier to use.

Same API works for both sender and receiver, with interchangeable roles.

[socket.io-stream]: https://github.com/nkzawa/socket.io-stream#usage

## Install

```sh
npm i simple-socket-stream
```

## Usage

### API

```js
const initiate = sss(socket, send, receive, opts);
```

* **`initiate`** `[function]` The function that initiates the sending.

  Any arguments passed to it are passed onto the **`send`**, **`receive`** callbacks.

  ```js
  initiate(...args)
  ```

  Where "filename" is any arbitrary data which is passed to the above callbacks

  It can be called from either server or client, whoever wants to send the file and the relevant callbacks will be fired (on the relevant sides - server/client) for sending/receiving the stream.

* **`socket`** `[object]` Socket instance.

* **`send`** `[function]` The callback function that gives you a stream onto which you send (pipe) the data. It'll be fired after the sender calls the **`initiate`** method. It is called with the following arguments:

  * **`stream`** `[WritableStream]` The stream onto which you write/push to, or pipe a `ReadableStream` to, of the data that you want to send.

  * **`...args`** Rest of the arguments are same as those were passed to the **`initiate`** function.

* **`received`** `[function]` This gives you the received stream. It'll be fired whenever the receiver gets a stream sent to it. It is called with the following arguments:

  * **`stream`** `[ReadableStream]` The stream which you can read/pull from or pipe to a `WritableStream`.

  * **`...args`** Rest of the arguments are same as those were passed to the **`initiate`** function by the sender.

* **`opts`** `[object]` Following options:

  * **`messages`** `[object]` Messages to use in socket communication.

    * **`sendFile`** `[string](default:'send-file')` Message used to initiate the file sending.

    * **`streamFile`** `[string](default:'stream-file')` Message used by socket-stream to send/receive the file stream.

  The default options may also be configured by modifying **`defaults`** property on the default export.

  ```js
  require('simple-stream-socket').defaults.messages.sendFile = ...
  ```


### Example

```js
const sss = require('simple-stream-socket');
```
```js
// Server:
const io = require('socket.io').listen(300);
io.on('connection', socket => {
  const init = sss(socket, send, receive);
});
```
```js
// Client:
const io = require('socket.io-client');
const socket = io.connect(3000);
const init = sss(socket, send, receive);

```

```js

// just pass it the "socket" instance and two callbacks:
const initiate = sss(socket,

  // This gives you a stream onto which you send (pipe) the data
  function send(stream, filename) {
    fs.createReadStream(filename).pipe(stream)
  },
  // It'll be fired after the sender calls the `initiate` method below, to stream the data to be sent

  // This gives you the received stream
  function received(stream, filename) {
    stream.pipe(fs.createWriteStream(filename));
  }
  // It'll be fired whenever the receiver gets a stream sent to it

);

// The returned function initiates the whole sending/receiving process
initiate(filename)
// where "filename" is any arbitrary data which is passed to the above callbacks
// It can be called from either server or client, whoever wants to send the file,
// and the relevant callbacks will be fired (on the relevant sides - server/client) for sending/receiving the stream.
```
