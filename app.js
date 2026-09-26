// EMAIL LINK
const user = "hello";
const domain = "r15b.in";

// Copy
const emailLinkCopy = document.getElementById("email-link-copy");
if (emailLinkCopy) {
  // Lock the button's width so text swap doesn't cause layout shift
  emailLinkCopy.style.display = "inline-block";
  emailLinkCopy.style.width = `${emailLinkCopy.offsetWidth}px`;
  emailLinkCopy.style.textAlign = "center";

  emailLinkCopy.addEventListener("click", (e) => {
    e.preventDefault();
    const email = `${user}@${domain}`;
    navigator.clipboard.writeText(email).then(() => {
      const original = emailLinkCopy.textContent;
      emailLinkCopy.textContent = "Copied";
      setTimeout(() => {
        emailLinkCopy.textContent = original;
      }, 1500);
    });
  });
}

// Mailto
const emailLinkSend = document.getElementById("email-link-send");
if (emailLinkSend) {
  emailLinkSend.addEventListener("click", (e) => {
    e.preventDefault();
    const email = `${user}@${domain}`;
    window.location.href = `mailto:${email}`;
  });
}


// MOUSE TRAIL

  const svg = document.querySelector('#trail')
  const path = svg.querySelector('path')
  
  let points = []
  let segments = 30 // TRAIL LENGTH
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

// SCROLLBAR

const thumb = document.getElementById("scrollbarProgress");
function update() {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const pct = (scrollY / max) * 100;
  thumb.style.width = pct + "%";
}
addEventListener("scroll", update, { passive: true });
addEventListener("resize", update);
update();

// IMG PROTECTION

document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
});
