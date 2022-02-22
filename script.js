if (!F.URL.online) {
  $(".local").each((i, e) => {
    e.href += ".html";
  });
  $(".local.index").each((i, e) => {
    e.href = location.href.split("/").slice(0, -1).join("/") + "/index.html";
  });
}

function init() {
  ls.check();
  console.log(language.get("console"));
  header.init();
  sc.init();
  notes.init();
  bg.init();
  language.init();
}

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

// Local Storage
const ls = {};
ls.check = function () {
  if (localStorage.cttab) {
    try {
      JSON.parse(localStorage.cttab);
    } catch (err) {
      ls.reset();
    }
  } else {
    ls.reset();
  }
};

ls.reset = function () {
  localStorage.cttab = JSON.stringify({
    header: null,
    sc: Array(24).fill([]),
    search: null,
    notes: [""],
    lang: "en",
    bg: { color: null, image: null },
  });

  init();
};

ls.resetConfirm = function () {
  if (!confirm(language.get("ls_reset"))) {
    return;
  }
  ls.reset();
};

ls.__defineGetter__("all", () => {
  ls.check();
  return JSON.parse(localStorage.cttab);
});

ls.set = function (callback) {
  all = ls.all;
  var value = callback(all);
  if (value) {
    localStorage.cttab = value;
    return;
  }
  localStorage.cttab = JSON.stringify(all);
};

const oFReader = new FileReader();
ls.import = async function (data) {
  if (!data) {
    // Read file
    data = await new Promise(resolve => {
      oFReader.readAsText($("#ls-file")[0].files[0]);
      oFReader.onload = function (oFREvent) {
        resolve(oFREvent.target.result);
      };
    });
  }
  ls.set(() => data);
  init();
};

ls.export = function () {
  download(JSON.stringify(ls.all), "cttab-data.json", "text/json");
};

// Download file
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    var a = document.createElement("a"),
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

// Lang (Defined in lang.js)
language.init = function () {
  $("#lang_display").text((ls.all.lang || "en").toUpperCase());
  $(".lang-tofill").each((i, element) => {
    element = $(element);
    language.change(element);
    element.removeClass("lang-tofill");
  });
};

language.fillTemplate = function (parent) {
  $(parent + " .lang-canfill").each((i, element) => {
    element = $(element);
    language.change(element);
    element.removeClass("lang-canfill");
  });
};

language.change = function (element) {
  if (!element) {
    return;
  }
  if (element.constructor === String || element.constructor === HTMLElement) {
    element = $(element);
  }

  var text = element.text();
  if (
    !element.hasClass("ignore-text") &&
    text?.startsWith("[") &&
    text.endsWith("]")
  ) {
    element.text(
      language.get(
        text.slice(1, -1).split(" ")[0] || "null",
        JSON.parse(text.slice(1, -1).split(" ").slice(1).join(" ") || "{}"),
      ),
    );
  }

  var attributes = ["title", "placeholder"];
  for (var i in attributes) {
    var attr = element.attr(attributes[i]);
    if (attr && attr.startsWith("[") && attr.endsWith("]")) {
      element.attr(
        attributes[i],
        language.get(
          attr.slice(1, -1).split(" ")[0] || "null",
          JSON.parse(attr.slice(1, -1).split(" ").slice(1).join(" ") || "{}"),
        ),
      );
    }
  }

  element.addClass("lang-filled");
};

language.get = function (code, format) {
  return F.format(
    language.data[ls.all?.lang || "en"]?.[code] || `[${code}]`,
    format,
  );
};

language.switch = function () {
  ls.set(all => {
    all.lang = all.lang !== "eo" ? "eo" : "en";
  });
  location.reload();
};

// Header
const header = {};
header.init = function () {
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
  if (text.toLowerCase() === "bolsa") {
    confettiHandler.show();
  }
};

header.edit = function (event) {
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
};

// Shortcuts
const sc = {};
sc.init = function () {
  var html = "";
  for (var i = 0; i < ls.all.sc.length; i++) {
    html += getTemplate("shortcut", {
      //? Add truncate
      title:
        ls.all.sc[i][0] != undefined
          ? ls.all.sc[i][0]
          : F.format(language.get("sc_text_default"), { number: i + 1 }),
      href: ls.all.sc[i][1] || "https://epicwebsite.bruh.international",
      imageHref: ls.all.sc[i][1]?.startsWith("file:")
        ? "./image/file.png"
        : ls.all.sc[i][0] || ls.all.sc[i][1]
        ? "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=" +
          (ls.all.sc[i][1] || "https://epicwebsite.bruh.international")
        : "",
      imgClass: ls.all.sc[i][0] || ls.all.sc[i][1] ? "" : "hide",
      number: i,
      empty: ls.all.sc[i][0] != undefined && ls.all.sc[i][1] ? "" : "empty",
    });
  }
  $("#shortcuts").html(html);
  language.fillTemplate("#shortcuts");
};

