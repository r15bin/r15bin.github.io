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
emailLink.href = `mailto:${user}@${domain}`;

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
