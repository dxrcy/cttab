//* DOCUMENTATION - https://github.com/darccyy/cttab#cttab
//* Main script file - Global functions and small classes

// Reload all states - Only on page load
function init() {
  ls.check();
  console.log(language.get("console"));
  header.init();
  sc.init();
  garf.init();
  notes.init();
  bg.init();
  language.init();
}

// Format template element in html
function getTemplate(name, values) {
  return format(
    $(`template[name=${name}]`)
      .html()
      .split("\n")
      .join("")
      .split("  ")
      .join(""),
    values,
  );
}

// Download file
function download(data, filename, type) {
  const file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

// Format trimmed URL to include `file`, `http`, ect
function formatURL(string) {
  if (!string) {
    return string;
  }
  var url = string.split("?")[0].split("\\").join("/"),
    query = string.split("?").slice(1).join("?"),
    urlLower = url.toLowerCase();
  url += query ? "?" + query : "";

  if (urlLower.startsWith("c:")) {
    return "file:///" + url;
  }

  if (
    !(
      urlLower.startsWith("file:") ||
      urlLower.startsWith("mailto:") ||
      urlLower.startsWith("https:") ||
      urlLower.startsWith("http:")
    )
  ) {
    return "https://" + url;
  }

  return url;
}

// Format Date object as YYYYxMMxDD with `x` given as `char`
function formatDate(date, char = "-") {
  var dd = date.getDate(),
    mm = date.getMonth() + 1,
    yyyy = date.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + char + mm + char + dd;
}

//TODO comments
function padTwoDigits(number) {
  number = number.toString();
  return number.length < 2
    ? "0" + number
    : number;
}

// Header
class header {
  // Initialize header
  static init() {
    var text = ls.all.header || language.get("header_default");
    $("#header").text(text);
    $("title").text(text);

    // Advocacy for 𝑩𝒐𝒍𝒔𝒂
    confettiHandler.hide();
    var chars = {
      𝑩: "b",
      𝑶: "o",
      𝑳: "l",
      𝑺: "s",
      𝑨: "a",
      𝒃: "𝒃",
      𝒐: "o",
      𝒍: "l",
      𝒔: "s",
      𝒂: "a",
    };
    for (var i in chars) {
      text = text.split(i).join(chars[i]);
    }
    if (["bolsa", "bolso"].includes(text.toLowerCase())) {
      confettiHandler.show();
    }
  }

  // Edit text
  static edit(event) {
    if (event?.key && !["Enter", "Space"].includes(event.code)) {
      return;
    }

    var text = prompt(
      language.get("header_edit"),
      ls.all.header || language.get("header_default"),
    );
    if (text === "") {
      text = null;
    } else if (!text) {
      return;
    }

    ls.set(all => {
      all.header = text;
    });
    header.init();
  }
}

// Notes
class notes {
  // Initialize notes
  static init() {
    $(".note").each((i, el) => {
      el.remove();
    });
    for (var i = 0; i < ls.all.notes.length; i++) {
      $("main").append(
        getTemplate("note", {
          number: i,
          text: ls.all.notes[i] || "",
        }),
      ); //? Use <main> for notes ?
    }
    language.fillTemplate("main");

    // Enable/disable skip button
    $(".skip").css("display", ls.all.notes.length ? "initial" : "none");
  }

  // Edit note text - Save to localStorage
  static edit(number) {
    ls.set(all => {
      all.notes[number] = $(`.note[number=${number}] textarea`).val();
    });
  }

  // Delete note
  static delete(number) {
    if (ls.all.notes[number] && !confirm(language.get("note_delete_confirm"))) {
      return;
    }
    ls.set(all => {
      all.notes = [
        ...all.notes.slice(0, number),
        ...all.notes.slice(number + 1),
      ];
    });
    notes.init();
  }

  // Add note
  static add(number) {
    ls.set(all => {
      all.notes.push("");
    });
    notes.init();
  }

  // Focus note (with skip button in header)
  static focus() {
    $(".note:first-of-type textarea").focus();
  }
}

// Confetti
// Cannot be named `confetti`
class confettiHandler {
  // Confetti settings
  static cooldown = 0;

  // Start confetti animation
  static start() {
    if (confettiHandler.cooldown + 200 > Date.now()) {
      return;
    }
    confettiHandler.cooldown = Date.now();
    confettiHandler.disable();
    setTimeout(confettiHandler.enable, 200);

    // Settings for confetti.js
    confetti({
      particleCount: 150,
      origin: { x: 0.5, y: 1 },
      scalar: 1.7,
    });

    console.log(language.get("support"));
  }

  // Disable button (while active)
  static disable() {
    $("#confetti").attr("disabled", true);
  }

  // Enable button
  static enable() {
    $("#confetti").attr("disabled", false);
  }

  // Hide button
  static hide() {
    $("#confetti").addClass("hidden");
  }

  // Show button
  static show() {
    $("#confetti").removeClass("hidden");
  }
}

// * -----------------------------
// * All below was from Fortissimo
// * -----------------------------
//TODO Add comments to all functions

function format(string, ...replace) {
  if (!replace || !string || typeof string !== "string") {
    return string;
  }
  if (typeof replace[0] === "object") {
    replace = replace[0];
  }
  for (var i in replace) {
    string = string.split("{" + i + "}").join(replace[i]);
  }
  return string;
}

function randomInt(min, max, floor = true) {
  if (min === max) {
    return min;
  }
  if (min > max) {
    throw "Minimum greater than maximum";
  }
  return Math[floor ? "floor" : "round"](Math.random() * (max - min) + min);
}

function randomChoice(array) {
  if (!array) {
    return;
  }
  return array[randomInt(0, array.length - 1)];
}

function toHex(number) {
  if (number === 0) {
    return "00";
  }
  if (number) {
    var hex = Math.floor(number).toString(16).toUpperCase();
    if (hex) {
      return hex.length === 1 ? "0" + hex : hex;
    }
  }
  throw "`number` is not defined";
}

function rgb2hex(rgb) {
  return "#" + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}

function hsv2rgb(hsv, round = true) {
  var h = (round ? Math.floor(hsv.h) : hsv.h) / 360,
    s = (round ? Math.floor(hsv.s) : hsv.s) / 100,
    v = (round ? Math.floor(hsv.v) : hsv.v) / 100,
    i = Math.floor(h * 6),
    f = h * 6 - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    r = 0,
    g = 0,
    b = 0;

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  r *= 255;
  g *= 255;
  b *= 255;
  if (!round) {
    return {
      r,
      g,
      b,
    };
  }

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

function hsv2hex(hsv) {
  return rgb2hex(hsv2rgb(hsv));
}
