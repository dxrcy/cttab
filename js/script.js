// DOCUMENTATION - https://github.com/darccyy/cttab#cttab
// Reload
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
    sc: { amount: sc.default, array: {} },
    search: null,
    notes: [""],
    lang: "en",
    bg: { color: null, image: null },
    garf: false,
    cache: {},
  });

  init();
};

ls.resetConfirm = function () {
  if (!confirm(language.get("ls_reset"))) {
    return;
  }
  ls.reset();
  location.reload();
};

ls.__defineGetter__("all", () => {
  ls.check();
  return JSON.parse(localStorage.cttab);
});

ls.set = function (callback) {
  all = ls.all;
  const value = callback(all);
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

// Lang (Defined in lang.js)
language.init = function () {
  $("#lang_display").text((ls.all.lang || "en").toUpperCase());
  $(".lang-tofill").each((i, el) => {
    const element = $(el);
    language.change(element);
    element.removeClass("lang-tofill");
  });
};

language.fillTemplate = function (parent) {
  $(parent + " .lang-canfill").each((i, el) => {
    const element = $(el);
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

  var hasError = false,
    text = element.text().replace(/^[ \n]*|[ \n]*$/gm, ""); // Remove start, end spaces, new lines
  if (
    !element.hasClass("lang-ignore-text") &&
    text?.startsWith("[") &&
    text.endsWith("]")
  ) {
    var code = text.slice(1, -1).split(" ")[0] || "null";

    element.text(
      language.get(
        code,
        JSON.parse(text.slice(1, -1).split(" ").slice(1).join(" ") || "{}"),
      ),
    );

    if (!language.getIfExists(code)) {
      hasError = true;
      element.addClass("lang-unknown-text");
    }
  }

  var attributes = ["title", "placeholder"];
  for (var i in attributes) {
    var attr = element.attr(attributes[i]);
    if (attr && attr.startsWith("[") && attr.endsWith("]")) {
      var code = attr.slice(1, -1).split(" ")[0] || "null";

      element.attr(
        attributes[i],
        language.get(
          code,
          JSON.parse(attr.slice(1, -1).split(" ").slice(1).join(" ") || "{}"),
        ),
      );

      if (!language.getIfExists(code)) {
        hasError = true;
        element.addClass("lang-unknown-" + attr);
      }
    }
  }

  if (hasError) {
    element.addClass("lang-error");
  }

  element.addClass("lang-filled");
};

language.getIfExists = function (code) {
  return language.data[ls.all?.lang || "en"]?.[code];
};

language.get = function (code, format) {
  var string = language.getIfExists(code);
  return F.format(string || string === "" ? string : `[${code}]`, format);
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
  if (["bolsa", "bolso"].includes(text.toLowerCase())) {
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
const sc = { default: 24 };
sc.init = function () {
  if (
    ls.all.sc.amount !== 0 &&
    (!ls.all.sc.amount || isNaN(ls.all.sc.amount))
  ) {
    ls.set(all => {
      all.sc.amount = sc.default;
    });
  }

  var html = "";
  for (var i = 0; i < ls.all.sc.amount; i++) {
    var item = ls.all.sc.array[i] || {};

    var iconType = "none",
      iconHref = "";
    if (item[1]) {
      if (item[1].match(/(^file:\/*)|(^(https?:\/*)?localhost)/)) {
        iconHref = "./image/file.png";
        iconType = "file";
      } else {
        iconHref = getIcon(item[1]);
        iconType = "faviconkit";
      }
    }

    html += getTemplate("shortcut", {
      name:
        item[0] != undefined
          ? item[0]
          : `[sc_name_default {"number": ${i + 1} }]`,
      title: item[0] != undefined ? item[0] : language.get("sc_title_default"),
      href: item[1] || "",
      iconHref,
      className: (item[0] || item[1] ? " " : "hide ") + iconType,
      number: i,
      empty: item[0] != undefined && item[1] ? "" : "empty",
      src: "src", // Prevent preloading image in template
    });
  }
  $("#shortcuts").html(html);
  language.fillTemplate("#shortcuts");
};

// Get url for api
function getIcon(href, useGstatic) {
  if (useGstatic) {
    return (
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=" +
      (href || "")
    );
  }
  if (!href) {
    return "";
  }
  return "https://api.faviconkit.com/" + href.replace(/^https?:\/*/, "");
}

// Fallback icon
sc.imageError = function (number) {
  $(`.shortcut[number="${number}"] img`).each((i, element) => {
    // Try gstatic api instead
    if ($(element).is(".faviconkit")) {
      $(element).removeClass("faviconkit");
      $(element).addClass("gstatic");
      $(element).attr(
        "src",
        getIcon($(`.shortcut[number="${number}"] a`).attr("href"), true),
      );
      return;
    }

    $(`.shortcut[number="${number}"] img`).attr("src", "./image/error.png");
  });
};

sc.edit = function (number) {
  var href = prompt(
    F.format(language.get("sc_edit_url"), { number: number + 1 }),
    ls.all.sc.array?.[number]?.[1] || "https://epicwebsite.bruh.international",
  );
  if (href === "") {
    ls.set(all => {
      all.sc.array[number] = [];
    });
    sc.init();
  }
  if (!href) {
    return;
  }

  var title = prompt(
    F.format(language.get("sc_edit_name"), { number: number + 1 }),
    ls.all.sc.array?.[number]?.[0] != undefined
      ? ls.all.sc.array?.[number]?.[0]
      : F.format(language.get("sc_name_default"), { number: number + 1 }),
  );
  if (title === null) {
    return;
  }

  ls.set(all => {
    all.sc.array[number] = [title, formatURL(href)];
  });
  sc.init();
};

sc.editAmount = function () {
  var amount = prompt(
    language.get("sc_amount_text", { default: sc.default }),
    ls.all.sc.amount || ls.all.sc.amount === 0 ? ls.all.sc.amount : sc.default,
  );
  if (amount === null) {
    return;
  }

  if (!amount) {
    amount = sc.default;
  } else {
    amount = parseInt(amount);
    if (isNaN(amount) || amount < 0 || amount > 60) {
      alert(language.get("sc_amount_invalid"));
      return;
    }
  }

  ls.set(all => {
    all.sc.amount = amount;
  });
  sc.init();
};

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

// Notes
const notes = {};
notes.init = function () {
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
};

notes.edit = function (number) {
  ls.set(all => {
    all.notes[number] = $(`.note[number=${number}] textarea`).val();
  });
};

notes.delete = function (number) {
  if (ls.all.notes[number] && !confirm(language.get("note_delete_confirm"))) {
    return;
  }
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
  $(".note:first-of-type textarea").focus();
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

  console.log(language.get("support"));
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
const bg = { default: "#202038" };

bg.init = async function (forceReload) {
  if (!ls.all.bg) {
    ls.set(all => {
      all.bg = { color: null, image: null };
    });
  }

  // Hide info button
  $("#bgInfoButton").css("display", "none");

  var string = ls.all.bg.color;

  if (string) {
    // Parse color string
    var bracket = false,
      current = "",
      colors = [],
      isRandom = false,
      random = [];
    for (var i in string) {
      var char = string[i];
      if (!bracket && char === " ") {
        if (current) {
          isRandom ? random.push(current) : colors.push(current);
          current = "";
        }
        continue;
      }
      if (char === "?") {
        isRandom = true;
        continue;
      }

      if (char === "(") {
        bracket = true;
      } else if (char === ")") {
        bracket = false;
      }

      current += char;
    }
    if (current) {
      isRandom ? random.push(current) : colors.push(current);
      current = "";
    }

    // Select random color from array
    var color =
      !colors || colors.length === 0
        ? null
        : colors.length === 1
        ? colors[0]
        : F.randomChoice(colors);
    // Select default color with dollar
    if (color === "$") {
      color = bg.default;
    }

    // Parse random color
    if (isRandom) {
      var settings = { h0: 0, h1: 360, s0: 0, s1: 100, v0: 0, v1: 100 },
        weight = 1,
        isAbsoluteWeight = false;
      for (var i in random) {
        var param = random[i];
        if (param[0].toLocaleLowerCase() === "w") {
          weight = parseFloat(param.slice(1));
          isAbsoluteWeight = param[0] === "W";
        } else if ("hsv".includes(param[0])) {
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

      // Create random color if weight is selected
      var weight = isAbsoluteWeight ? weight : weight / (colors.length + 1);
      if (!colors || colors.length === 0 || Math.random() < weight) {
        color = F.hsv2hex(
          F.randomInt(settings.h0, Math.max(settings.h0, settings.h1)),
          F.randomInt(settings.s0, Math.max(settings.s0, settings.s1)),
          F.randomInt(settings.v0, Math.max(settings.v0, settings.v1)),
        );
      }
    }
  }

  bg.current = color || bg.default;
  $("body").css("background-color", bg.current);

  // Add image
  if (ls.all.bg.image) {
    // Random choice
    var image = F.randomChoice(ls.all.bg.image.split(" "));

    // Nasa image
    if (image === "nasa") {
      // Reset cache
      if (!ls.all.cache.nasa) {
        ls.set(all => {
          all.cache.nasa = { time: 0, url: null, info: null };
        });
      }

      // Load cached
      if (ls.all.cache.nasa.url && !forceReload) {
        $("body").css("background-image", `url(${ls.all.cache.nasa.url})`);
        $("body").addClass("image-fetch");
        $("#bgInfoButton").css("display", "initial"); // Show info button
      }

      // If 1 hour since last refresh
      if (
        !ls.all.cache.nasa.url ||
        Date.now() - ls.all.cache.nasa.time > 36e5 ||
        forceReload
      ) {
        // Fetch url
        const { url, explanation: info } = await (
          await fetch(
            `https://api.nasa.gov/planetary/apod?date=${getYesterday()}&api_key=quLlK0afxZFg8YQX7FlfafLlgd5L46oAFyJA7EGh`,
          )
        ).json();

        // Store cache
        ls.set(all => {
          all.cache.nasa = { url, info, time: Date.now() };
        });

        $("body").css("background-image", `url(${url})`);
        $("body").addClass("image-fetch");
        $("#bgInfoButton").css("display", "initial"); // Show info button
      }
      return;
    }

    $("body").css("background-image", `url(${formatURL(image)})`);
    return;
  }
  $("body").css("background-image", "");
};

// Show info for nasa background
bg.showInfo = function () {
  alert(
    ls.all.cache?.nasa?.info
      ? language.get("bg_info_alert", { info: ls.all.cache.nasa.info })
      : language.get("bg_info_none"),
  );
};

// Edit background color, image
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

  if (type === "3") {
    prompt(language.get("bg_copy"), bg.current);
    return;
  }

  var value,
    typeName = [null, "color", "image"][type];
  if (typeName === "color") {
    value = prompt(language.get("bg_color"), ls.all.bg.color || bg.default);
  } else if (typeName === "image") {
    value = prompt(
      language.get("bg_image"),
      ls.all.bg.image ||
        "https://example.com/image.jpeg C:/path/image.jpeg nasa",
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

// Get yesterday's date as YYYY-MM-DD
function getYesterday(char = "-") {
  var date = new Date();
  date.setDate(date.getDate() - 1);

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

// Get garfield comic
const garf = {};
garf.init = async function (forceReload) {
  // If disabled
  if (!ls.all.garf) {
    $("#garf").css("display", "none");
    return;
  }

  // Reset cache
  if (!ls.all.cache.garf) {
    ls.set(all => {
      all.cache.garf = { time: 0, url: null };
    });
  }

  // Load cached
  if (ls.all.cache.garf.url && !forceReload) {
    $("#garf_img").attr("src", ls.all.cache.garf.url);
    $("#garf").css("display", "initial");
  } else {
    $("#garf").css("display", "none");
  }

  // If 1 hour since last refresh
  if (
    !ls.all.cache.garf.url ||
    Date.now() - ls.all.cache.garf.time > 36e5 ||
    forceReload
  ) {
    // Fetch url
    const text = await (
        await fetch(
          "https://api.scraperapi.com?api_key=1ddbd21386871fa6c32ca5a91407c32d&url=https://www.gocomics.com/garfield/" +
            getYesterday("/"),
          {
            method: "GET",
          },
        )
      ).text(),
      position = text.indexOf("https://assets.amuniversal.com"),
      url = text.substring(position, position + 63);

    // Store cache
    ls.set(all => {
      all.cache.garf = { url, time: Date.now() };
    });

    $("#garf_img").attr("src", url);
    $("#garf").css("display", "initial");
  }
};

// Show/hide garf
garf.toggle = function () {
  ls.set(all => {
    all.garf = !all.garf;
  });
  garf.init();
};
