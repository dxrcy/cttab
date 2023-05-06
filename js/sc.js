//* Shortcuts

class sc {
    // Default number of shortcuts shown
    static default = 24;

    // Initialize shortcuts
    //TODO Add comments
    static init() {
        if (
            ls.all.sc.amount !== 0 &&
            (!ls.all.sc.amount || isNaN(ls.all.sc.amount))
        ) {
            ls.set((all) => {
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
                    iconHref = sc.getIcon(item[1]);
                    iconType = "faviconkit";
                }
            }

            html += getTemplate("shortcut", {
                name:
                    item[0] != undefined
                        ? item[0]
                        : `[sc_name_default {"number": ${i + 1} }]`,
                title:
                    item[0] != undefined
                        ? item[0]
                        : language.get("sc_title_default"),
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
    }

    // Get url for API
    static getIcon(href, useGstatic) {
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
    static imageError(number) {
        $(`.shortcut[number="${number}"] img`).each((i, element) => {
            // Try gstatic api instead
            if ($(element).is(".faviconkit")) {
                $(element).removeClass("faviconkit");
                $(element).addClass("gstatic");
                $(element).attr(
                    "src",
                    sc.getIcon(
                        $(`.shortcut[number="${number}"] a`).attr("href"),
                        true,
                    ),
                );
                return;
            }

            $(`.shortcut[number="${number}"] img`).attr(
                "src",
                "./image/error.png",
            );
        });
    }

    // Edit shortcut link and text
    //TODO Add comments
    static edit(number) {
        var href = prompt(
            format(language.get("sc_edit_url"), { number: number + 1 }),
            ls.all.sc.array?.[number]?.[1] || "https://bruh.news",
        );
        if (href === "") {
            ls.set((all) => {
                all.sc.array[number] = [];
            });
            sc.init();
        }
        if (!href) {
            return;
        }

        var title = prompt(
            format(language.get("sc_edit_name"), { number: number + 1 }),
            ls.all.sc.array?.[number]?.[0] != undefined
                ? ls.all.sc.array?.[number]?.[0]
                : format(language.get("sc_name_default"), {
                      number: number + 1,
                  }),
        );
        if (title === null) {
            return;
        }

        ls.set((all) => {
            all.sc.array[number] = [title, formatURL(href)];
        });
        sc.init();
    }

    // Edit amount of shortcuts shown
    static editAmount() {
        var amount = prompt(
            language.get("sc_amount_text", { default: sc.default }),
            ls.all.sc.amount || ls.all.sc.amount === 0
                ? ls.all.sc.amount
                : sc.default,
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

        ls.set((all) => {
            all.sc.amount = amount;
        });
        sc.init();
    }
}
