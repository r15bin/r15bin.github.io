// LINKS ANIMATION
const links = document.querySelectorAll("a");

links.forEach(link => {
  let fullyIn = false;
  let isHovered = false;

  link.addEventListener("mouseenter", () => {
    if (isHovered) return;
    isHovered = true;

    link.classList.remove("exit");
    link.classList.add("animate");
    fullyIn = false;
  });

  link.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (isHovered && link.classList.contains("animate")) {
      fullyIn = true;
    }

    if (link.classList.contains("exit") && !isHovered) {
      link.classList.remove("exit");
      fullyIn = false;
    }
  });

  link.addEventListener("mouseleave", () => {
    isHovered = false;

    if (!fullyIn) {
      link.classList.remove("animate");
      return;
    }

    link.classList.remove("animate");
    link.classList.add("exit");
    fullyIn = false;
  });
});

// EMAIL LINK
const user = "robin";
const domain = "r15b.in";

const emailLink = document.getElementById("emailLink");
if (emailLink) emailLink.href = `mailto:${user}@${domain}`;

// MOUSE TRAIL

  const svg = document.querySelector('#trail')
  const path = svg.querySelector('path')
  
  let points = []
  let segments = 30 // trail length
  let mouse = {
    x: 0,
    y: 0,
  }
  
  const move = (event) => {
    const x = event.clientX
    const y = event.clientY
  
    mouse.x = x
    mouse.y = y
  
    if (points.length === 0) {
      for (let i = 0; i < segments; i++) {
        points.push({
          x: x,
          y: y,
        })
      }
    }
  }
  
  const anim = () => {

    let px = mouse.x
    let py = mouse.y
  
    points.forEach((p, index) => {
      p.x = px
      p.y = py
  
      let n = points[index + 1]
  
      if (n) {
        px = px - (p.x - n.x) * 0.6
        py = py - (p.y - n.y) * 0.6
      }
    })
  
    path.setAttribute('d', `M ${points.map((p) => `${p.x} ${p.y}`).join(` L `)}`)
  
    requestAnimationFrame(anim)
  }
  
  const resize = () => {
    const ww = window.innerWidth
    const wh = window.innerHeight
  
    svg.style.width = ww + 'px'
    svg.style.height = wh + 'px'
    svg.setAttribute('viewBox', `0 0 ${ww} ${wh}`)
  }
  
  document.addEventListener('mousemove', move)
  window.addEventListener('resize', resize)
  
  anim()
  resize()

// HORIZONTAL SCROLLBAR

const thumb = document.getElementById("scrollbarProgress");
function update() {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const pct = (scrollY / max) * 100;
  thumb.style.width = pct + "%";
}
addEventListener("scroll", update, { passive: true });
addEventListener("resize", update);
update();

// PHOTOGRAPHY

const grid = document.getElementById("photoGrid");
if (grid) {
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const INITIAL_VISIBLE = 6; // Eager-load first ~1–2 rows
  const backText = document.querySelector(".back p");
  if (backText) backText.style.display = "none";
  fetch("photography/photography.json")
    .then((res) => res.json())
    .then((filenames) => shuffle(filenames))
    .then((filenames) => {
      const SHOW_AFTER = 10;
      const targetCount = Math.min(SHOW_AFTER, filenames.length);
      let loadedCount = 0;

      const markLoaded = () => {
        if (!backText) return;
        loadedCount++;
        if (loadedCount >= targetCount) {
          backText.style.display = "";
        }
      };
      // Preload first images so browser starts fetching before DOM is ready
      filenames.slice(0, INITIAL_VISIBLE).forEach((filename) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = `photography/${filename}`;
        document.head.appendChild(link);
      });
      filenames.forEach((filename, i) => {
        const img = document.createElement("img");
        img.src = `photography/${filename}`;
        img.alt = filename.replace(/\.[^/.]+$/, "");
        img.loading = i < INITIAL_VISIBLE ? "eager" : "lazy";
        if (i < INITIAL_VISIBLE) img.fetchPriority = "high";
        img.decoding = "async";
        img.draggable = false;
        img.width = 280;
        img.height = 280;
        img.addEventListener("load", markLoaded, { once: true });
        img.addEventListener("error", markLoaded, { once: true });
        grid.appendChild(img);
      });
      grid.addEventListener("contextmenu", (e) => e.preventDefault());
    })
    .catch((err) => console.error("Failed to load photography list:", err));
}

