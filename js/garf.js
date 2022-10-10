//* Random garfield comic
class garf {
  // Get comic url from date
  static get(date) {
    return new Promise((resolve, reject) => {
      fetch(
        "https://api.scraperapi.com?api_key=1ddbd21386871fa6c32ca5a91407c32d&url=https://www.gocomics.com/garfield/" +
          date,
        {
          method: "GET",
        },
      )
        .then(res => res.text())
        .then(text => {
          var position = text.indexOf("https://assets.amuniversal.com");
          resolve(text.substring(position, position + 63));
        })
        .catch(err => reject(err));
    });
  }

  // Get random valid date for comic
  static randomDate() {
    var start = new Date("1978-06-19").getTime();
    return formatDate(
      new Date(start + Math.random() * (Date.now() - start)),
      "/",
    );
  }

  // Load comic
  static async init(forceReload) {
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
      // Fetch url - Random date
      const url = await garf.get(garf.randomDate());

      // Store cache
      ls.set(all => {
        all.cache.garf = { url, time: Date.now() };
      });

      $("#garf_img").attr("src", url);
      $("#garf").css("display", "initial");
    }
  }

  // Show/hide comic
  static toggle() {
    ls.set(all => {
      all.garf = !all.garf;
    });
    garf.init();
  }
}
