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
      data = await new Promise(resolve => {
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
    download(JSON.stringify(ls.all), "cttab.json", "text/json");
  }
}
