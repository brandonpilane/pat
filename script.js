const s = (p) => {
  let step, colour, rotationAngle, magnify;
  let oldX, oldY;
  let length;
  let i = 0;
  let autoTimer = 0;
  let autoResetInterval = 100; // frames between pattern resets (~5s at 60fps)

  p.setup = function () {
    const container = document.getElementById("sketch-container");
    const canvas = p.createCanvas(
      container.offsetWidth,
      container.offsetHeight
    );
    p.drawingContext.shadowBlur = 5;
    p.drawingContext.shadowColor = "white"; // Will change dynamically later

    canvas.parent("sketch-container");
    p.angleMode(p.DEGREES);
    p.colorMode(p.HSL);
    initializePattern();
  };

  p.draw = function () {
    if (i < 360) {
      const hue = (p._hueBase + (colour % p._hueSpread)) % 360;

      const glowHue = `hsl(${hue}, 100%, 50%)`;
      p.stroke(hue, 100, 50);
      p.drawingContext.shadowColor = glowHue;

      let newX = length * p.cos(rotationAngle) + oldX;
      let newY = length * p.sin(rotationAngle) + oldY;

      p.line(oldX, oldY, newX, newY);

      oldX = newX;
      oldY = newY;
      rotationAngle += step;
      length -= magnify;
      colour += 1;
      i++;
    } else {
      // auto-reset after a delay
      autoTimer++;
      if (autoTimer > autoResetInterval) {
        initializePattern();
        autoTimer = 0;
      }
    }
  };

  function initializePattern(fix, zoom, startColour) {
    step = fix ?? Math.round(p.random(360));

    const hueSpread = 20; // narrower spread for more cohesive color
    const pivotHue = Math.round(p.random(300, 340)); // lock to pinkish hues
    const hueBase = pivotHue - hueSpread / 2;

    colour = startColour ?? 0;
    rotationAngle = 0;
    magnify = zoom ?? p.height / 500;

    oldX = p.width / 2;
    oldY = p.height / 2;
    length = 0;
    i = 0;

    p.background(0);

    p._hueBase = hueBase;
    p._hueSpread = hueSpread;
  }

  // Function to handle scroll-based rotation
  function handleScroll() {
    const scrollPos = window.scrollY; // Get the current scroll position
    const rotation = scrollPos * 0.1; // Control rotation speed (adjust multiplier as needed)
    document.getElementById(
      "canvas-wrapper"
    ).style.transform = `rotate(${rotation}deg)`;
  }

  // Listen to scroll event to trigger the rotation
  window.addEventListener("scroll", handleScroll);
};

new p5(s);
