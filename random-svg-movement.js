const svgs = document.querySelectorAll(".icons");

// Store original positions
const originalPositions = [];
svgs.forEach((svg) => {
  const rect = svg.getBoundingClientRect();
  originalPositions.push({
    x: rect.left,
    y: rect.top,
    element: svg,
  });
});

function animateSVGs() {
  originalPositions.forEach((pos) => {
    // Get viewport width for 10vw calculation
    const vw = window.innerWidth / 100;
    const range = 10 * vw; // Reduced range for subtlety

    // Calculate random offset with smoother progression
    const xOffset = Math.random() * range * 2 - range;
    const yOffset = Math.random() * range * 2 - range;

    // Add slight rotation for more organic movement
    const rotation = Math.random() * 45; // 0 to 360 degrees

    // Apply transform with smooth transition
    pos.element.style.transform = `
      translate(${xOffset}px, ${yOffset}px)
      rotate(${rotation}deg)
    `;
  });

  // Stagger the animations for a wave-like effect
  setTimeout(animateSVGs, 2000 + Math.random() * 1000);
}

// Start with a small delay to let page load
setTimeout(animateSVGs, 500);
