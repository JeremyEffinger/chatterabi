//Generate a unique UUID v4 format for a user.
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//Format a nice time for a message that is sent.
function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

//Check to see if a session exists for the site
if (!window.sessionStorage.chatterabi) {
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)};`; //assign a random hex color code for user
  let id = uuidv4(); //assign uuid
  window.sessionStorage.setItem("chatterabi", JSON.stringify({ id, color })); //store both id and color for session.
}

const { id, color } = JSON.parse(window.sessionStorage.getItem("chatterabi")); //Get user ID and color

const socket = new WebSocket(`wss://${window.location.host}/`); //create a new websocket connection window location (localhost for dev, or deployment location.)

socket.addEventListener("open", (event) => {
  let $form = $(".msger-inputarea");

  //On submit form event send message
  $form.on("submit", (event) => {
    let $input = $(".msger-input");
    var text = $input.val();
    console.log(text);
    if (text == "") {
      return false;
    }
    socket.send(JSON.stringify({ id, color, text }));
    $input.val("");
    return false;
  });

  //on message event render message in html.
  socket.onmessage = (msg) => {
    console.log(msg);
    let response = JSON.parse(msg.data);
    let $messageList = $(".msger-chat");
    let side = response.id === id ? "left" : "right"; //If message sent by you right side, if not left side.
    $messageList.append(`<div class="msg ${side}-msg">
    <div class="msg-img" style="background-image: url(${"./img/anonymous.png"})"></div>

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
    $messageList.animate({ scrollTop: $messageList.prop("scrollHeight") }, 500); //ensure chatwindow scrolls to bottom.
  };
});
