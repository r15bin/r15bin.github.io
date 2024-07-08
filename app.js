// mouse trail

const svg = document.querySelector('#trail')
const path = svg.querySelector('path')

let points = []
let segments = 100
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

// color

const slider = document.querySelector('#slider input')
const root = document.querySelector(':root')

slider.addEventListener('input', () => {
  const hue = slider.value

  root.style.setProperty('--color4', `oklch(50% 0.3 ${hue})`)
})

// scroll animation

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  })
})

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