// OVERSCROLL

const overscrollGrid = document.getElementById("photoGrid");
if (overscrollGrid) {
  const BOTTOM_THRESHOLD = 15;
  const WHEEL_CONFIG = {
    RESISTANCE: 0.1,
    THRESHOLD: 100,
    PULL_RESISTANCE: 0.5,
    MAX_PULL: 80,
  };
  const TOUCH_CONFIG = {
    RESISTANCE: 0.2,
    THRESHOLD: 110,
    PULL_RESISTANCE: 0.92,
    MAX_PULL: 130,
  };
  let inputMode = "wheel";
  let overflowAccum = 0;
  const overscrollProgress = document.getElementById("overscrollProgress");
  const overscrollTrack = document.getElementById("overscrollTrack");
  const main = document.querySelector("main");

  function goBackToIndex() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  }

  function getConfig() {
    return inputMode === "touch" ? TOUCH_CONFIG : WHEEL_CONFIG;
  }

  function atBottom() {
    return document.documentElement.scrollHeight - window.innerHeight - window.scrollY <= BOTTOM_THRESHOLD;
  }

  function setOverscrollBar() {
    const { THRESHOLD } = getConfig();
    const pct = Math.min(1, overflowAccum / THRESHOLD);

    const visible = overflowAccum > 0;
    if (overscrollTrack) {
      overscrollTrack.style.opacity = visible ? "1" : "0";
    }
    if (overscrollProgress) {
      overscrollProgress.style.transform = `scaleY(${pct})`;
    }
    if (overscrollGrid) {
      overscrollGrid.style.opacity = `${1 - pct}`;
    }
    if (main) {
      const { PULL_RESISTANCE, MAX_PULL } = getConfig();
      const pullY = Math.min(overflowAccum * PULL_RESISTANCE, MAX_PULL);
      main.style.transform = pullY > 0 ? `translateY(-${pullY}px)` : "";
    }
  }

  const DECAY = 0.9;
  let isScrolling = false;
  function overscrollTick() {
    if (overflowAccum > 0 && atBottom() && !isScrolling) {
      overflowAccum = Math.max(0, overflowAccum * DECAY);
      setOverscrollBar();
    }
    requestAnimationFrame(overscrollTick);
  }
  requestAnimationFrame(overscrollTick);

  function handleWheel(e) {
    inputMode = "wheel";
    if (!atBottom()) {
      overflowAccum = 0;
      setOverscrollBar();
      if (main) main.style.transform = "";
      isScrolling = false;
      return;
    }
    isScrolling = true;
    if (e.deltaY > 0) {
      const { RESISTANCE, THRESHOLD } = getConfig();
      e.preventDefault();
      overflowAccum += e.deltaY * RESISTANCE;
      setOverscrollBar();
      if (overflowAccum >= THRESHOLD) {
        goBackToIndex();
      }
    } else {
      overflowAccum = Math.max(0, overflowAccum + e.deltaY);
      setOverscrollBar();
    }
    clearTimeout(handleWheel.timeout);
    handleWheel.timeout = setTimeout(() => { isScrolling = false; }, 50);
  }

  document.addEventListener("wheel", handleWheel, { passive: false });

  let touchStartY = 0;
  document.addEventListener(
    "touchstart",
    (e) => {
      inputMode = "touch";
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      if (!atBottom()) {
        overflowAccum = 0;
        setOverscrollBar();
        if (main) main.style.transform = "";
        isScrolling = false;
        return;
      }
      isScrolling = true;
      const { RESISTANCE, THRESHOLD } = getConfig();
      const dy = touchStartY - e.touches[0].clientY;
      if (dy > 0) {
        overflowAccum += dy * RESISTANCE;
        touchStartY = e.touches[0].clientY;
        setOverscrollBar();
        if (overflowAccum >= THRESHOLD) {
          e.preventDefault();
          goBackToIndex();
        }
      } else {
        overflowAccum = Math.max(0, overflowAccum + dy);
        setOverscrollBar();
      }
      clearTimeout(handleWheel.timeout);
      handleWheel.timeout = setTimeout(() => { isScrolling = false; }, 50);
    },
    { passive: false }
  );
}
