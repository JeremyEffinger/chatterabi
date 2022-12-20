console.log("hello");

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

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
    socket.send(text);
    lastmsg = text;
    $input.text = "";
    return false;
  });

  socket.onmessage = (msg) => {
    console.log(msg);
    let response = JSON.parse(msg.data);
    let $messageList = $(".msger-chat");
    let side = response.msg === lastmsg ? "left" : "right";
    console.log(side);
    console.log(response.msg === lastmsg);
    $messageList.append(`<div class="msg ${side}-msg">
    <div class="msg-img" style="background-image: url("place holder img")"></div>

    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${response.metadata.id.slice(-5)}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
      </div>

      <div class="msg-text">${response.msg}</div>
    </div>
  </div>`);
  };
});