sc.edit = function (number) {
  var href = prompt(
    F.format(language.get("sc_edit_url"), { number: number + 1 }),
    ls.all.sc[number][1] || "https://epicwebsite.bruh.international",
  );
  if (href === "") {
    ls.set(all => {
      all.sc[number] = [];
    });
    sc.init();
  }
  if (!href) {
    return;
  }

  var title = prompt(
    F.format(language.get("sc_edit_text"), { number: number + 1 }),
    ls.all.sc[number][0] != undefined
      ? ls.all.sc[number][0]
      : F.format(language.get("sc_edit_text_default"), { number: number + 1 }),
  );
  if (title === undefined) {
    return;
  }

  ls.set(all => {
    all.sc[number] = [title, formatURL(href)];
  });
  sc.init();
};

sc.imageError = function (number) {
  $(`.shortcut[number="${number}"] img`).attr("src", "./image/error.png");
};

function formatURL(string) {
  if (!string) {
    return string;
  }
  string = string.toLowerCase();

  if (string.startsWith("c:")) {
    return "file:///" + string;
  }
  if (
    !(
      string.startsWith("file:") ||
      string.startsWith("mailto:") ||
      string.startsWith("https:") ||
      string.startsWith("http:")
    )
  ) {
    return "https://" + string;
  }

  return string;
}

// Notes
const notes = {};
notes.init = function () {
  var html = "";
  for (var i = 0; i < ls.all.notes.length; i++) {
    html += getTemplate("note", {
      number: i,
      text: ls.all.notes[i] || "",
    });
  }
  $("#notes").html(html);
  language.fillTemplate("#notes");
};

notes.edit = function (number) {
  ls.set(all => {
    all.notes[number] = $(`.note[number=${number}] textarea`).val();
  });
};

notes.delete = function (number) {
  ls.set(all => {
    all.notes = [...all.notes.slice(0, number), ...all.notes.slice(number + 1)];
  });
  notes.init();
};

notes.add = function (number) {
  ls.set(all => {
    all.notes.push("");
  });
  notes.init();
};

notes.focus = function () {
  $("#notes textarea").first().focus();
};

// Confetti
const confettiHandler = {
  cooldown: 0,
};

confettiHandler.start = function () {
  if (confettiHandler.cooldown + 200 > Date.now()) {
    return;
  }
  confettiHandler.cooldown = Date.now();
  confettiHandler.disable();
  setTimeout(confettiHandler.enable, 200);

  confetti({
    particleCount: 150,
    origin: { x: 0.5, y: 1 },
    scalar: 1.7,
  });

  console.log("Support 𝑩𝒐𝒍𝒔𝒂!");
};

confettiHandler.disable = function () {
  $("#confetti").attr("disabled", true);
};

confettiHandler.enable = function () {
  $("#confetti").attr("disabled", false);
};

confettiHandler.hide = function () {
  $("#confetti").addClass("hidden");
};

confettiHandler.show = function () {
  $("#confetti").removeClass("hidden");
};

// Background
const bg = {};

bg.init = function () {
  if (!ls.all.bg) {
    ls.set(all => {
      all.bg = { color: null, image: null };
    });
  }

  if (ls.all.bg.color) {
    var color = ls.all.bg.color;

    // Get random colour
    if (color === "?") {
      color = F.randomHex();
    } else if (color.startsWith("?")) {
      var params = color.split(" ");
      var settings = { h0: 0, h1: 360, s0: 0, s1: 100, v0: 0, v1: 100 };

      for (var i = 1; i < params.length; i++) {
        var param = params[i];
        if ("hsv".includes(param[0])) {
          var num = parseInt(param.slice(2));
          if (param[1] === "=") {
            settings[param[0] + "0"] = num;
            settings[param[0] + "1"] = num;
          } else if (param[1] === ">") {
            settings[param[0] + "0"] = num;
          } else if (param[1] === "<") {
            settings[param[0] + "1"] = num;
          }
        }
      }

      color = F.hsv2hex(
        F.randomInt(settings.h0, Math.max(settings.h0, settings.h1)),
        F.randomInt(settings.s0, Math.max(settings.s0, settings.s1)),
        F.randomInt(settings.v0, Math.max(settings.v0, settings.v1)),
      );
    }
    document.body.style.backgroundColor = color;
  } else {
    document.body.style.backgroundColor = "#202038";
  }

  // Add image
  document.body.style.backgroundImage = "";
  if (ls.all.bg.image) {
    document.body.style.backgroundImage = `url(${ls.all.bg.image})`;
  }
};

// Edit background colour, image
bg.edit = function () {
  var type = prompt(language.get("bg_edit"), "1");
  if (type === "0" || type === "") {
    if (confirm(language.get("bg_reset"))) {
      ls.set(all => {
        all.bg = { color: null, image: null };
      });
      bg.init();
    }
    return;
  }
  if (!type) {
    return;
  }

  var value;
  var typeName = [null, "color", "image"][type];
  if (typeName === "color") {
    value = prompt(language.get("bg_color"), ls.all.bg.color || "#202038");
  } else if (typeName === "image") {
    value = prompt(
      language.get("bg_image"),
      ls.all.bg.image || "https://example.com/image.jpeg || C:/path/image.jpeg",
    );
  } else {
    return;
  }

  if (value === "") {
    ls.set(all => {
      all.bg[typeName] = null;
    });
    bg.init();
    return;
  }
  if (!value) {
    return;
  }

  ls.set(all => {
    all.bg[typeName] = value;
  });
  bg.init();
};
