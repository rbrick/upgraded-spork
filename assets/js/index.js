/* This isn't very well written, nor secure. */

function parseString(string) {
  var json = JSON.parse(string);
  if (json !== null) {
    return render(json);
  }
  return null;
}

function render(json) {
  if (json["text"] === undefined) {
    return ""; // rip
  }
  // Escape the string; may or may not have been suggested on Stackoverflow...(it was.)
  var text = new Option(json["text"]).innerHTML;
  var x = text;

  for (var k in json) {
    var value = json[k];

    switch (k) {
      case "bold": {
          if (value === true) // bold = true
            x = "<b>" + x + "</b>";
      }
      break;
      case "italic": {
        if (value === true) // italic = true
          x = "<i>" + x + "</i>";
      }
      break;
      case "strikethrough": {
        if (value === true)  // strikethrough = true
          x = "<s>" + x + "</s>";
      }
      break;
      case "underlined": {
        if (value === true) // underlined = true
          x = "<u>" + x + "</u>";
      }
      break;
      case "color": {
        x = `<span style="color: ${getColor(value)};">${x}</span>`;
      }
      break;
      case "extra": {
        var extra = json[k];
        for (var i = 0; i < extra.length; i++) {
          x += render(extra[i]);
        }
      }
      break;
    }
  }
  return `<span class='text-container'>${x}</span>`;
}

function getColor(query) {
  var color = "white";
  /* handle JSON chats */
  switch (query) {
    /* This handles chat color, pretty messy */
    case "light_purple":
        color = "magenta";
    break;
    case "dark_red":
        color = "darkred";
    break;
    case "dark_blue":
        color = "darkblue";
    break;
    case "dark_purple":
        color = "purple";
    break;
    case "dark_green":
        color = "green";
    break;
    case "dark_gray":
        color = "darkgray";
    break;
    case "green":
        color = "lime";
    break;
    case "aqua":
        color = "aqua";
    break;
    case "red":
        color = "red";
    break;
    case "blue":
       color = "blue";
    break;
    case "gray":
        color = "gray";
    break;
    case "gold":
        color = "gold";
    break;
    case "yellow":
        color = "yellow";
    break;
    case "white":
        color = "white";
    break;
  }

  return color;
}
