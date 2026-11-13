/* =========================================================
   WHERE I'VE BEEN — interactive travel map
   ---------------------------------------------------------
   EDIT HERE:
   - Add photos to assets/travel/ using the filenames below
     (any that are missing show a "Photo" placeholder).
   - lat/lon decide where each pin sits. Move a pin to the
     exact city you visited by changing them.
   - caption is optional, one short line under the photos.
   ========================================================= */
const PLACES = [
  {
    id: "australia", name: "Sydney, Australia",
    trip: "Southeast Asia & Australia", when: "Summer 2026",
    lat: -33.87, lon: 151.21, // Sydney
    photos: ["assets/travel/australia-1.jpg", "assets/travel/australia-2.jpg", "assets/travel/australia-3.jpg"],
    caption: "",
  },
  {
    id: "malaysia", name: "Kuala Lumpur, Malaysia",
    trip: "Southeast Asia & Australia", when: "Summer 2026",
    lat: 3.14, lon: 101.69,  // Kuala Lumpur
    photos: ["assets/travel/malaysia-1.jpg", "assets/travel/malaysia-2.jpg", "assets/travel/malaysia-3.jpg"],
    caption: "",
  },
  {
    id: "thailand", name: "Thailand",
    trip: "Southeast Asia & Australia", when: "Summer 2026",
    lat: 13.75, lon: 100.5,  // Bangkok (one pin for the whole country keeps SE Asia readable)
    photos: ["assets/travel/thailand-1.jpg", "assets/travel/thailand-2.jpg", "assets/travel/thailand-3.jpg"],
    caption: "",
  },
  {
    id: "vietnam", name: "Vietnam",
    trip: "Southeast Asia & Australia", when: "Summer 2026",
    lat: 20.0, lon: 105.8,  // all over Vietnam; pin sits north so it doesn't overlap Thailand
    photos: ["assets/travel/vietnam-1.jpg", "assets/travel/vietnam-2.jpg", "assets/travel/vietnam-3.jpg"],
    caption: "",
  },
  {
    id: "italy", name: "Florence & Tuscany",
    trip: "Italy", when: "Summer 2024",
    lat: 43.77, lon: 11.25,
    photos: ["assets/travel/italy-1.jpg", "assets/travel/italy-2.jpg", "assets/travel/italy-3.jpg"],
    caption: "",
  },
  {
    id: "dominican", name: "Dominican Republic",
    trip: "Dominican Republic", when: "Summer 2022",
    lat: 18.74, lon: -70.16,
    photos: ["assets/travel/dominican-1.jpg", "assets/travel/dominican-2.jpg", "assets/travel/dominican-3.jpg"],
    caption: "",
  },
  {
    id: "tetons", name: "Grand Tetons",
    trip: "Grand Teton National Park", when: "Summer2018",
    lat: 43.74, lon: -110.80,
    photos: ["assets/travel/tetons-1.jpg", "assets/travel/tetons-2.jpg", "assets/travel/tetons-3.jpg"],
    caption: "",
  },
];

/* Dashed flight paths drawn between stops, in order. */
const ROUTES = [["australia", "malaysia", "thailand", "vietnam"]];

const LAND_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json";

/* ========================================================= */

