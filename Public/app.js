function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

if (!window.sessionStorage.chatterabi) {
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)};`;
  let id = uuidv4();
  window.sessionStorage.setItem("chatterabi", JSON.stringify({ id, color }));
}

const { id, color } = JSON.parse(window.sessionStorage.getItem("chatterabi"));

const socket = new WebSocket("ws://localhost:3000/");
let lastmsg = "";

socket.addEventListener("open", (event) => {
  let $form = $(".msger-inputarea");

  $form.on("submit", (event) => {
    let $input = $(".msger-input");
    var text = $input.val();
    console.log(text);
    if (text == "") {
      return false;
    }
    socket.send(JSON.stringify({ id, color, text }));
    $input.text = "";
    return false;
  });

  socket.onmessage = (msg) => {
    console.log(msg);
    let response = JSON.parse(msg.data);
    let $messageList = $(".msger-chat");
    let side = response.id === id ? "left" : "right";
    $messageList.append(`<div class="msg ${side}-msg">
    <div class="msg-img" style="background-image: url("place holder img")"></div>

    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name" style="color:${
          response.color
        }">${response.id.slice(-5)}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
      </div>

      <div class="msg-text">${response.text}</div>
    </div>
  </div>`);
  };
});
