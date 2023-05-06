//* Language API

// Cannot be named `lang` for js reasons
class language {
    // Translations defined in lang/*.js
    static data = {};

    // Initialize language
    // Can only be called ONCE per page load - reload page to re-initialize lang
    static init() {
        $("#lang_display").text((ls.all.lang || "en").toUpperCase());
        $(".lang-tofill").each((_i, el) => {
            const element = $(el);
            language.change(element);
            element.removeClass("lang-tofill");
        });
    }

    // Fill HTML template with lang values
    static fillTemplate(parent) {
        $(parent + " .lang-canfill").each((i, el) => {
            const element = $(el);
            language.change(element);
            element.removeClass("lang-canfill");
        });
    }

    // Change language values on HTML element
    //TODO Add comments
    static change(element) {
        if (!element) {
            return;
        }
        if (
            element.constructor === String ||
            element.constructor === HTMLElement
        ) {
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
                    JSON.parse(
                        text.slice(1, -1).split(" ").slice(1).join(" ") || "{}",
                    ),
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
                        JSON.parse(
                            attr.slice(1, -1).split(" ").slice(1).join(" ") ||
                                "{}",
                        ),
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
    }

    // Get language value if exists, otherwise undefined
    static getIfExists(code) {
        return language.data[ls.all?.lang || "en"]?.[code];
    }

    // Get language value if exists, otherwise missing language display (code in brackets)
    static get(code, formatWith) {
        var string = language.getIfExists(code);
        return format(
            string || string === "" ? string : `[${code}]`,
            formatWith,
        );
    }

    // Switch / toggle language mode
    static switch() {
        ls.set((all) => {
            all.lang = all.lang !== "eo" ? "eo" : "en";
        });
        location.reload();
    }
}
