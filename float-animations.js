document.addEventListener("DOMContentLoaded", () => {
  // Select all floating elements
  const floats = document.querySelectorAll(".float");

  // Mouse position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Track mouse movement
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Touch support
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Create custom cursor
  const cursor = document.createElement("div");
  cursor.style.position = "fixed";
  cursor.style.width = "20px";
  cursor.style.height = "20px";
  cursor.style.borderRadius = "50%";
  cursor.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
  cursor.style.pointerEvents = "none";
  cursor.style.zIndex = "10000";
  cursor.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(cursor);

  // Set up each element
  floats.forEach((el) => {
    // Make element absolute positioned
    el.style.position = "absolute";
    el.style.pointerEvents = "none";

    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    // Store properties directly on element
    el._data = {
      // Current position
      x: startX,
      y: startY,

      // Random movement patterns
      angleX: Math.random() * Math.PI * 2,
      angleY: Math.random() * Math.PI * 2,
      speedX: Math.random() * 0.01 + 0.005,
      speedY: Math.random() * 0.01 + 0.005,
      rangeX: Math.random() * 50 + 30,
      rangeY: Math.random() * 50 + 30,
      offsetX: Math.random() * 1000,
      offsetY: Math.random() * 1000,

      // Mouse influence
      mouseStrength: Math.random() * 0.2 + 0.1,
      mouseSpeed: Math.random() * 0.05 + 0.02,

      // Current mouse influence
      mouseX: 0,
      mouseY: 0,
    };
  });

  // Animation variables
  let cursorX = mouseX;
  let cursorY = mouseY;

  // Animation function
  function animate() {
    // Update cursor with smooth following
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    // Add swaying to cursor
    const now = Date.now() / 1000;
    const swayX = Math.sin(now * 2) * 10;
    const swayY = Math.cos(now * 1.5) * 10;

    // Apply cursor movement
    cursor.style.transform = `translate(${cursorX + swayX}px, ${
      cursorY + swayY
    }px)`;

    // Update each element independently
    floats.forEach((el) => {
      const data = el._data;
      const time = Date.now() / 1000;

      // Calculate base position using sine waves with different frequencies
      const baseX = Math.sin(time * data.speedX + data.offsetX) * data.rangeX;
      const baseY = Math.sin(time * data.speedY + data.offsetY) * data.rangeY;

      // Calculate mouse influence
      const dx = mouseX - data.x;
      const dy = mouseY - data.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt(
        window.innerWidth * window.innerWidth +
          window.innerHeight * window.innerHeight
      );

      // Target mouse influence (stronger when closer)
      const strength =
        (1 - Math.min(dist / maxDist, 1)) * data.mouseStrength * 200;
      const targetMouseX = (dx / (dist || 1)) * strength;
      const targetMouseY = (dy / (dist || 1)) * strength;

      // Smooth mouse influence
      data.mouseX += (targetMouseX - data.mouseX) * data.mouseSpeed;
      data.mouseY += (targetMouseY - data.mouseY) * data.mouseSpeed;

      // Update position
      data.x = data.x + baseX + data.mouseX;
      data.y = data.y + baseY + data.mouseY;

      // Apply movement
      el.style.transform = `translate(${data.x}px, ${data.y}px)`;
    });

    requestAnimationFrame(animate);
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    floats.forEach((el) => {
      // Keep elements within the window
      const data = el._data;
      if (
        data.x < 0 ||
        data.x > window.innerWidth ||
        data.y < 0 ||
        data.y > window.innerHeight
      ) {
        data.x = Math.random() * window.innerWidth;
        data.y = Math.random() * window.innerHeight;
      }
    });
  });

  // Start animation
  animate();
});
