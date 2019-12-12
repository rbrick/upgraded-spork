/* This isn't very well written, nor secure. */

// JSON parse is faster
var ChatColor = JSON.parse('{"BLACK":{"color":"black","code":"0"},"DARK_BLUE":{"color":"darkblue","code":"1"},"DARK_GREEN":{"color":"green","code":"2"},"DARK_AQUA":{"color":"cyan","code":"3"},"DARK_RED":{"color":"darkred","code":"4"},"DARK_PURPLE":{"color":"purple","code":"5"},"GOLD":{"color":"gold","code":"6"},"GRAY":{"color":"gray","code":"7"},"DARK_GRAY":{"color":"darkgray","code":"8"},"BLUE":{"color":"blue","code":"9"},"GREEN":{"color":"lime","code":"a"},"AQUA":{"color":"aqua","code":"b"},"RED":{"color":"red","code":"c"},"LIGHT_PURPLE":{"color":"magenta","code":"d"},"YELLOW":{"color":"yellow","code":"e"},"WHITE":{"color":"white","code":"f"},"OBFUSCATED":{"format":true,"code":"k"},"BOLD":{"format":true,"code":"l"},"STRIKETHROUGH":{"format":true,"code":"m"},"UNDERLINE":{"format":true,"code":"n"},"ITALIC":{"format":true,"code":"o"},"RESET":{"format":true,"code":"r"}}');
var SectionSymbol = '§';
var ColorCodes = "0123456789abcdefklmnor";

function fromColorCode(code) {
  for (var k in ChatColor) {
    if (ChatColor[k].code == code) {
      return k;
    }
  }
}

function fromLegacy(legacyText, sub) {
  if (typeof legacyText == "string") {

    var parent = null;
    var currentObject = { extra: [] };
    var text = "";

    for (var i = 0; i < legacyText.length; i++) {
      var c = legacyText[i];

      if (c == SectionSymbol || c == sub) {
        if ((i + 1) > legacyText.length - 1) {
          continue;
        }

        var peek = legacyText[i + 1];

        if (isValidColor(peek)) {
          i += 1;

          if (text.length > 0) {
            currentObject.text = text;

            if (parent == null) {
              parent = currentObject;
            } else {
              parent.extra.push(currentObject);
            }

            currentObject = { extra: [] };
            text = "";
          }

          var color = fromColorCode(peek);

          if (ChatColor[color].format === true) {
            if (color === "RESET") {
              currentObject.color = "white";
              currentObject.strikethrough = false;
              currentObject.bold = false;
              currentObject.obfuscated = false;
              currentObject.underline = false;
              currentObject.italic = false;
            } else {
              currentObject[color.toLowerCase()] = true;
            }
          } else {
            currentObject = { extra: [] };
            currentObject.color = ChatColor[color].color;
          }

        } else {
          text += c;

        }
      } else {
        text += c;
      }
    }

    currentObject.text = text;

    if (parent == null) {
      parent = currentObject;
    } else {
      parent.extra.push(currentObject);
    }
    return parent;
  }

  return {};
}

function isValidColor(c) {
  if (typeof c == "string")
    return ColorCodes.indexOf(c.toLowerCase()) != -1;
  return false;
}

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
      if (value === true) // strikethrough = true
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
    }
  }


  if (json["extra"] !== undefined) {
    var extra = json["extra"];

    for (var i = 0; i < extra.length; i++) {
      x += render(extra[i]);
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
    case "dark_aqua":
      color = "cyan";
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
