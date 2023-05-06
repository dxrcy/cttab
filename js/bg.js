//* Background

class bg {
    // Default background color
    static default = "#202038";
    // Current background color (if defined)
    static current = undefined;

    // Initialize background
    static async init(forceReload) {
        if (!ls.all.bg) {
            ls.set((all) => {
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
                    : randomChoice(colors);
            // Select default color with dollar
            if (color === "$") {
                color = bg.default;
            }

            // Parse random color
            if (isRandom) {
                var settings = {
                        h0: 0,
                        h1: 360,
                        s0: 0,
                        s1: 100,
                        v0: 0,
                        v1: 100,
                    },
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
                var weight = isAbsoluteWeight
                    ? weight
                    : weight / (colors.length + 1);
                if (!colors || colors.length === 0 || Math.random() < weight) {
                    color = hsv2hex({
                        h: randomInt(
                            settings.h0,
                            Math.max(settings.h0, settings.h1),
                        ),
                        s: randomInt(
                            settings.s0,
                            Math.max(settings.s0, settings.s1),
                        ),
                        v: randomInt(
                            settings.v0,
                            Math.max(settings.v0, settings.v1),
                        ),
                    });
                }
            }
        }

        bg.current = color || bg.default;
        $("body").css("background-color", bg.current);

        // Add image
        if (ls.all.bg.image) {
            // Random choice
            var image = randomChoice(ls.all.bg.image.split(" "));

            // Nasa image
            if (image === "$") {
                // Reset cache
                if (!ls.all.cache.nasa) {
                    ls.set((all) => {
                        all.cache.nasa = { time: 0, url: null, info: null };
                    });
                }

                // Load cached
                if (ls.all.cache.nasa.url && !forceReload) {
                    $("body").css(
                        "background-image",
                        `url(${ls.all.cache.nasa.url})`,
                    );
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
                            `https://api.nasa.gov/planetary/apod?date=${bg.getYesterday()}&api_key=quLlK0afxZFg8YQX7FlfafLlgd5L46oAFyJA7EGh`,
                        )
                    ).json();

                    // Store cache
                    ls.set((all) => {
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
    }

    // Get yesterday's date as YYYY-MM-DD - For NASA image
    static getYesterday() {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        return formatDate(date);
    }

    // Show info for nasa background
    static showInfo() {
        alert(
            ls.all.cache?.nasa?.info
                ? language.get("bg_info_alert", {
                      info: ls.all.cache.nasa.info,
                  })
                : language.get("bg_info_none"),
        );
    }

    // Edit background color, image
    static edit() {
        var type = prompt(language.get("bg_edit"), "1");
        if (type === "0" || type === "") {
            if (confirm(language.get("bg_reset"))) {
                ls.set((all) => {
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
            value = prompt(
                language.get("bg_color"),
                ls.all.bg.color || bg.default,
            );
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
            ls.set((all) => {
                all.bg[typeName] = null;
            });
            bg.init();
            return;
        }
        if (!value) {
            return;
        }

        ls.set((all) => {
            all.bg[typeName] = value;
        });
        bg.init();
    }
}
