fetch(`http://${window.location.host}/api/history`)
  .then((response) => response.json())
  .then((data) => {
    textObj = JSON.stringify(data);
    console.log(data);
    $("#myTextarea").text(textObj);
  });
