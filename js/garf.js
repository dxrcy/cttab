//* Random garfield comic

class garf {
    // Get comic url from date
    static getImageUrl(date, mode) {
        // Add date to recent dates
        ls.set(all => {
            const MAX_RECENT_DATES = 10;
            all.cache.garf.recent.unshift(formatDate(date));
            all.cache.garf.recent = all.cache.garf.recent.slice(0, MAX_RECENT_DATES);
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
    static recent() {
        let recent = ls.all.cache.garf?.recent || [];
        if (recent.length > 0) {
            let list = recent.join("\n");
            console.log(recent.length +  " most recent Garfield comics:\n" + list);
        } else {
            console.log("No recent Garfield comics in cache");
        }
    }

    // Get random valid date for comic
    static randomDate() {
        const start = new Date("1978-06-19").getTime();
        return new Date(start + Math.random() * (Date.now() - start));
    }

    // Get random valid date for comic, which is a Sunday
    static randomDateSunday() {
        const date = garf.randomDate();
        return new Date(date.setDate(date.getDate() - date.getDay()));
    }

    // Change whether only Sunday comics are shown
    static setOnlySunday(onlySunday) {
        ls.set((all) => {
            all.garf.onlySunday = onlySunday || false;
        });
        garf.init();
    }

    // Load comic
    static async init(forceReload) {
        // If disabled
        if (ls.all.garf === null) {
            garf.hideComic();
            return;
        }

        // Reset cache
        if (!ls.all.cache.garf) {
            ls.set((all) => {
                all.cache.garf = { time: 0, url: null, recent: [] };
            });
        }

        // Load cached
        let cache = ls.all.cache.garf;
        if (cache?.date && cache?.url && !forceReload) {
            garf.setComic(new Date(cache.date), cache.url);
        } else {
            garf.hideComic();
        }

        // If 1 hour since last refresh
        if (
            !ls.all.cache.garf.url ||
            ls.all.garf.url !== "$" ||
            Date.now() - ls.all.cache.garf.time > 36e5 ||
            forceReload
        ) {
            // Fetch url - Random date
            try {
                // Get random date
                const onlySunday = ls.all.garf.onlySunday || false;
                const date = onlySunday ? garf.randomDateSunday() : garf.randomDate();
                // Get url
                const url = await garf.getImageUrl(date, ls.all.garf.url);

                // Store cache
                ls.set((all) => {
                    all.cache.garf.date = date;
                    all.cache.garf.url = url;
                    all.cache.garf.time = Date.now();
                });

                garf.setComic(date, url);
            } catch (err) {
                console.error("Garfield comic failed (Fetching image url)\nReason:", err);
            }
        }
    }

    // Set src url of comic, and make visible
    static setComic(date, url) {
        $("#garf_img").attr("src", url);
        $("#garf_img").attr("title", formatDate(date));
        $("#garf").css("display", "initial");
    }
    // Hide comic
    static hideComic() {
        $("#garf").css("display", "none");
    }

    // Copy date to clipboard
    static copyDate() {
        let date = ls.all.cache.garf?.date;
        if (!date) {
            throw "No date cached :(";
        }
        date = new Date(date);
        date = formatDate(date);
        console.log(date);
        copy(date);
    }

    // Show/hide comic
    static edit() {
        var url = prompt(language.get("garf_edit"), ls.all.garf.url ?? "");

        // Skip
        if (url === null) {
            return;
        }

        if (url.length < 1) {
            // Reset to default
            url = null;
        } else if (url !== "$" && !/(file|https?):/.test(url)) {
            // Local filepath
            url = "file:///" + url;
        }

        ls.set((all) => {
            // Reset cache if changed
            if (all.garf.url !== url) {
                all.cache.garf = undefined;
            }

            // Change url
            all.garf.url = url;
        });
        garf.init();
    }
}
