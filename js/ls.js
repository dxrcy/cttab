//* Local Storage API

class ls {
    // Check if localStorage exists and is valid, otherwise reset
    static check() {
        if (localStorage.cttab) {
            try {
                JSON.parse(localStorage.cttab);
            } catch (err) {
                ls.reset();
            }
        } else {
            ls.reset();
        }
    }

    // Reset localStorage
    static reset() {
        localStorage.cttab = JSON.stringify({
            lang: "en",
            header: null,
            garf: { url: null, onlySunday: false },
            bg: { color: null, image: null },
            sc: { amount: sc.default, array: {} },
            notes: [""],
            cache: {},
            // search: null, //? What is this ?
        });

        init();
    }

    // Reset localStorage CACHE only
    static resetCache() {
        ls.set(all => {
            all.cache = {};
        });
    }

    // Reset with confirmation box
    static resetConfirm() {
        if (!confirm(language.get("ls_reset"))) {
            return;
        }
        ls.reset();
        location.reload();
    }

    // Get all localStorage as JSON
    static get all() {
        ls.check();
        return JSON.parse(localStorage.cttab);
    }

    // Set localStorage with callback
    static set(callback) {
        var all = ls.all;
        const value = callback(all);
        if (value) {
            localStorage.cttab = value;
            return;
        }
        localStorage.cttab = JSON.stringify(all);
    }

    // Import localStorage from file
    static oFReader = new FileReader();
    static async import(data) {
        if (!data) {
            // Read file
            data = await new Promise((resolve) => {
                this.oFReader.readAsText($("#ls-file")[0].files[0]);
                this.oFReader.onload = function (oFREvent) {
                    resolve(oFREvent.target.result);
                };
            });
        }
        ls.set(() => data);
        init();
    }

    // Export localStorage to file
    static export() {
        download(JSON.stringify(ls.all, null, 2), "cttab.json", "text/json");
    }
}