(function () {
  const W = 960;
  const stage = document.querySelector(".travel-stage");
  if (!stage) return;
  const mapEl = stage.querySelector(".travel-map");
  const svg = mapEl.querySelector("svg");
  const pop = document.getElementById("travel-pop");
  const tripsEl = stage.querySelector(".trips");
  const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));
  const triggers = []; // {el, id}
  let pinnedId = null;

  /* ---------- Popover ---------- */
  function fillPopover(place) {
    pop.replaceChildren();
    const head = document.createElement("div");
    head.className = "pop-head";
    const title = document.createElement("strong");
    title.textContent = place.name;
    const meta = document.createElement("span");
    meta.textContent = `${place.trip} · ${place.when}`;
    head.append(title, meta);

    const strip = document.createElement("div");
    strip.className = "pop-strip";
    place.photos.slice(0, 3).forEach((src, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      const img = new Image();
      img.alt = `${place.name}, photo ${i + 1}`;
      img.decoding = "async";
      img.onerror = () => { fig.classList.add("empty"); img.remove(); };
      img.src = src;
      fig.append(img);
      strip.append(fig);
    });
    pop.append(head, strip);

    if (place.caption) {
      const cap = document.createElement("p");
      cap.className = "pop-cap";
      cap.textContent = place.caption;
      pop.append(cap);
    }
  }

  function placePopover(anchor) {
    const host = stage.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    let x = a.left - host.left + a.width / 2 - pw / 2;
    x = Math.max(8, Math.min(x, host.width - pw - 8));
    let y = a.top - host.top - ph - 12;            // above the pin
    if (a.top - ph - 12 < 64) y = a.bottom - host.top + 12; // flip below if it would hit the nav
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
  }

  function show(id, anchor) {
    fillPopover(byId[id]);
    pop.hidden = false;
    placePopover(anchor);
    triggers.forEach((t) => t.el.classList.toggle("active", t.id === id));
  }

  function hide() {
    pop.hidden = true;
    triggers.forEach((t) => t.el.classList.remove("active"));
  }

  function wire(el, id) {
    triggers.push({ el, id });
    el.addEventListener("mouseenter", () => { if (!pinnedId) show(id, el); });
    el.addEventListener("mouseleave", () => { if (!pinnedId) hide(); });
    el.addEventListener("focus", () => { if (!pinnedId) show(id, el); });
    el.addEventListener("blur", () => { if (!pinnedId) hide(); });
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (pinnedId === id) { pinnedId = null; hide(); }
      else { pinnedId = id; show(id, el); }
    });
  }

  document.addEventListener("click", () => { if (pinnedId) { pinnedId = null; hide(); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinnedId = null; hide(); } });
  window.addEventListener("resize", () => {
    const active = triggers.find((t) => t.el.classList.contains("active"));
    if (active && !pop.hidden) placePopover(active.el);
  });

  /* ---------- Trip list ---------- */
  const trips = [];
  PLACES.forEach((p) => {
    let t = trips.find((x) => x.trip === p.trip);
    if (!t) trips.push((t = { trip: p.trip, when: p.when, places: [] }));
    t.places.push(p);
  });
  trips.forEach((t) => {
    const box = document.createElement("div");
    box.className = "trip";
    const when = document.createElement("span");
    when.className = "when";
    when.textContent = t.when;
    const name = document.createElement("strong");
    name.textContent = t.trip;
    const chips = document.createElement("div");
    chips.className = "chips";
    t.places.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p.name;
      wire(b, p.id);
      chips.append(b);
    });
    box.append(when, name, chips);
    tripsEl.append(box);
  });

  /* ---------- Map ---------- */
  async function drawMap() {
    if (!window.d3 || !d3.geoNaturalEarth1 || !window.topojson) throw new Error("map libraries missing");

    const projection = d3.geoNaturalEarth1().fitWidth(W, { type: "Sphere" });
    const top = projection([0, 83])[1];
    const bottom = projection([0, -56])[1]; // crop Antarctica
    const H = Math.round(bottom - top);
    const [tx, ty] = projection.translate();
    projection.translate([tx, ty - top]);

    const topo = await fetch(LAND_URL).then((r) => {
      if (!r.ok) throw new Error("land data " + r.status);
      return r.json();
    });
    const land = topojson.feature(topo, topo.objects.land);

    // Rasterize land, then sample a dot grid from it.
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    d3.geoPath(projection, ctx)(land);
    ctx.fill();
    const px = ctx.getImageData(0, 0, W, H).data;

    const step = 8, r = 1.8;
    let dots = "";
    for (let row = 0, y = step / 2; y < H; y += step, row++) {
      for (let x = (row % 2 ? step : step / 2); x < W; x += step) {
        if (px[((y | 0) * W + (x | 0)) * 4 + 3] > 128) dots += `<circle cx="${x}" cy="${y}" r="${r}"/>`;
      }
    }

    // Curved, dashed flight paths between stops.
    let routes = "";
    ROUTES.forEach((ids) => {
      const pts = ids.map((id) => projection([byId[id].lon, byId[id].lat]));
      let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        const len = Math.hypot(x1 - x0, y1 - y0);
        const cx = mx + ((y1 - y0) / len) * len * 0.25;
        const cy = my - ((x1 - x0) / len) * len * 0.25;
        d += ` Q${cx.toFixed(1)},${cy.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
      }
      routes += `<path class="route-line" d="${d}"/>`;
    });

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = `<g class="dots">${dots}</g>${routes}`;
    mapEl.style.aspectRatio = `${W} / ${H}`;

    PLACES.forEach((p) => {
      const [x, y] = projection([p.lon, p.lat]);
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "pin";
      pin.style.left = `${(x / W) * 100}%`;
      pin.style.top = `${(y / H) * 100}%`;
      pin.setAttribute("aria-label", `${p.name}, ${p.when}: show photos`);
      wire(pin, p.id);
      mapEl.append(pin);
    });
  }

  /* Warm the cache once the page is idle, so pop-ups open instantly. */
  const preload = () => PLACES.forEach((p) => p.photos.forEach((src) => { new Image().src = src; }));
  if ("requestIdleCallback" in window) requestIdleCallback(preload, { timeout: 3000 });
  else setTimeout(preload, 1500);

  drawMap().catch(() => {
    const msg = document.createElement("div");
    msg.className = "map-fallback";
    msg.textContent = "The map couldn't load. Tap a place below to see photos.";
    mapEl.append(msg);
  });
})();
