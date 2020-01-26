// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
import "phoenix_html"

import socket from "./socket"

const channel = socket.channel('room:lobby', {});

channel.on('shout', (payload) => {
  let p = document.createElement("p");
  let name = payload.name || 'guest';
  p.innerHTML = '<b>' + name + '</b>: ' + payload.message;
  messages.appendChild(p);
});

channel.join();

const messages = document.getElementById('messages');
const name = document.getElementById('name');
const message = document.getElementById('message');

message.addEventListener('keypress', (event) => {
  // On enter
  if (event.keyCode == 13 && message.value.length > 0) {
    channel.push('shout', {
      name: name.value,
      message: message.value
    });
    message.value = '';
  }
});

