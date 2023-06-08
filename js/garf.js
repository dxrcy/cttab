//* Random garfield comic

class garf {
    // Get comic url from date
    static getImageUrl(date, mode) {
        // Add date to recent dates
        ls.set(all => {
            all.cache.garf.recent.unshift(formatDate(date));
            all.cache.garf.recent = all.cache.garf.recent.slice(0, 5);
        });

        if (mode === "$") {
            return new Promise((resolve, reject) => {
                fetch(
                    // "https://api.scraperapi.com?api_key=1ddbd21386871fa6c32ca5a91407c32d&url=https://www.gocomics.com/garfield/" +
                    "https://corsproxy.garfieldapp.workers.dev/cors-proxy?https://www.gocomics.com/garfield/" + 
                        formatDate(date, "/"),
                    {
                        method: "GET",
                    },
                )
                    .then((res) => {
                        // Handle HTTP error
                        switch (res.status) {
                            case 200:
                                return res.text();
                                break;
                            case 401:
                                throw "API key invalid";
                                break;
                            default:
                                throw "Unknown error"
                        }
                    })
                    .then((text) => {
                        var position = text.indexOf(
                            "https://assets.amuniversal.com",
                        );
                        resolve(text.substring(position, position + 63));
                    })
                    .catch((err) => reject(err));
            });
        } else {
            return format(mode, {
                YYYY: date.getFullYear(),
                MM: padTwoDigits(date.getMonth() + 1),
                DD: padTwoDigits(date.getDate()),
            });
        }
    }

    // Print recent garfield comic dates cached
    static showRecent() {
        let recent = ls.all.cache.garf?.recent || [];
        if (recent.length > 0) {
            let list = recent.map((date) => "\n  " + date).join("");
            console.log(recent.length +  " most recent Garfield comics:" + list);
        } else {
            console.log("No recent Garfield comics in cache");
        }
    }

    // Get random valid date for comic
    static randomDate() {
        var start = new Date("1978-06-19").getTime();
        return new Date(start + Math.random() * (Date.now() - start));
    }

    // Load comic
    static async init(forceReload) {
        // If disabled
        if (ls.all.garf === null) {
            $("#garf").css("display", "none");
            return;
        }

        // Reset cache
        if (!ls.all.cache.garf) {
            ls.set((all) => {
                all.cache.garf = { time: 0, url: null, recent: [] };
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
            ls.all.garf !== "$" ||
            Date.now() - ls.all.cache.garf.time > 36e5 ||
            forceReload
        ) {
            // Fetch url - Random date
            try {
                const url = await garf.getImageUrl(garf.randomDate(), ls.all.garf);

                // Store cache
                ls.set((all) => {
                    all.cache.garf.url = url;
                    all.cache.garf.time = Date.now();
                });

                $("#garf_img").attr("src", url);
                $("#garf").css("display", "initial");
            } catch (err) {
                console.error("Garfield comic failed (Fetching image url)\nReason:", err);
            }
        }
    }

    // Show/hide comic
    static edit() {
        var mode = prompt(language.get("garf_edit"), ls.all.garf);

        if (mode === null) {
            return;
        }

        if (mode.length < 1) {
            mode = null;
        } else if (mode !== "$" && !/(file|https?):/.test(mode)) {
            mode = "file:///" + mode;
        }

        ls.set((all) => {
            if (all.garf !== mode) {
                all.cache.garf = undefined;
            }

            all.garf = mode;
        });
        garf.init();
    }
}
