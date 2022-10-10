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
  return F.format(
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