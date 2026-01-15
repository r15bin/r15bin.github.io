const links = document.querySelectorAll("a");

links.forEach(link => {
  let fullyIn = false;

  // Start fade-in
  link.addEventListener("mouseenter", () => {
    link.classList.remove("exit");
    link.classList.add("animate");
    fullyIn = false;
  });

  // Detect when fade-in finished (transition on ::after bubbles to <a>)
  link.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (link.classList.contains("animate")) {
      fullyIn = true; // underline reached full width
    }

    // cleanup after exit finishes
    if (link.classList.contains("exit") && !link.matches(":hover")) {
      link.classList.remove("exit");
      fullyIn = false;
    }
  });

  // On leave: reverse only if not fully in yet
  link.addEventListener("mouseleave", () => {
    if (!fullyIn) {
      // reverse smoothly from current progress
      link.classList.remove("animate"); // goes back to scaleX(0) with origin left
      return;
    }

    // fully in: do the "disappear to the right"
    link.classList.remove("animate");
    link.classList.add("exit");
    fullyIn = false;
  });
});

const user = "robin";
const domain = "r15b.in";

const link = document.getElementById("emailLink");
link.href = `mailto:${user}@${domain}`;

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
    // starting point
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