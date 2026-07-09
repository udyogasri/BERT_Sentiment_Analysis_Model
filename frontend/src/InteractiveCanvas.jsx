import React, { useRef, useEffect } from 'react';

export const InteractiveCanvas = ({ themeId }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ==========================================
    // DEEP SEA THEME INITIALIZATION
    // ==========================================
    const bubbles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      radius: Math.random() * 4 + 2,
      speed: Math.random() * 1.5 + 0.5,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      wobbleAmount: Math.random() * 3 + 1,
      offsetX: Math.random() * 100
    }));

    // Species: 0=clownfish, 1=blueTang, 2=parrotfish, 3=angelfish, 4=pufferfish, 5=mandarin, 6=jellyfish, 7=swordfish
    const fishSpeciesSizes = [7, 9, 13, 11, 8, 7, 0, 14]; // size multipliers
    const fishSpeciesSpeeds = [1.0, 1.3, 0.8, 0.9, 0.6, 0.7, 0.4, 1.5];
    const fishes = Array.from({ length: 18 }, (_, i) => {
      const species = i % 8;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.72) + 80,
        size: fishSpeciesSizes[species] + Math.random() * 3,
        speed: fishSpeciesSpeeds[species] + Math.random() * 0.4,
        direction: Math.random() > 0.5 ? 1 : -1,
        species,
        wobbleOffset: Math.random() * 100
      };
    });

    // Sea Plants: diverse types for seabed
    // plantType: 0=giantKelp, 1=seagrass, 2=seaAnemone, 3=fanCoral, 4=brainCoral
    const seaPlants = Array.from({ length: 28 }, (_, i) => ({
      x: 20 + i * (window.innerWidth / 28) + (Math.random() - 0.5) * 30,
      plantType: i % 5,
      height: 60 + Math.random() * 80,
      offset: Math.random() * 100,
      scale: 0.7 + Math.random() * 0.6
    }));

    const seaTurtle = {
      x: -100,
      y: window.innerHeight * 0.4,
      size: 1.0,
      speed: 0.8,
      targetY: window.innerHeight * 0.4,
      angle: 0
    };

    // ==========================================
    // DEEP SPACE THEME INITIALIZATION
    // ==========================================
    const spaceStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
      zSpeed: Math.random() * 0.15 + 0.05 // for parallax flow
    }));

    const astronaut = {
      x: window.innerWidth * 0.3,
      y: window.innerHeight * 0.35,
      angle: 0.2,
      scale: 0.95,
      vx: 0.12,
      vy: 0.08,
      vAngle: 0.0015
    };

    const millenniumFalcon = {
      x: -150,
      y: window.innerHeight * 0.2,
      scale: 1.2,
      speed: 1.4,
      angle: -0.05
    };

    const spaceDustTrail = [];

    // ==========================================
    // SUNSET GLOW THEME INITIALIZATION
    // ==========================================
    const fireflies = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.6 + 0.4,
      pulseSpeed: Math.random() * 0.05 + 0.02
    }));

    const birds = Array.from({ length: 5 }, () => ({
      x: Math.random() * window.innerWidth - window.innerWidth,
      y: Math.random() * (window.innerHeight * 0.3) + 50,
      speed: Math.random() * 1.0 + 0.8,
      scale: Math.random() * 0.4 + 0.4,
      flapOffset: Math.random() * 10
    }));

    const sparkles = [];

    // ==========================================
    // CYBERPUNK THEME INITIALIZATION
    // ==========================================
    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.8)' : 'rgba(255, 0, 127, 0.8)'
    }));

    // ==========================================
    // DRAWING FUNCTIONS
    // ==========================================

    // 1. Sunken Ships (Deep Sea)
    const drawTitanic = (c, x, y, scale) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);

      // Ambient underwater back-glow for Titanic (mysterious dark glow)
      const glow = c.createRadialGradient(55, 30, 0, 55, 30, 90);
      glow.addColorStop(0, 'rgba(13, 148, 136, 0.15)'); // Teal ocean haze
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = glow;
      c.beginPath();
      c.arc(55, 30, 90, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = 'rgba(10, 16, 32, 0.85)';
      c.strokeStyle = 'rgba(20, 32, 54, 0.9)';
      c.lineWidth = 1.0;

      // Realistic broken bow silhouette
      c.beginPath();
      c.moveTo(0, 38);
      c.lineTo(65, 38);
      c.bezierCurveTo(90, 28, 105, 12, 110, 8); // detailed bow flare
      c.lineTo(112, 12);
      c.bezierCurveTo(106, 22, 90, 42, 65, 48);
      c.lineTo(0, 48);
      c.closePath();
      c.fill();
      c.stroke();

      // Deck layers & windows
      c.fillRect(8, 26, 50, 12);
      c.strokeRect(8, 26, 50, 12);
      c.fillRect(62, 30, 12, 8);
      c.strokeRect(62, 30, 12, 8);

      // Deck Railing (fine lines)
      c.strokeStyle = 'rgba(20, 32, 54, 0.7)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(8, 26); c.lineTo(58, 26);
      c.moveTo(62, 30); c.lineTo(74, 30);
      c.stroke();
      // Railing posts
      for (let rx = 10; rx <= 55; rx += 8) {
        c.beginPath(); c.moveTo(rx, 26); c.lineTo(rx, 23); c.stroke();
      }

      // Sunken funnels (bent/decayed)
      c.fillStyle = 'rgba(8, 13, 26, 0.85)';
      // Funnel 1
      c.save();
      c.translate(20, 26);
      c.rotate(-Math.PI / 5);
      c.fillRect(0, -22, 7, 22);
      c.strokeRect(0, -22, 7, 22);
      c.restore();

      // Funnel 2 (decayed top)
      c.save();
      c.translate(42, 26);
      c.rotate(-Math.PI / 7);
      c.fillRect(0, -18, 6, 18);
      c.strokeRect(0, -18, 6, 18);
      c.restore();

      // Masts & rigging lines
      c.beginPath();
      c.moveTo(80, 28); // foremast
      c.lineTo(50, -30);
      c.strokeStyle = 'rgba(6, 10, 20, 0.8)';
      c.lineWidth = 1.5;
      c.stroke();

      // Fine rigging wires
      c.strokeStyle = 'rgba(10, 20, 38, 0.4)';
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(50, -30); c.lineTo(8, 26);
      c.moveTo(50, -30); c.lineTo(90, 25);
      c.stroke();

      // Hanging Rusticles (realistic details)
      c.strokeStyle = 'rgba(92, 60, 42, 0.65)'; // Rust brown
      c.lineWidth = 1.0;
      const rustOffsets = [15, 25, 38, 52, 68, 85, 98];
      rustOffsets.forEach((ox) => {
        const h = 4 + Math.sin(ox) * 5;
        c.beginPath();
        c.moveTo(ox, 38);
        c.lineTo(ox - 1, 38 + h);
        c.stroke();
      });

      // Portholes (rows of tiny circles)
      c.fillStyle = 'rgba(2, 132, 199, 0.2)'; // eerie water glow
      for (let px = 12; px <= 60; px += 6) {
        c.beginPath();
        c.arc(px, 32, 1.0, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    };

    const drawBlackPearl = (c, x, y, scale) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);

      // Ambient eerie back-glow
      const glow = c.createRadialGradient(65, 25, 0, 65, 25, 95);
      glow.addColorStop(0, 'rgba(16, 185, 129, 0.12)'); // Ghost green hued glow
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = glow;
      c.beginPath();
      c.arc(65, 25, 95, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = 'rgba(8, 12, 22, 0.9)';
      c.strokeStyle = 'rgba(16, 26, 46, 0.95)';
      c.lineWidth = 1.0;

      // galleon hull (Pirate ship stern castle, curved beakhead)
      c.beginPath();
      c.moveTo(0, 10); // high sterncastle
      c.lineTo(10, 20);
      c.lineTo(12, 42); // stern profile
      c.lineTo(95, 42); // keel
      c.bezierCurveTo(115, 38, 120, 22, 122, 18); // curved bow
      c.lineTo(105, 24);
      c.lineTo(90, 24); // deck line
      c.lineTo(78, 28); // main deck step down
      c.lineTo(18, 28);
      c.lineTo(16, 10); // forecastle step up
      c.closePath();
      c.fill();
      c.stroke();

      // Bowsprit
      c.beginPath();
      c.moveTo(115, 22);
      c.lineTo(145, 10);
      c.strokeStyle = 'rgba(8, 12, 22, 0.9)';
      c.lineWidth = 2.5;
      c.stroke();

      // Three Masts (weathered and broken)
      c.lineWidth = 2.0;
      c.strokeStyle = 'rgba(6, 10, 18, 0.9)';
      c.beginPath();
      c.moveTo(25, 28); c.lineTo(22, -18); // Fore mast (leaning)
      c.moveTo(58, 28); c.lineTo(58, -32); // Main mast
      c.moveTo(85, 24); c.lineTo(82, -10); // Mizzen mast
      c.stroke();

      // Yardarms
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(10, -8); c.lineTo(35, -12); // fore yard
      c.moveTo(42, -22); c.lineTo(74, -22); // main yard
      c.moveTo(70, -2); c.lineTo(92, -5); // mizzen yard
      c.stroke();

      // Detailed tattered sails (Pirate Sails)
      c.fillStyle = 'rgba(8, 12, 22, 0.4)';
      // Fore mast sail (jagged tattered path)
      c.beginPath();
      c.moveTo(25, -10);
      c.bezierCurveTo(14, 2, 18, 15, 24, 20);
      c.lineTo(21, 16);
      c.lineTo(23, 11);
      c.bezierCurveTo(16, 2, 21, -5, 25, -10);
      c.closePath();
      c.fill();

      // Main mast sail (jagged cutouts)
      c.beginPath();
      c.moveTo(58, -22);
      c.bezierCurveTo(42, -10, 46, 5, 58, 18);
      c.lineTo(54, 13);
      c.lineTo(56, 4);
      c.bezierCurveTo(48, -4, 46, -15, 58, -22);
      c.closePath();
      c.fill();

      // Rigging details (fine ropes)
      c.strokeStyle = 'rgba(16, 26, 46, 0.4)';
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(22, -18); c.lineTo(145, 10); // forestay
      c.moveTo(58, -32); c.lineTo(22, -18); // main-fore stay
      c.moveTo(58, -32); c.lineTo(82, -10); // main-mizzen stay
      // shrouds (ratlines)
      for (let sy = -20; sy <= 10; sy += 6) {
        c.moveTo(50, sy); c.lineTo(66, sy);
      }
      c.stroke();

      // Ghostly glowing stern lantern
      c.fillStyle = 'rgba(16, 185, 129, 0.6)';
      c.beginPath();
      c.arc(2, 6, 2.5, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    // 2. Swimming Sea Turtle (Deep Sea)
    const drawTurtle = (c, x, y, angle, flipperAngle) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);

      // 3D Drop Shadow
      c.fillStyle = 'rgba(2, 8, 20, 0.4)';
      c.beginPath();
      c.ellipse(0, 7, 27, 20, 0, 0, Math.PI * 2);
      c.fill();

      // Draw Neck and head first (behind shell)
      c.fillStyle = 'rgba(40, 80, 58, 0.9)'; // Dark olive skin
      c.strokeStyle = 'rgba(24, 52, 38, 0.95)';
      c.lineWidth = 1.2;

      c.beginPath();
      c.moveTo(10, -5);
      c.bezierCurveTo(20, -7, 24, -9, 32, -5); // Head structure
      c.bezierCurveTo(36, -3, 36, 3, 32, 5);
      c.bezierCurveTo(24, 9, 20, 7, 10, 5);
      c.closePath();
      c.fill();
      c.stroke();

      // Head details: Eye with pupil & glint, scale highlights
      c.fillStyle = 'rgba(248, 250, 252, 0.9)';
      c.beginPath();
      c.arc(28, -2, 1.2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(10, 24, 16, 0.95)';
      c.beginPath();
      c.arc(28.2, -2, 0.7, 0, Math.PI * 2);
      c.fill();
      // Scale textures on head
      c.strokeStyle = 'rgba(64, 120, 88, 0.35)';
      c.lineWidth = 0.6;
      c.beginPath();
      c.moveTo(22, -3); c.lineTo(24, -6);
      c.moveTo(20, 0); c.lineTo(23, -2);
      c.stroke();

      // Draw Rear Flippers (behind shell)
      c.fillStyle = 'rgba(38, 76, 56, 0.9)';
      c.strokeStyle = 'rgba(20, 48, 32, 0.95)';
      c.lineWidth = 1.0;
      
      // Rear Left
      c.save();
      c.translate(-16, -9);
      c.rotate(-Math.PI / 6 - flipperAngle * 0.18);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-6, -9, -15, -9, -17, -4);
      c.bezierCurveTo(-12, -1, -6, 1, 0, 0);
      c.closePath();
      c.fill(); c.stroke();
      c.restore();

      // Rear Right
      c.save();
      c.translate(-16, 9);
      c.rotate(Math.PI / 6 + flipperAngle * 0.18);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-6, 8, -15, 8, -17, 4);
      c.bezierCurveTo(-12, 1, -6, -1, 0, 0);
      c.closePath();
      c.fill(); c.stroke();
      c.restore();

      // Draw Front Flippers (highly detailed scale textures)
      const drawFrontFlipper = (side) => {
        c.save();
        c.translate(14, side * 10);
        c.rotate(side * (Math.PI / 4) - side * flipperAngle);
        
        // Flipper body
        c.fillStyle = 'rgba(38, 76, 56, 0.9)';
        c.beginPath();
        c.moveTo(0, 0);
        c.bezierCurveTo(8, side * 18, 22, side * 27, 29, side * 27); // curved long flipper
        c.bezierCurveTo(22, side * 14, 10, side * 2, 0, 0);
        c.closePath();
        c.fill();
        c.stroke();

        // 3D Scales on flippers
        c.fillStyle = 'rgba(76, 138, 104, 0.45)';
        for (let j = 0; j < 5; j++) {
          const fx = 8 + j * 3.5;
          const fy = side * (10 + j * 2.8);
          c.beginPath();
          c.arc(fx, fy, 2.0 - j * 0.2, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      };
      drawFrontFlipper(-1); // Left
      drawFrontFlipper(1);  // Right

      // Carapace (Shell) 3D lighting gradient
      const shellGrad = c.createRadialGradient(-4, -4, 2, 0, 0, 25);
      shellGrad.addColorStop(0, 'rgba(64, 120, 84, 0.95)'); // specular gold-green center
      shellGrad.addColorStop(0.5, 'rgba(40, 82, 58, 0.98)'); // rich olive-brown
      shellGrad.addColorStop(0.9, 'rgba(24, 48, 34, 1)'); // dark outer shell
      shellGrad.addColorStop(1, 'rgba(12, 28, 18, 1)'); // absolute dark rim
      
      c.fillStyle = shellGrad;
      c.strokeStyle = 'rgba(8, 20, 12, 1)';
      c.lineWidth = 2.0;

      // Outer Shell Shape
      c.beginPath();
      c.moveTo(25, 0);
      c.bezierCurveTo(20, -19, -16, -18, -23, -9);
      c.bezierCurveTo(-27, -4, -27, 4, -23, 9);
      c.bezierCurveTo(-16, 18, 20, 19, 25, 0);
      c.closePath();
      c.fill();
      c.stroke();

      // Shell Margin Plates (outer ring of tiles)
      c.strokeStyle = 'rgba(12, 28, 18, 0.8)';
      c.lineWidth = 1.0;
      const rimSegments = 16;
      for (let i = 0; i < rimSegments; i++) {
        const theta1 = (i / rimSegments) * Math.PI * 2;
        const theta2 = ((i + 1) / rimSegments) * Math.PI * 2;
        c.beginPath();
        c.moveTo(21 * Math.cos(theta1), 15 * Math.sin(theta1));
        c.lineTo(25 * Math.cos(theta1), 18 * Math.sin(theta1));
        c.stroke();
      }

      // Detailed Carapace Hexagonal plates (Scutes)
      c.strokeStyle = 'rgba(80, 150, 108, 0.45)'; // golden-green lines
      c.lineWidth = 1.2;
      // Central vertebral plates
      c.beginPath();
      c.moveTo(14, 0); c.lineTo(7, -6); c.lineTo(-7, -6); c.lineTo(-14, 0);
      c.lineTo(-7, 6); c.lineTo(7, 6); c.closePath();
      c.stroke();
      // Mid-lateral plates joining
      c.beginPath();
      c.moveTo(7, -6); c.lineTo(11, -12); c.lineTo(-2, -13); c.lineTo(-7, -6);
      c.moveTo(7, 6); c.lineTo(11, 12); c.lineTo(-2, 13); c.lineTo(-7, 6);
      c.stroke();

      // Specular highlight overlay (simulates glistening wet shell)
      c.fillStyle = 'rgba(255, 255, 255, 0.12)';
      c.beginPath();
      c.ellipse(-6, -6, 12, 6, -Math.PI / 6, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    // ==========================================
    // SEA PLANT DRAWING FUNCTIONS
    // ==========================================

    // 3a. Giant Kelp (tall, dark green, air bladders, wide fronds)
    const drawGiantKelp = (c, x, y, height, offset) => {
      c.save();
      c.translate(x, y);

      // Kelp base gradient
      const stemGrad = c.createLinearGradient(0, 0, 0, -height);
      stemGrad.addColorStop(0, 'rgba(16, 34, 24, 0.85)');
      stemGrad.addColorStop(1, 'rgba(66, 84, 58, 0.7)');

      c.strokeStyle = stemGrad;
      c.lineWidth = 3.0;

      c.beginPath();
      c.moveTo(0, 0);

      let lastX = 0;
      let lastY = 0;
      const segments = 10;
      const segHeight = height / segments;

      for (let i = 1; i <= segments; i++) {
        const nextY = -i * segHeight;
        const sway = Math.sin(offset * 0.6 + i * 0.15) * (i * 0.45);
        c.quadraticCurveTo(lastX, lastY - segHeight / 2, sway, nextY);

        // Draw realistic 3D kelp leaves
        if (i > 1) {
          c.save();
          c.translate(sway, nextY);
          const leafRotate = Math.sin(offset * 0.8 + i * 0.2) * 0.04;
          c.rotate(leafRotate);

          // Draw Air Bladder (Pneumatocyst) - small gas bubble that holds kelp upright
          c.fillStyle = 'rgba(70, 86, 64, 0.72)';
          c.strokeStyle = 'rgba(24, 40, 30, 0.85)';
          c.lineWidth = 0.6;
          // Left bladder
          c.beginPath();
          c.arc(-4, -1, 2.2, 0, Math.PI * 2);
          c.fill(); c.stroke();
          // Highlight on left bladder
          c.fillStyle = 'rgba(255,255,255,0.06)';
          c.beginPath(); c.arc(-4.8, -1.8, 0.6, 0, Math.PI*2); c.fill();

          // Right bladder
          c.fillStyle = 'rgba(70, 86, 64, 0.72)';
          c.beginPath();
          c.arc(4, -1, 2.2, 0, Math.PI * 2);
          c.fill(); c.stroke();
          // Highlight on right bladder
          c.fillStyle = 'rgba(255,255,255,0.04)';
          c.beginPath(); c.arc(3.2, -1.8, 0.6, 0, Math.PI*2); c.fill();

          // Left Leaf (2D shaded halves for 3D look)
          c.save();
          c.translate(-4, -1);
          c.rotate(Math.PI / 6);
          // Dark shaded half (bottom)
          c.fillStyle = 'rgba(20, 36, 26, 0.74)';
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(-7, 3, -13, -1);
          c.lineTo(-13, -1);
          c.quadraticCurveTo(-6, 0, 0, 0);
          c.fill();
          // Light shaded half (top)
          c.fillStyle = 'rgba(44, 58, 42, 0.72)';
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(-7, -5, -13, -1);
          c.lineTo(-13, -1);
          c.quadraticCurveTo(-6, 0, 0, 0);
          c.fill();
          // Stroke leaf contour
          c.strokeStyle = 'rgba(12, 44, 26, 0.9)';
          c.lineWidth = 0.8;
          c.stroke();
          // Midrib line
          c.strokeStyle = 'rgba(74, 180, 120, 0.4)';
          c.beginPath(); c.moveTo(0, 0); c.lineTo(-13, -1); c.stroke();
          c.restore();

          // Right Leaf
          c.save();
          c.translate(4, -1);
          c.rotate(-Math.PI / 6);
          // Light shaded half (top)
          c.fillStyle = 'rgba(44, 58, 42, 0.72)';
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(7, -5, 13, -1);
          c.lineTo(13, -1);
          c.quadraticCurveTo(6, 0, 0, 0);
          c.fill();
          // Dark shaded half (bottom)
          c.fillStyle = 'rgba(20, 36, 26, 0.74)';
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(7, 3, 13, -1);
          c.lineTo(13, -1);
          c.quadraticCurveTo(6, 0, 0, 0);
          c.fill();
          // Stroke leaf contour
          c.strokeStyle = 'rgba(12, 44, 26, 0.9)';
          c.lineWidth = 0.8;
          c.stroke();
          // Midrib line
          c.strokeStyle = 'rgba(74, 180, 120, 0.4)';
          c.beginPath(); c.moveTo(0, 0); c.lineTo(13, -1); c.stroke();
          c.restore();

          c.restore();
        }

        lastX = sway;
        lastY = nextY;
      }
      c.stroke();
      c.restore();
    };

    // 3b. Seagrass (thin muted green blades, dense cluster)
    const drawSeagrass = (c, x, y, height, offset) => {
      c.save();
      c.translate(x, y);
      const bladeCount = 7;
      for (let b = 0; b < bladeCount; b++) {
        const bx = (b - bladeCount / 2) * 5;
        const sway = Math.sin(offset * 0.7 + b * 0.15) * (height * 0.08);
        const grad = c.createLinearGradient(bx, 0, bx + sway, -height);
        grad.addColorStop(0, 'rgba(22, 44, 30, 0.88)');
        grad.addColorStop(0.5, 'rgba(62, 74, 56, 0.74)');
        grad.addColorStop(1, 'rgba(98, 114, 92, 0.42)');
        c.strokeStyle = grad;
        c.lineWidth = 2.0;
        c.beginPath();
        c.moveTo(bx, 0);
        c.quadraticCurveTo(bx + sway * 0.5, -height * 0.5, bx + sway, -height);
        c.stroke();
        // Leaf tip highlight
        c.fillStyle = 'rgba(110, 124, 108, 0.16)';
        c.beginPath();
        c.ellipse(bx + sway, -height, 1.5, 4, Math.atan2(sway, height) + Math.PI / 2, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    };

    // 3c. Sea Anemone (with waving tentacles, bright colors)
    const drawSeaAnemone = (c, x, y, offset, scale) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);

      // Base / column (cylinder-like)
      const baseGrad = c.createLinearGradient(-10, 0, 10, -30);
      baseGrad.addColorStop(0, 'rgba(140, 28, 60, 0.9)');
      baseGrad.addColorStop(1, 'rgba(220, 60, 100, 0.75)');
      c.fillStyle = baseGrad;
      c.strokeStyle = 'rgba(80, 10, 30, 0.8)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(-10, 0);
      c.bezierCurveTo(-12, -10, -10, -22, 0, -28);
      c.bezierCurveTo(10, -22, 12, -10, 10, 0);
      c.closePath();
      c.fill();
      c.stroke();

      // Oral disc (top)
      c.fillStyle = 'rgba(240, 100, 140, 0.9)';
      c.beginPath();
      c.ellipse(0, -28, 11, 5, 0, 0, Math.PI * 2);
      c.fill();

      // Waving tentacles
      const colors = ['rgba(255,120,160,0.85)', 'rgba(255,80,130,0.8)', 'rgba(220,60,100,0.8)'];
      for (let t = 0; t < 12; t++) {
        const tx = Math.cos((t / 12) * Math.PI * 2) * 9;
        const ty = -28 + Math.sin((t / 12) * Math.PI * 2) * 4;
        const sway = Math.sin(time * 2.5 + t * 0.7 + offset) * 6;
        c.strokeStyle = colors[t % 3];
        c.lineWidth = 1.8;
        c.beginPath();
        c.moveTo(tx, ty);
        c.quadraticCurveTo(tx + sway * 0.5, ty - 10, tx + sway, ty - 22);
        c.stroke();
        // Tentacle tip (nematocyst)
        c.fillStyle = 'rgba(255, 200, 220, 0.9)';
        c.beginPath();
        c.arc(tx + sway, ty - 22, 1.8, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    };

    // 3d. Fan Coral (branching fan shape, purple/orange)
    const drawFanCoral = (c, x, y, height, offset, scale) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);

      const coralColors = [
        'rgba(186, 64, 190, 0.85)',
        'rgba(255, 140, 0, 0.8)',
        'rgba(255, 60, 100, 0.8)'
      ];
      const color = coralColors[Math.floor(offset * 3) % 3];

      // Draw branching recursively (simplified 3 levels)
      const drawBranch = (bx, by, angle, length, depth) => {
        if (depth === 0 || length < 4) return;
        const ex = bx + Math.cos(angle) * length;
        const ey = by + Math.sin(angle) * length;
        const sway = Math.sin(time * 1.4 + depth * 0.4 + offset) * (depth * 1.5);

        c.strokeStyle = color;
        c.lineWidth = depth * 1.2;
        c.beginPath();
        c.moveTo(bx, by);
        c.quadraticCurveTo((bx + ex) / 2 + sway, (by + ey) / 2, ex, ey);
        c.stroke();

        drawBranch(ex, ey, angle - 0.4, length * 0.68, depth - 1);
        drawBranch(ex, ey, angle + 0.4, length * 0.68, depth - 1);
        if (depth > 1) drawBranch(ex, ey, angle, length * 0.7, depth - 1);
      };

      drawBranch(0, 0, -Math.PI / 2, height * 0.55, 4);
      c.restore();
    };

    // 3e. Brain Coral (round dome, maze-like ridges)
    const drawBrainCoral = (c, x, y, scale) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);

      const r = 28;
      // Dome base
      const domeGrad = c.createRadialGradient(-8, -10, 2, 0, 0, r);
      domeGrad.addColorStop(0, 'rgba(210, 168, 100, 0.95)');
      domeGrad.addColorStop(0.5, 'rgba(170, 120, 60, 0.9)');
      domeGrad.addColorStop(1, 'rgba(110, 70, 30, 0.88)');
      c.fillStyle = domeGrad;
      c.strokeStyle = 'rgba(80, 48, 16, 0.7)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.arc(0, 0, r, Math.PI, 0, false); // top dome
      c.closePath();
      c.fill();
      c.stroke();

      // Maze-like ridges (sinuous lines = brain sulci)
      c.strokeStyle = 'rgba(80, 48, 16, 0.55)';
      c.lineWidth = 1.2;
      for (let row = 0; row < 4; row++) {
        const ry = -r * 0.8 + row * r * 0.5;
        if (Math.abs(ry) > r) continue;
        const halfW = Math.sqrt(Math.max(0, r * r - ry * ry));
        c.beginPath();
        for (let px = -halfW; px <= halfW; px += 4) {
          const py = ry + Math.sin(px * 0.4 + row * 1.2) * 3;
          if (px === -halfW) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.stroke();
      }
      // Specular
      c.fillStyle = 'rgba(255, 240, 180, 0.15)';
      c.beginPath();
      c.ellipse(-10, -14, 12, 6, -Math.PI / 5, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    // 4. Jellyfish Swimming (Deep Sea / Space)
    const drawJellyfish = (c, x, y, offset) => {
      c.save();
      c.translate(x, y);

      const pulse = 1.0 + Math.sin(time * 3.2 + offset) * 0.08;
      const glowAlpha = 0.4 + Math.sin(time * 3.2 + offset) * 0.15;
      c.scale(pulse, 1.0 / Math.sqrt(pulse)); // maintain volume squash-and-stretch

      const colorStr = themeId === 'cyberpunk' ? 'rgba(255, 0, 127' : 'rgba(56, 189, 248';

      // Bioluminescent radial gradient inside the bell dome
      const domeGrad = c.createRadialGradient(0, -5, 1, 0, -1, 16);
      domeGrad.addColorStop(0, `${colorStr}, ${glowAlpha})`);
      domeGrad.addColorStop(0.7, `${colorStr}, ${glowAlpha * 0.45})`);
      domeGrad.addColorStop(1, `${colorStr}, 0)`);

      c.fillStyle = domeGrad;
      c.beginPath();
      c.arc(0, 0, 16, Math.PI, 0, false);
      c.closePath();
      c.fill();

      // Outer dome edge highlight with fine scalloping
      c.strokeStyle = `${colorStr}, 0.75)`;
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(0, 0, 16, Math.PI, 0, false);
      // scallop frills at base of dome
      c.quadraticCurveTo(16, 3, 11, 1.5);
      c.quadraticCurveTo(6, -0.5, 0, 1.5);
      c.quadraticCurveTo(-6, -0.5, -11, 1.5);
      c.quadraticCurveTo(-16, 3, -16, 0);
      c.stroke();

      // Specular highlight on dome (gives wet, gelatinous depth)
      c.fillStyle = 'rgba(255, 255, 255, 0.22)';
      c.beginPath();
      c.ellipse(-5, -6, 5, 2.5, -Math.PI / 4, 0, Math.PI * 2);
      c.fill();

      // Inner glowing organs (spores)
      c.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let i = -7; i <= 7; i += 3.5) {
        c.beginPath();
        c.arc(i, -6 - Math.abs(i)*0.25, 0.7, 0, Math.PI * 2);
        c.fill();
      }

      // Ruffled, lacy oral arms (center tentacles)
      c.strokeStyle = `${colorStr}, 0.6)`;
      c.lineWidth = 2.4;
      for (let i = -3; i <= 3; i += 6) {
        c.beginPath();
        c.moveTo(i, 2);
        let lx = i;
        let ly = 2;
        for (let j = 1; j <= 6; j++) {
          const ny = 2 + j * 5.8;
          const nx = i + Math.sin(time * 2.5 + j * 0.9 + offset) * 4.0;
          c.quadraticCurveTo(lx + (j % 2 === 0 ? 3.0 : -3.0), ly + 2.5, nx, ny);
          lx = nx;
          ly = ny;
        }
        c.stroke();
      }

      // Fine thread-like tentacles
      c.strokeStyle = `${colorStr}, 0.3)`;
      c.lineWidth = 0.7;
      const tentaclePoints = [-13, -9, -5, 5, 9, 13];
      tentaclePoints.forEach((tx) => {
        c.beginPath();
        c.moveTo(tx, 2);
        let lx = tx;
        let ly = 2;
        for (let j = 1; j <= 9; j++) {
          const ny = 2 + j * 6.8;
          const nx = tx + Math.sin(time * 3.4 + j * 0.7 + tx + offset) * 5.0;
          c.quadraticCurveTo(lx, ly + 3.4, nx, ny);
          lx = nx;
          ly = ny;
        }
        c.stroke();
      });

      c.restore();
    };

    // 5. Standard Fish (Deep Sea)
    const drawStandardFish = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);

      // Flexing math (moves tail fin and body back and forth)
      const flex = Math.sin(time * 4.8 + size) * 0.15;

      // Body Gradient (dark teal-indigo back, iridescent pinkish stripe, silvery belly)
      const fishGrad = c.createLinearGradient(0, -size * 0.6, 0, size * 0.6);
      fishGrad.addColorStop(0, 'rgba(16, 44, 70, 0.9)'); // Dark dorsal
      fishGrad.addColorStop(0.35, 'rgba(40, 96, 128, 0.85)');
      fishGrad.addColorStop(0.55, 'rgba(154, 90, 125, 0.65)'); // Pinkish iridescent lateral band
      fishGrad.addColorStop(0.75, 'rgba(84, 178, 204, 0.7)');
      fishGrad.addColorStop(1, 'rgba(215, 235, 244, 0.85)'); // Silvery ventral belly

      c.fillStyle = fishGrad;
      c.strokeStyle = 'rgba(20, 60, 90, 0.9)';
      c.lineWidth = 1.0;

      // Draw dorsal fin (on back, with rays)
      c.fillStyle = 'rgba(16, 44, 70, 0.8)';
      c.beginPath();
      c.moveTo(size * 0.3, -size * 0.52);
      c.quadraticCurveTo(-size * 0.4, -size * 1.2, -size * 0.7, -size * 0.32);
      c.closePath();
      c.fill(); c.stroke();
      // Dorsal Fin Rays
      c.strokeStyle = 'rgba(74, 168, 204, 0.3)';
      c.lineWidth = 0.5;
      for (let rx = -size * 0.6; rx <= size * 0.2; rx += size * 0.15) {
        c.beginPath(); c.moveTo(rx, -size * 0.4); c.lineTo(rx - size * 0.1, -size * 0.8); c.stroke();
      }

      // Draw ventral fins (bottom fins)
      c.fillStyle = 'rgba(74, 168, 204, 0.5)';
      c.strokeStyle = 'rgba(20, 60, 90, 0.7)';
      // Pelvic fin
      c.beginPath();
      c.moveTo(size * 0.2, size * 0.52);
      c.lineTo(-size * 0.1, size * 0.9);
      c.lineTo(-size * 0.2, size * 0.48);
      c.closePath();
      c.fill(); c.stroke();
      // Anal fin
      c.beginPath();
      c.moveTo(-size * 0.6, size * 0.42);
      c.lineTo(-size * 1.0, size * 0.7);
      c.lineTo(-size * 1.1, size * 0.28);
      c.closePath();
      c.fill(); c.stroke();

      // Fusiform body path with flexing offset in tail
      c.fillStyle = fishGrad;
      c.strokeStyle = 'rgba(20, 60, 90, 0.9)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(size * 1.6, 0); // nose
      c.bezierCurveTo(size * 0.8, -size * 0.7, -size * 0.6, -size * 0.6, -size * 1.4, flex * size * 0.7); // back curve
      c.lineTo(-size * 1.5, flex * size); // tail attachment
      c.bezierCurveTo(-size * 0.6, size * 0.6, size * 0.8, size * 0.7, size * 1.6, 0); // belly curve
      c.closePath();
      c.fill();
      c.stroke();

      // Caudal Fin (Forked tail - shifts with flex)
      c.fillStyle = 'rgba(20, 60, 90, 0.75)';
      c.save();
      c.translate(-size * 1.5, flex * size);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-size * 0.8, -size * 0.95, -size * 1.0, -size * 0.75, -size * 1.1, -size * 0.9);
      c.lineTo(-size * 0.6, 0);
      c.lineTo(-size * 1.1, size * 0.9);
      c.bezierCurveTo(-size * 1.0, size * 0.75, -size * 0.8, size * 0.95, 0, 0);
      c.closePath();
      c.fill(); c.stroke();
      // Tail Fin rays
      c.strokeStyle = 'rgba(74, 168, 204, 0.45)';
      c.lineWidth = 0.6;
      c.beginPath();
      c.moveTo(-size * 0.2, -size * 0.2); c.lineTo(-size * 0.9, -size * 0.7);
      c.moveTo(-size * 0.3, 0); c.lineTo(-size * 0.8, -size * 0.1);
      c.moveTo(-size * 0.3, 0); c.lineTo(-size * 0.8, size * 0.1);
      c.moveTo(-size * 0.2, size * 0.2); c.lineTo(-size * 0.9, size * 0.7);
      c.stroke();
      c.restore();

      // Gill Cover (operculum curve)
      c.strokeStyle = 'rgba(12, 36, 56, 0.6)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.arc(size * 0.9, 0, size * 0.3, -Math.PI / 2.5, Math.PI / 2.5, false);
      c.stroke();

      // Pectoral Fin (layered/detailed)
      c.fillStyle = 'rgba(74, 168, 204, 0.45)';
      c.save();
      c.translate(size * 0.3, size * 0.15);
      c.rotate(Math.PI / 4 + flex * 0.5);
      c.beginPath();
      c.ellipse(0, 0, size * 0.45, size * 0.18, 0, 0, Math.PI * 2);
      c.fill(); c.stroke();
      // Rays on pectoral fin
      c.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      c.beginPath(); c.moveTo(-size*0.3, 0); c.lineTo(size*0.3, 0); c.stroke();
      c.restore();

      // Glistening Specular Highlight on back
      c.fillStyle = 'rgba(255, 255, 255, 0.16)';
      c.beginPath();
      c.ellipse(size * 0.3, -size * 0.3, size * 0.7, size * 0.14, -Math.PI / 20, 0, Math.PI * 2);
      c.fill();

      // Realistic Fish Eye (White cornea, black pupil, light highlight dot)
      c.fillStyle = 'rgba(248, 250, 252, 0.98)';
      c.beginPath();
      c.arc(size * 1.1, -size * 0.15, size * 0.16, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(15, 23, 42, 0.98)';
      c.beginPath();
      c.arc(size * 1.14, -size * 0.15, size * 0.08, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(size * 1.17, -size * 0.19, 0.4, 0, Math.PI * 2);
      c.fill();

      // Lateral line
      c.strokeStyle = 'rgba(12, 40, 62, 0.5)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(size * 0.8, 0);
      c.quadraticCurveTo(0, -size * 0.08, -size * 1.4, flex * size * 0.5);
      c.stroke();

      c.restore();
    };

    // 6. Slender Swordfish (Deep Sea)
    const drawSwordfish = (c, x, y, size, direction) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);

      // Tail flex math
      const flex = Math.sin(time * 5.2 + size) * 0.08;

      // Body Gradient (navy dorsal, steel blue mid, silvery belly)
      const sfGrad = c.createLinearGradient(0, -size * 0.45, 0, size * 0.45);
      sfGrad.addColorStop(0, 'rgba(10, 36, 64, 0.92)');
      sfGrad.addColorStop(0.45, 'rgba(24, 60, 96, 0.82)');
      sfGrad.addColorStop(1, 'rgba(74, 142, 178, 0.65)');

      // Long bill rostrum (shaded dark grey-black)
      c.fillStyle = 'rgba(6, 18, 32, 0.95)';
      c.beginPath();
      c.moveTo(size * 3.3, -0.6);
      c.lineTo(size * 1.4, -1.8);
      c.lineTo(size * 1.4, 0.6);
      c.closePath();
      c.fill();

      // Main dorsal Sail fin (Marlin style, with rays)
      c.fillStyle = 'rgba(8, 26, 48, 0.9)';
      c.strokeStyle = 'rgba(12, 40, 72, 0.95)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(size * 0.6, -size * 0.42);
      c.quadraticCurveTo(-size * 0.1, -size * 1.4, -size * 0.8, -size * 0.22);
      c.closePath();
      c.fill(); c.stroke();
      // Dorsal rays
      c.strokeStyle = 'rgba(74, 142, 178, 0.25)';
      c.lineWidth = 0.5;
      for (let rx = -size * 0.6; rx <= size * 0.4; rx += size * 0.12) {
        c.beginPath(); c.moveTo(rx, -size * 0.3); c.lineTo(rx - size * 0.1, -size * 1.0); c.stroke();
      }

      // Long swordfish body (with flexing tail)
      c.fillStyle = sfGrad;
      c.strokeStyle = 'rgba(18, 52, 85, 0.9)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(size * 1.4, -0.6);
      c.bezierCurveTo(size * 0.6, -size * 0.55, -size * 0.8, -size * 0.4, -size * 1.7, flex * size);
      c.lineTo(-size * 1.8, flex * size);
      c.bezierCurveTo(-size * 0.8, size * 0.4, size * 0.6, size * 0.55, size * 1.4, 0.6);
      c.closePath();
      c.fill();
      c.stroke();

      // Pectoral fin swept back
      c.fillStyle = 'rgba(20, 60, 92, 0.6)';
      c.save();
      c.translate(size * 0.4, size * 0.2);
      c.rotate(Math.PI / 6);
      c.beginPath();
      c.ellipse(0, 0, size * 0.55, size * 0.12, 0, 0, Math.PI * 2);
      c.fill(); c.stroke();
      c.restore();

      // Ventral thread-like feelers
      c.strokeStyle = 'rgba(74, 142, 178, 0.5)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(size * 0.5, size * 0.4);
      c.quadraticCurveTo(size * 0.2, size * 0.8, -size * 0.1, size * 1.1);
      c.stroke();

      // Large crescent tail fin (moves with flex)
      c.fillStyle = 'rgba(10, 36, 64, 0.85)';
      c.save();
      c.translate(-size * 1.7, flex * size);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-size * 0.9, -size * 1.15);
      c.lineTo(-size * 0.4, 0);
      c.lineTo(-size * 0.9, size * 1.15);
      c.closePath();
      c.fill(); c.stroke();
      // Caudal rays
      c.strokeStyle = 'rgba(74, 142, 178, 0.35)';
      c.lineWidth = 0.6;
      c.beginPath();
      c.moveTo(-size * 0.1, -size * 0.2); c.lineTo(-size * 0.8, -size * 0.9);
      c.moveTo(-size * 0.1, size * 0.2); c.lineTo(-size * 0.8, size * 0.9);
      c.stroke();
      c.restore();

      // Specular highlight on back
      c.fillStyle = 'rgba(255, 255, 255, 0.14)';
      c.beginPath();
      c.ellipse(size * 0.3, -size * 0.25, size * 0.6, size * 0.1, -Math.PI / 25, 0, Math.PI * 2);
      c.fill();

      // Eye
      c.fillStyle = 'rgba(248, 250, 252, 0.98)';
      c.beginPath();
      c.arc(size * 1.0, -size * 0.1, size * 0.14, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(15, 23, 42, 0.98)';
      c.beginPath();
      c.arc(size * 1.03, -size * 0.1, size * 0.07, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(size * 1.05, -size * 0.13, 0.4, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    // ==========================================
    // COLORFUL FISH SPECIES DRAW FUNCTIONS
    // ==========================================

    // Helper: draw a fish eye at (ex, ey) with radius r
    const drawFishEye = (c, ex, ey, r) => {
      c.fillStyle = 'rgba(248, 250, 252, 0.98)';
      c.beginPath(); c.arc(ex, ey, r, 0, Math.PI * 2); c.fill();
      c.fillStyle = 'rgba(15, 23, 42, 0.98)';
      c.beginPath(); c.arc(ex + r * 0.15, ey, r * 0.55, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(ex + r * 0.3, ey - r * 0.3, r * 0.22, 0, Math.PI * 2); c.fill();
    };

    // Species 0: Clownfish — orange body, white vertical stripes, black outlines
    const drawClownfish = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);
      const flex = Math.sin(time * 5 + size) * 0.12;
      const s = size;

      // Dorsal fin (dark orange)
      c.fillStyle = 'rgba(200, 80, 10, 0.85)';
      c.strokeStyle = 'rgba(30, 10, 0, 0.7)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(s * 0.4, -s * 0.5);
      c.quadraticCurveTo(-s * 0.3, -s * 1.3, -s * 0.7, -s * 0.4);
      c.closePath(); c.fill(); c.stroke();

      // Body (bright orange gradient)
      const bodyGrad = c.createLinearGradient(0, -s * 0.65, 0, s * 0.65);
      bodyGrad.addColorStop(0, 'rgba(255, 110, 10, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(255, 140, 30, 0.9)');
      bodyGrad.addColorStop(1, 'rgba(230, 90, 0, 0.85)');
      c.fillStyle = bodyGrad;
      c.strokeStyle = 'rgba(30, 8, 0, 0.85)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(s * 1.5, 0);
      c.bezierCurveTo(s * 0.8, -s * 0.7, -s * 0.5, -s * 0.65, -s * 1.4, flex * s * 0.8);
      c.lineTo(-s * 1.5, flex * s);
      c.bezierCurveTo(-s * 0.5, s * 0.65, s * 0.8, s * 0.7, s * 1.5, 0);
      c.closePath(); c.fill(); c.stroke();

      // White stripes (3 vertical bands)
      c.fillStyle = 'rgba(255, 255, 255, 0.88)';
      c.strokeStyle = 'rgba(30, 8, 0, 0.6)';
      c.lineWidth = 0.7;
      [s * 0.9, s * 0.15, -s * 0.55].forEach((sx) => {
        c.beginPath();
        c.ellipse(sx, 0, s * 0.15, s * 0.58, 0, 0, Math.PI * 2);
        c.fill(); c.stroke();
      });

      // Tail fin
      c.fillStyle = 'rgba(255, 115, 15, 0.88)';
      c.save(); c.translate(-s * 1.45, flex * s);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-s * 0.7, -s, -s * 0.9, -s * 0.8, -s, -s * 0.9);
      c.lineTo(-s * 0.5, 0);
      c.lineTo(-s, s * 0.9);
      c.bezierCurveTo(-s * 0.9, s * 0.8, -s * 0.7, s, 0, 0);
      c.closePath(); c.fill(); c.stroke(); c.restore();

      // Pectoral fin
      c.fillStyle = 'rgba(255, 180, 60, 0.6)';
      c.save(); c.translate(s * 0.3, s * 0.1); c.rotate(Math.PI / 4 + flex * 0.4);
      c.beginPath(); c.ellipse(0, 0, s * 0.4, s * 0.14, 0, 0, Math.PI * 2);
      c.fill(); c.restore();

      // Specular
      c.fillStyle = 'rgba(255,255,255,0.18)';
      c.beginPath(); c.ellipse(s * 0.3, -s * 0.28, s * 0.65, s * 0.13, -0.1, 0, Math.PI * 2); c.fill();

      drawFishEye(c, s * 1.05, -s * 0.15, s * 0.15);
      c.restore();
    };

    // Species 1: Blue Tang — vivid royal blue, yellow tail
    const drawBlueTang = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);
      const flex = Math.sin(time * 4.6 + size) * 0.13;
      const s = size;

      // Dorsal fin (deep blue-black)
      c.fillStyle = 'rgba(0, 50, 180, 0.85)';
      c.strokeStyle = 'rgba(0, 20, 80, 0.7)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(s * 0.5, -s * 0.5);
      c.quadraticCurveTo(-s * 0.2, -s * 1.35, -s * 0.85, -s * 0.4);
      c.closePath(); c.fill(); c.stroke();

      // Anal fin (bottom)
      c.beginPath();
      c.moveTo(-s * 0.5, s * 0.45);
      c.lineTo(-s * 0.9, s * 0.8);
      c.lineTo(-s * 1.0, s * 0.35);
      c.closePath(); c.fill(); c.stroke();

      // Body (deep royal blue with dark edge)
      const bodyGrad = c.createLinearGradient(0, -s * 0.6, 0, s * 0.6);
      bodyGrad.addColorStop(0, 'rgba(20, 80, 200, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(30, 120, 240, 0.9)');
      bodyGrad.addColorStop(1, 'rgba(10, 60, 180, 0.88)');
      c.fillStyle = bodyGrad;
      c.strokeStyle = 'rgba(0, 20, 80, 0.85)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(s * 1.5, 0);
      c.bezierCurveTo(s * 0.8, -s * 0.72, -s * 0.6, -s * 0.6, -s * 1.4, flex * s * 0.8);
      c.lineTo(-s * 1.5, flex * s);
      c.bezierCurveTo(-s * 0.6, s * 0.6, s * 0.8, s * 0.72, s * 1.5, 0);
      c.closePath(); c.fill(); c.stroke();

      // Yellow tail fin
      c.fillStyle = 'rgba(255, 210, 0, 0.92)';
      c.strokeStyle = 'rgba(160, 120, 0, 0.7)';
      c.save(); c.translate(-s * 1.45, flex * s);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-s * 0.6, -s * 0.95, -s * 0.8, -s * 0.7, -s * 0.95, -s * 0.85);
      c.lineTo(-s * 0.45, 0);
      c.lineTo(-s * 0.95, s * 0.85);
      c.bezierCurveTo(-s * 0.8, s * 0.7, -s * 0.6, s * 0.95, 0, 0);
      c.closePath(); c.fill(); c.stroke(); c.restore();

      // Pectoral fin
      c.fillStyle = 'rgba(80, 160, 255, 0.55)';
      c.save(); c.translate(s * 0.35, s * 0.1); c.rotate(Math.PI / 4 + flex * 0.4);
      c.beginPath(); c.ellipse(0, 0, s * 0.42, s * 0.15, 0, 0, Math.PI * 2);
      c.fill(); c.restore();

      // Specular highlight
      c.fillStyle = 'rgba(150, 200, 255, 0.2)';
      c.beginPath(); c.ellipse(s * 0.3, -s * 0.28, s * 0.65, s * 0.13, -0.1, 0, Math.PI * 2); c.fill();

      drawFishEye(c, s * 1.08, -s * 0.12, s * 0.15);
      c.restore();
    };

    // Species 2: Parrotfish — turquoise-green, pink beak, iridescent scales
    const drawParrotfish = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);
      const flex = Math.sin(time * 3.8 + size) * 0.10;
      const s = size;

      // Tall dorsal fin
      c.fillStyle = 'rgba(0, 160, 140, 0.8)';
      c.strokeStyle = 'rgba(0, 80, 70, 0.7)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(s * 0.6, -s * 0.5);
      c.quadraticCurveTo(-s * 0.1, -s * 1.5, -s * 0.9, -s * 0.4);
      c.closePath(); c.fill(); c.stroke();

      // Body: deep teal with pink-violet iridescence
      const bodyGrad = c.createLinearGradient(0, -s * 0.7, 0, s * 0.7);
      bodyGrad.addColorStop(0, 'rgba(0, 180, 160, 0.95)');
      bodyGrad.addColorStop(0.4, 'rgba(60, 200, 180, 0.9)');
      bodyGrad.addColorStop(0.65, 'rgba(180, 80, 160, 0.55)');
      bodyGrad.addColorStop(1, 'rgba(0, 140, 120, 0.88)');
      c.fillStyle = bodyGrad;
      c.strokeStyle = 'rgba(0, 60, 55, 0.85)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(s * 1.6, 0);
      c.bezierCurveTo(s * 0.9, -s * 0.75, -s * 0.5, -s * 0.68, -s * 1.45, flex * s * 0.7);
      c.lineTo(-s * 1.55, flex * s);
      c.bezierCurveTo(-s * 0.5, s * 0.68, s * 0.9, s * 0.75, s * 1.6, 0);
      c.closePath(); c.fill(); c.stroke();

      // Pink beak at front
      c.fillStyle = 'rgba(240, 100, 160, 0.95)';
      c.strokeStyle = 'rgba(140, 30, 80, 0.7)';
      c.beginPath();
      c.moveTo(s * 1.6, -s * 0.15);
      c.lineTo(s * 2.1, -s * 0.05);
      c.lineTo(s * 1.6, s * 0.15);
      c.closePath(); c.fill(); c.stroke();

      // Scale pattern (iridescent dots)
      c.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let si = 0; si < 8; si++) {
        c.beginPath();
        c.arc(s * 0.8 - si * s * 0.25, (si % 2 === 0 ? -1 : 1) * s * 0.2, s * 0.12, 0, Math.PI * 2);
        c.fill();
      }

      // Tail (rounded, teal)
      c.fillStyle = 'rgba(0, 200, 170, 0.88)';
      c.strokeStyle = 'rgba(0, 80, 70, 0.7)';
      c.save(); c.translate(-s * 1.5, flex * s);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-s * 0.6, -s * 0.9, -s * 0.8, -s * 0.7, -s * 0.9, -s * 0.85);
      c.lineTo(-s * 0.4, 0); c.lineTo(-s * 0.9, s * 0.85);
      c.bezierCurveTo(-s * 0.8, s * 0.7, -s * 0.6, s * 0.9, 0, 0);
      c.closePath(); c.fill(); c.stroke(); c.restore();

      // Specular
      c.fillStyle = 'rgba(200, 255, 245, 0.18)';
      c.beginPath(); c.ellipse(s * 0.35, -s * 0.3, s * 0.7, s * 0.14, -0.1, 0, Math.PI * 2); c.fill();

      drawFishEye(c, s * 1.12, -s * 0.12, s * 0.16);
      c.restore();
    };

    // Species 3: Angelfish — tall flat body, black/gold/white vertical stripes
    const drawAngelfish = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);
      const flex = Math.sin(time * 4.0 + size) * 0.1;
      const s = size;
      const h = s * 1.4; // tall height

      // Body (golden yellow)
      const bodyGrad = c.createLinearGradient(0, -h, 0, h);
      bodyGrad.addColorStop(0, 'rgba(255, 215, 50, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(255, 190, 10, 0.9)');
      bodyGrad.addColorStop(1, 'rgba(220, 150, 0, 0.88)');
      c.fillStyle = bodyGrad;
      c.strokeStyle = 'rgba(60, 40, 0, 0.85)';
      c.lineWidth = 1.0;
      c.beginPath();
      // Diamond-ish tall body
      c.moveTo(s * 1.2, 0);
      c.bezierCurveTo(s * 0.8, -h * 0.9, -s * 0.6, -h * 0.85, -s * 1.2, flex * s * 0.6);
      c.lineTo(-s * 1.3, flex * s);
      c.bezierCurveTo(-s * 0.6, h * 0.85, s * 0.8, h * 0.9, s * 1.2, 0);
      c.closePath(); c.fill(); c.stroke();

      // Black vertical stripes
      c.fillStyle = 'rgba(20, 15, 5, 0.78)';
      c.strokeStyle = 'rgba(0,0,0,0)';
      [s * 0.7, -s * 0.1].forEach((sx) => {
        c.beginPath();
        c.ellipse(sx, 0, s * 0.14, h * 0.82, 0, 0, Math.PI * 2);
        c.fill();
      });

      // Elongated top fin ray
      c.strokeStyle = 'rgba(60, 40, 0, 0.75)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(s * 0.2, -h * 0.85);
      c.quadraticCurveTo(s * 0.1, -h * 1.6, s * 0.0, -h * 1.65);
      c.stroke();

      // Elongated bottom fin ray
      c.beginPath();
      c.moveTo(-s * 0.1, h * 0.85);
      c.quadraticCurveTo(-s * 0.15, h * 1.5, -s * 0.2, h * 1.55);
      c.stroke();

      // Tail fin
      c.fillStyle = 'rgba(255, 215, 50, 0.85)';
      c.strokeStyle = 'rgba(60, 40, 0, 0.7)';
      c.save(); c.translate(-s * 1.25, flex * s);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-s * 0.7, -h * 0.6); c.lineTo(-s * 0.35, 0);
      c.lineTo(-s * 0.7, h * 0.6);
      c.closePath(); c.fill(); c.stroke(); c.restore();

      // Specular
      c.fillStyle = 'rgba(255, 255, 180, 0.18)';
      c.beginPath(); c.ellipse(s * 0.25, -h * 0.3, s * 0.55, s * 0.13, -0.1, 0, Math.PI * 2); c.fill();

      drawFishEye(c, s * 0.92, -s * 0.1, s * 0.16);
      c.restore();
    };

    // Species 4: Pufferfish — round, yellow-spotted, spines
    const drawPufferfish = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);
      const flex = Math.sin(time * 3.2 + size) * 0.06;
      const s = size;
      const r = s * 1.1; // round body radius

      // Round body (olive-green, spotted)
      const bodyGrad = c.createRadialGradient(-s * 0.25, -s * 0.25, 0, 0, 0, r);
      bodyGrad.addColorStop(0, 'rgba(120, 190, 60, 0.95)');
      bodyGrad.addColorStop(0.6, 'rgba(90, 150, 30, 0.9)');
      bodyGrad.addColorStop(1, 'rgba(60, 100, 10, 0.88)');
      c.fillStyle = bodyGrad;
      c.strokeStyle = 'rgba(30, 60, 0, 0.85)';
      c.lineWidth = 1.2;
      c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.stroke();

      // Yellow spots
      c.fillStyle = 'rgba(255, 230, 0, 0.7)';
      [[-s*0.3, -s*0.3], [s*0.2, -s*0.5], [-s*0.6, s*0.1],
       [s*0.5, s*0.3], [-s*0.1, s*0.6], [s*0.6, -s*0.2]].forEach(([sx, sy]) => {
        c.beginPath(); c.arc(sx, sy, s * 0.18, 0, Math.PI * 2); c.fill();
      });

      // Spines (short lines radiating outward)
      c.strokeStyle = 'rgba(60, 40, 0, 0.65)';
      c.lineWidth = 1.0;
      for (let sp = 0; sp < 16; sp++) {
        const a = (sp / 16) * Math.PI * 2;
        const sx = Math.cos(a); const sy = Math.sin(a);
        c.beginPath();
        c.moveTo(sx * (r - 2), sy * (r - 2));
        c.lineTo(sx * (r + 4), sy * (r + 4));
        c.stroke();
      }

      // Small tail
      c.fillStyle = 'rgba(90, 150, 30, 0.8)';
      c.save(); c.translate(-r * 0.9, flex * s);
      c.beginPath();
      c.moveTo(0, 0); c.lineTo(-s * 0.7, -s * 0.5);
      c.lineTo(-s * 0.4, 0); c.lineTo(-s * 0.7, s * 0.5);
      c.closePath(); c.fill(); c.stroke(); c.restore();

      // Snout
      c.fillStyle = 'rgba(100, 165, 40, 0.9)';
      c.beginPath(); c.ellipse(r * 0.85, 0, s * 0.35, s * 0.28, 0, 0, Math.PI * 2);
      c.fill(); c.stroke();

      // Beak
      c.strokeStyle = 'rgba(30, 60, 0, 0.9)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(r * 1.1, -s * 0.06); c.lineTo(r * 1.3, 0);
      c.moveTo(r * 1.1, s * 0.06); c.lineTo(r * 1.3, 0);
      c.stroke();

      // Specular
      c.fillStyle = 'rgba(255,255,255,0.16)';
      c.beginPath(); c.ellipse(-s*0.3, -s*0.45, s*0.4, s*0.2, -Math.PI/5, 0, Math.PI*2); c.fill();

      drawFishEye(c, r * 0.7, -s * 0.35, s * 0.2);
      c.restore();
    };

    // Species 5: Mandarin Dragonet — psychedelic blue/orange swirls
    const drawMandarinFish = (c, x, y, size, direction, angle) => {
      c.save();
      c.translate(x, y);
      c.scale(direction, 1);
      c.rotate(angle);
      const flex = Math.sin(time * 5.5 + size) * 0.14;
      const s = size;

      // Tall dorsal fin (sailfish-like, vivid)
      c.fillStyle = 'rgba(0, 100, 220, 0.88)';
      c.strokeStyle = 'rgba(0, 40, 120, 0.7)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(s * 0.5, -s * 0.5);
      c.quadraticCurveTo(-s * 0.2, -s * 1.6, -s * 0.8, -s * 0.5);
      c.closePath(); c.fill(); c.stroke();
      // Fin rays in orange
      c.strokeStyle = 'rgba(255, 120, 0, 0.5)';
      c.lineWidth = 0.5;
      for (let fr = 0; fr < 5; fr++) {
        const fx = s * 0.4 - fr * s * 0.3;
        c.beginPath(); c.moveTo(fx, -s * 0.4); c.lineTo(fx - s * 0.1, -s * 1.1); c.stroke();
      }

      // Body: blue base with swirling orange pattern
      const bodyGrad = c.createLinearGradient(0, -s * 0.6, 0, s * 0.6);
      bodyGrad.addColorStop(0, 'rgba(0, 80, 200, 0.95)');
      bodyGrad.addColorStop(0.45, 'rgba(30, 120, 240, 0.9)');
      bodyGrad.addColorStop(1, 'rgba(0, 60, 170, 0.88)');
      c.fillStyle = bodyGrad;
      c.strokeStyle = 'rgba(0, 30, 100, 0.85)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(s * 1.5, 0);
      c.bezierCurveTo(s * 0.8, -s * 0.65, -s * 0.5, -s * 0.6, -s * 1.4, flex * s * 0.8);
      c.lineTo(-s * 1.5, flex * s);
      c.bezierCurveTo(-s * 0.5, s * 0.6, s * 0.8, s * 0.65, s * 1.5, 0);
      c.closePath(); c.fill(); c.stroke();

      // Swirling orange-green pattern overlay
      c.strokeStyle = 'rgba(255, 140, 0, 0.6)';
      c.lineWidth = 1.2;
      for (let sw = 0; sw < 4; sw++) {
        const sy = (sw - 1.5) * s * 0.28;
        c.beginPath();
        c.moveTo(s * 1.0, sy);
        c.quadraticCurveTo(0, sy + s * 0.2 * (sw % 2 === 0 ? 1 : -1), -s * 1.0, sy);
        c.stroke();
      }
      c.strokeStyle = 'rgba(0, 220, 80, 0.45)';
      for (let sw = 0; sw < 3; sw++) {
        const sy = (sw - 1) * s * 0.38;
        c.beginPath();
        c.moveTo(s * 0.7, sy);
        c.quadraticCurveTo(0, sy - s * 0.25, -s * 0.7, sy);
        c.stroke();
      }

      // Tail (orange-blue)
      c.fillStyle = 'rgba(255, 100, 0, 0.88)';
      c.strokeStyle = 'rgba(0, 30, 100, 0.7)';
      c.save(); c.translate(-s * 1.45, flex * s);
      c.beginPath();
      c.moveTo(0, 0); c.bezierCurveTo(-s * 0.7, -s, -s * 0.9, -s * 0.8, -s, -s * 0.95);
      c.lineTo(-s * 0.5, 0); c.lineTo(-s, s * 0.95);
      c.bezierCurveTo(-s * 0.9, s * 0.8, -s * 0.7, s, 0, 0);
      c.closePath(); c.fill(); c.stroke(); c.restore();

      // Specular
      c.fillStyle = 'rgba(180, 220, 255, 0.18)';
      c.beginPath(); c.ellipse(s * 0.3, -s * 0.28, s * 0.65, s * 0.12, -0.1, 0, Math.PI * 2); c.fill();

      drawFishEye(c, s * 1.05, -s * 0.12, s * 0.15);
      c.restore();
    };

    // 7. Astronaut Floating (Deep Space)
    const drawAstronaut = (c, x, y, angle, scale) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.scale(scale, scale);

      c.fillStyle = 'rgba(235, 240, 250, 0.7)'; // White spacesuit
      c.strokeStyle = 'rgba(140, 150, 170, 0.8)';
      c.lineWidth = 1.2;

      // Lifesupport Backpack
      c.fillRect(-11, -13, 7, 26);
      c.strokeRect(-11, -13, 7, 26);

      // Body torso
      c.beginPath();
      c.ellipse(0, 0, 7.5, 13, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Helmet
      c.beginPath();
      c.arc(0, -17, 7, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Visor (Glossy Dark Glass)
      c.fillStyle = 'rgba(15, 23, 42, 0.85)';
      c.beginPath();
      c.arc(2, -17, 4, -Math.PI / 2, Math.PI / 2, false);
      c.fill();

      // Left Arm waving
      c.fillStyle = 'rgba(235, 240, 250, 0.7)';
      c.beginPath();
      c.ellipse(-9, -5, 2.8, 9, -Math.PI / 4, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Right Arm extended
      c.beginPath();
      c.ellipse(9, -5, 2.8, 9, Math.PI / 4, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Left Leg
      c.beginPath();
      c.ellipse(-3.5, 17, 2.8, 9.5, 0.05, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Right Leg
      c.beginPath();
      c.ellipse(3.5, 17, 2.8, 9.5, -0.05, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.restore();
    };

    // 8. Millennium Falcon (Deep Space)
    const drawMillenniumFalcon = (c, x, y, angle, scale) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.scale(scale, scale);

      c.fillStyle = 'rgba(48, 52, 60, 0.8)';
      c.strokeStyle = 'rgba(85, 90, 100, 0.9)';
      c.lineWidth = 1.2;

      // Saucer disk
      c.beginPath();
      c.arc(0, 0, 15, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Mandibles (front prongs)
      c.fillRect(3, -7, 15, 4.5);
      c.strokeRect(3, -7, 15, 4.5);
      c.fillRect(3, 2.5, 15, 4.5);
      c.strokeRect(3, 2.5, 15, 4.5);

      // Cockpit capsule (Right side)
      c.beginPath();
      c.ellipse(9, -12, 4.5, 3.5, Math.PI / 4, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.fillRect(0, -12, 9, 2.5);

      // Rear glowing engine (neon cyan drive)
      c.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      c.lineWidth = 2.2;
      c.beginPath();
      c.arc(0, 0, 14, Math.PI * 0.72, Math.PI * 1.28, false);
      c.stroke();

      c.restore();
    };

    // 9. Planet Saturn (Deep Space)
    const drawSaturn = (c, x, y, angle, scale) => {
      c.save();
      c.translate(x, y);
      c.scale(scale, scale);
      c.rotate(angle);

      // Back of Saturn's rings
      c.strokeStyle = 'rgba(234, 179, 8, 0.3)';
      c.lineWidth = 6;
      c.beginPath();
      c.ellipse(0, 0, 42, 8, 0, Math.PI, 0, false);
      c.stroke();

      // Planet Sphere
      const grad = c.createLinearGradient(-20, -20, 20, 20);
      grad.addColorStop(0, 'rgba(234, 179, 8, 0.75)'); // Pale Gold
      grad.addColorStop(1, 'rgba(146, 64, 14, 0.85)'); // Dark Ochre
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, 20, 0, Math.PI * 2);
      c.fill();

      // Front of Saturn's rings
      c.strokeStyle = 'rgba(234, 179, 8, 0.75)';
      c.lineWidth = 6;
      c.beginPath();
      c.ellipse(0, 0, 42, 8, 0, 0, Math.PI, false);
      c.stroke();

      // Highlight inner ring line
      c.strokeStyle = 'rgba(254, 240, 138, 0.5)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.ellipse(0, 0, 35, 6.5, 0, 0, Math.PI, false);
      c.stroke();

      c.restore();
    };

    // ==========================================
    // MAIN LOOP
    // ==========================================
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // ------------------------------------------
      // THEME: DEEP SEA (🌊 Deep Sea)
      // ------------------------------------------
      if (themeId === 'deepSea') {
        // Draw Sunken Ships on Seabed
        drawTitanic(ctx, 80, canvas.height - 110, 1.3);
        drawBlackPearl(ctx, canvas.width - 240, canvas.height - 115, 1.4);

        // Draw Sea Plants along bottom (5 types)
        seaPlants.forEach((plant) => {
          const py = canvas.height - 5;
          if (plant.plantType === 0) {
            drawGiantKelp(ctx, plant.x, py, plant.height, plant.offset);
          } else if (plant.plantType === 1) {
            drawSeagrass(ctx, plant.x, py, plant.height * 0.55, plant.offset);
          } else if (plant.plantType === 2) {
            drawSeaAnemone(ctx, plant.x, py, plant.offset, plant.scale);
          } else if (plant.plantType === 3) {
            drawFanCoral(ctx, plant.x, py, plant.height, plant.offset, plant.scale);
          } else {
            drawBrainCoral(ctx, plant.x, py - 16 * plant.scale, plant.scale);
          }
        });

        // Animate Turtle
        const turtleFlipperAngle = Math.sin(time * 3.5) * 0.35;
        seaTurtle.x += seaTurtle.speed;
        if (mouse.active && mouse.y) {
          seaTurtle.targetY = mouse.y * 0.4 + (canvas.height * 0.3);
        }
        seaTurtle.y += (seaTurtle.targetY - seaTurtle.y) * 0.015;
        seaTurtle.angle = (seaTurtle.targetY - seaTurtle.y) * 0.002;

        if (seaTurtle.x > canvas.width + 120) {
          seaTurtle.x = -120;
          seaTurtle.y = Math.random() * (canvas.height * 0.6) + 100;
          seaTurtle.targetY = seaTurtle.y;
        }
        drawTurtle(ctx, seaTurtle.x, seaTurtle.y, seaTurtle.angle, turtleFlipperAngle);

        // Draw and Update Fishes
        fishes.forEach((fish) => {
          fish.x += fish.speed * fish.direction;

          if (fish.direction === 1 && fish.x > canvas.width + 80) {
            fish.x = -80;
            fish.y = Math.random() * (canvas.height * 0.7) + 60;
          } else if (fish.direction === -1 && fish.x < -80) {
            fish.x = canvas.width + 80;
            fish.y = Math.random() * (canvas.height * 0.7) + 60;
          }

          const swimAngle = Math.sin(time * 4 + fish.wobbleOffset) * 0.08;

          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = fish.x - mouse.x;
            const dy = fish.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const force = (120 - dist) * 0.05;
              fish.x += (dx / dist) * force;
              fish.y += (dy / dist) * force * 0.5;
            }
          }

          if (fish.species === 0) {
            drawClownfish(ctx, fish.x, fish.y, fish.size, fish.direction, swimAngle);
          } else if (fish.species === 1) {
            drawBlueTang(ctx, fish.x, fish.y, fish.size, fish.direction, swimAngle);
          } else if (fish.species === 2) {
            drawParrotfish(ctx, fish.x, fish.y, fish.size, fish.direction, swimAngle);
          } else if (fish.species === 3) {
            drawAngelfish(ctx, fish.x, fish.y, fish.size, fish.direction, swimAngle);
          } else if (fish.species === 4) {
            drawPufferfish(ctx, fish.x, fish.y, fish.size, fish.direction, swimAngle);
          } else if (fish.species === 5) {
            drawMandarinFish(ctx, fish.x, fish.y, fish.size, fish.direction, swimAngle);
          } else if (fish.species === 6) {
            drawJellyfish(ctx, fish.x, fish.y, fish.wobbleOffset);
          } else {
            drawSwordfish(ctx, fish.x, fish.y, fish.size, fish.direction);
          }
        });

        // Draw and Update Bubbles
        bubbles.forEach((bubble) => {
          bubble.y -= bubble.speed;
          bubble.x += Math.sin(time * 2.5 + bubble.offsetX) * bubble.wobbleAmount * 0.1;

          if (bubble.y < -20) {
            bubble.y = canvas.height + Math.random() * 40;
            bubble.x = Math.random() * canvas.width;
          }

          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = bubble.x - mouse.x;
            const dy = bubble.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              const force = (80 - dist) * 0.12;
              bubble.x += (dx / dist) * force;
              bubble.y += (dy / dist) * force * 0.5;
            }
          }

          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      }

      // ------------------------------------------
      // THEME: DEEP SPACE (🌌 Space)
      // ------------------------------------------
      else if (themeId === 'deepSpace') {
        // Draw Nebulae / Cosmic Gas Clouds (Gradients)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Nebula 1 (Indigo-Purple)
        const nebGrad1 = ctx.createRadialGradient(
          canvas.width * 0.2 + Math.sin(time * 0.3) * 50,
          canvas.height * 0.3 + Math.cos(time * 0.2) * 50,
          0,
          canvas.width * 0.2,
          canvas.height * 0.3,
          250
        );
        nebGrad1.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        nebGrad1.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
        nebGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebGrad1;
        ctx.beginPath();
        ctx.arc(canvas.width * 0.2, canvas.height * 0.3, 250, 0, Math.PI * 2);
        ctx.fill();

        // Nebula 2 (Teal-Pink)
        const nebGrad2 = ctx.createRadialGradient(
          canvas.width * 0.8 - Math.sin(time * 0.25) * 60,
          canvas.height * 0.7 + Math.cos(time * 0.35) * 40,
          0,
          canvas.width * 0.8,
          canvas.height * 0.7,
          300
        );
        nebGrad2.addColorStop(0, 'rgba(20, 184, 166, 0.06)');
        nebGrad2.addColorStop(0.6, 'rgba(236, 72, 153, 0.03)');
        nebGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebGrad2;
        ctx.beginPath();
        ctx.arc(canvas.width * 0.8, canvas.height * 0.7, 300, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Milky Way band (subtle galaxy core retained)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const bandY = canvas.height * 0.45;
        const bandH = Math.max(60, Math.floor(canvas.height * 0.08));
        const mwGrad = ctx.createLinearGradient(0, bandY - bandH / 2, 0, bandY + bandH / 2);
        mwGrad.addColorStop(0, 'rgba(255,255,255,0)');
        mwGrad.addColorStop(0.45, 'rgba(255,255,255,0.04)');
        mwGrad.addColorStop(0.55, 'rgba(255,255,255,0.02)');
        mwGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = mwGrad;
        ctx.fillRect(0, bandY - bandH / 2, canvas.width, bandH);
        // sprinkle faint clustered stars along the band to suggest the Milky Way
        for (let s = 0; s < 220; s++) {
          const sx = Math.random() * canvas.width;
          const sy = bandY + (Math.random() - 0.5) * bandH * 0.9;
          const a = 0.06 + Math.random() * 0.12;
          const sz = Math.random() * 1.6 + 0.3;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Saturn floating slowly in background
        drawSaturn(ctx, canvas.width * 0.78, canvas.height * 0.22, 0.45 + Math.sin(time * 0.08) * 0.05, 1.25);

        // Realistic soft crescent planet (no hard destination-out masks)
        {
          const cx = canvas.width * 0.15;
          const cy = canvas.height * 0.7;
          const r = 45;

          // Planet radial shading (subtle lit side)
          const pGrad = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.18, r * 0.08, cx, cy, r);
          pGrad.addColorStop(0, 'rgba(245, 245, 250, 0.95)');
          pGrad.addColorStop(0.35, 'rgba(226, 232, 240, 0.9)');
          pGrad.addColorStop(0.8, 'rgba(170, 178, 190, 0.6)');
          pGrad.addColorStop(1, 'rgba(110,120,130,0.48)');
          ctx.fillStyle = pGrad;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

          // Clip to planet circle and paint a soft crescent shadow overlay (non-destructive)
          ctx.save();
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();

          const maskCx = cx - 15;
          const maskCy = cy - 8;
          const shadowGrad = ctx.createRadialGradient(maskCx, maskCy, r * 0.05, maskCx, maskCy, r * 1.05);
          shadowGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
          shadowGrad.addColorStop(0.55, 'rgba(0,0,0,0.18)');
          shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = shadowGrad;
          ctx.beginPath(); ctx.arc(maskCx, maskCy, r * 1.05, 0, Math.PI * 2); ctx.fill();

          // Subtle rim light on the lit edge
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.beginPath(); ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2); ctx.stroke();

          ctx.restore();
        }

        // Animate Astronaut (drifting / rotating)
        astronaut.x += astronaut.vx;
        astronaut.y += astronaut.vy;
        astronaut.angle += astronaut.vAngle;

        // Bounce from boundaries
        if (astronaut.x < -40 || astronaut.x > canvas.width + 40) astronaut.vx = -astronaut.vx;
        if (astronaut.y < -40 || astronaut.y > canvas.height + 40) astronaut.vy = -astronaut.vy;

        // Attract astronaut gently towards cursor
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - astronaut.x;
          const dy = mouse.y - astronaut.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            astronaut.x += (dx / dist) * 0.18;
            astronaut.y += (dy / dist) * 0.18;
          }
        }
        drawAstronaut(ctx, astronaut.x, astronaut.y, astronaut.angle, astronaut.scale);

        // Animate Spaceship (Millennium Falcon)
        millenniumFalcon.x += millenniumFalcon.speed;
        millenniumFalcon.y += Math.sin(time * 1.5) * 0.2; // slight hover weave
        if (millenniumFalcon.x > canvas.width + 150) {
          millenniumFalcon.x = -150;
          millenniumFalcon.y = Math.random() * (canvas.height * 0.5) + 60;
        }
        drawMillenniumFalcon(ctx, millenniumFalcon.x, millenniumFalcon.y, millenniumFalcon.angle, millenniumFalcon.scale);

        // Twinkle Stars (Parallax z-drift)
        spaceStars.forEach((star) => {
          star.x -= star.zSpeed;
          // Twinkle logic
          star.alpha += star.twinkleSpeed;
          if (star.alpha > 0.95 || star.alpha < 0.2) star.twinkleSpeed = -star.twinkleSpeed;

          // Wrap stars
          if (star.x < -10) {
            star.x = canvas.width + 10;
            star.y = Math.random() * canvas.height;
          }

          // Gravitational Lens (Mouse gravity bends stars path slightly)
          let renderX = star.x;
          let renderY = star.y;
          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - star.x;
            const dy = mouse.y - star.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const pull = (150 - dist) * 0.08;
              renderX += (dx / dist) * pull;
              renderY += (dy / dist) * pull;
            }
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Cosmic Dust Trail (Mouse sparkles)
        if (mouse.active && mouse.x !== null && mouse.y !== null && Math.random() < 0.25) {
          spaceDustTrail.push({
            x: mouse.x,
            y: mouse.y,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            alpha: 1.0,
            color: Math.random() > 0.5 ? '139, 92, 246' : '0, 240, 255' // Violet or Cyan
          });
        }

        spaceDustTrail.forEach((sp, idx) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= 0.025;

          if (sp.alpha <= 0) {
            spaceDustTrail.splice(idx, 1);
            return;
          }

          ctx.fillStyle = `rgba(${sp.color}, ${sp.alpha})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ------------------------------------------
      // THEME: SUNSET GLOW (🌅 Sunset)
      // ------------------------------------------
      else if (themeId === 'sunsetGlow') {
        ctx.fillStyle = 'rgba(15, 6, 26, 0.8)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.quadraticCurveTo(canvas.width * 0.25, canvas.height - 120, canvas.width * 0.5, canvas.height - 50);
        ctx.quadraticCurveTo(canvas.width * 0.75, canvas.height - 20, canvas.width, canvas.height - 90);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(10, 4, 18, 0.9)';
        for (let i = 50; i < canvas.width; i += 180) {
          ctx.beginPath();
          const treeHeight = 25 + Math.sin(i) * 10;
          const hillY = canvas.height - 90 + Math.sin(i * 0.005) * 50;
          ctx.moveTo(i, hillY);
          ctx.lineTo(i - 8, hillY);
          ctx.lineTo(i, hillY - treeHeight);
          ctx.lineTo(i + 8, hillY);
          ctx.closePath();
          ctx.fill();
        }

        birds.forEach((bird) => {
          bird.x += bird.speed;
          if (bird.x > canvas.width + 100) {
            bird.x = -100;
            bird.y = Math.random() * (canvas.height * 0.3) + 40;
          }

          const flap = Math.sin(time * 6 + bird.flapOffset) * 10 * bird.scale;

          ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(bird.x - 20 * bird.scale, bird.y + flap);
          ctx.quadraticCurveTo(bird.x - 10 * bird.scale, bird.y - 5 * bird.scale, bird.x, bird.y);
          ctx.quadraticCurveTo(bird.x + 10 * bird.scale, bird.y - 5 * bird.scale, bird.x + 20 * bird.scale, bird.y + flap);
          ctx.stroke();
        });

        if (mouse.active && mouse.x !== null && mouse.y !== null && Math.random() < 0.35) {
          sparkles.push({
            x: mouse.x,
            y: mouse.y,
            radius: Math.random() * 3 + 1.5,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            alpha: 1.0,
            color: Math.random() > 0.5 ? '244, 63, 94' : '251, 146, 60'
          });
        }

        sparkles.forEach((sp, idx) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= 0.02;

          if (sp.alpha <= 0) {
            sparkles.splice(idx, 1);
            return;
          }

          ctx.fillStyle = `rgba(${sp.color}, ${sp.alpha})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        fireflies.forEach((ff) => {
          ff.x += ff.vx + Math.sin(time + ff.alpha) * 0.15;
          ff.y += ff.vy + Math.cos(time + ff.alpha) * 0.15;

          if (ff.x < 0) ff.x = canvas.width;
          if (ff.x > canvas.width) ff.x = 0;
          if (ff.y < 0) ff.y = canvas.height;
          if (ff.y > canvas.height) ff.y = 0;

          ff.alpha += ff.pulseSpeed;
          if (ff.alpha > 0.95 || ff.alpha < 0.25) ff.pulseSpeed = -ff.pulseSpeed;

          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - ff.x;
            const dy = mouse.y - ff.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              ff.x += (dx / dist) * 0.35;
              ff.y += (dy / dist) * 0.35;
            }
          }

          ctx.fillStyle = `rgba(251, 146, 60, ${ff.alpha})`;
          ctx.beginPath();
          ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(251, 146, 60, ${ff.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(ff.x, ff.y, ff.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ------------------------------------------
      // THEME: CYBERPUNK (⚡ Cyberpunk)
      // ------------------------------------------
      else if (themeId === 'cyberpunk') {
        const gridY = canvas.height * 0.75;
        ctx.strokeStyle = 'rgba(255, 0, 127, 0.15)';
        ctx.lineWidth = 1.0;

        const gridSpeed = (time * 15) % 30;
        for (let y = gridY; y < canvas.height; y += 22) {
          const dy = y + gridSpeed;
          if (dy < canvas.height) {
            ctx.beginPath();
            ctx.moveTo(0, dy);
            ctx.lineTo(canvas.width, dy);
            ctx.stroke();
          }
        }

        const vanishingX = canvas.width * 0.5;
        const vanishingY = gridY - 50;
        for (let x = -canvas.width * 0.5; x < canvas.width * 1.5; x += 120) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, vanishingY);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = 1.5;

        for (let i = 0; i < canvas.width; i += 90) {
          const h = 100 + Math.sin(i * 12) * 60;
          ctx.fillRect(i, canvas.height - h, 85, h);
          ctx.strokeRect(i, canvas.height - h, 85, h);

          ctx.fillStyle = Math.sin(time + i) > 0.0 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 0, 127, 0.4)';
          ctx.fillRect(i + 15, canvas.height - h + 20, 8, 8);
          ctx.fillRect(i + 35, canvas.height - h + 20, 8, 8);
          ctx.fillRect(i + 15, canvas.height - h + 50, 8, 8);
          ctx.fillRect(i + 35, canvas.height - h + 50, 8, 8);
          ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
        }

        nodes.forEach((nd, idx) => {
          nd.x += nd.vx;
          nd.y += nd.vy;

          if (nd.x < 0 || nd.x > canvas.width) nd.vx = -nd.vx;
          if (nd.y < 0 || nd.y > canvas.height) nd.vy = -nd.vy;

          ctx.fillStyle = nd.color;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.radius, 0, Math.PI * 2);
          ctx.fill();

          for (let j = idx + 1; j < nodes.length; j++) {
            const o = nodes[j];
            const dx = nd.x - o.x;
            const dy = nd.y - o.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(nd.x, nd.y);
              ctx.lineTo(o.x, o.y);
              ctx.stroke();
            }
          }

          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = nd.x - mouse.x;
            const dy = nd.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180) {
              ctx.strokeStyle = `rgba(255, 0, 127, ${0.4 * (1 - dist / 180)})`;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(nd.x, nd.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        });
      }

      // ------------------------------------------
      // THEME: LIGHT AURORA (❄️ Aurora)
      // ------------------------------------------
      else if (themeId === 'lightAurora') {
        ctx.fillStyle = 'rgba(230, 235, 245, 0.9)';
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.lineWidth = 2.0;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, canvas.height - 120);
        ctx.lineTo(canvas.width * 0.3, canvas.height - 180);
        ctx.lineTo(canvas.width * 0.6, canvas.height - 100);
        ctx.lineTo(canvas.width, canvas.height - 150);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(200, 210, 230, 0.9)';
        for (let i = 30; i < canvas.width; i += 70) {
          const py = canvas.height - 140 + Math.sin(i * 0.01) * 30;
          ctx.beginPath();
          ctx.moveTo(i, py);
          ctx.lineTo(i - 12, py + 40);
          ctx.lineTo(i + 12, py + 40);
          ctx.closePath();
          ctx.fill();
        }

        for (let i = 0; i < 20; i++) {
          const sx = (Math.sin(i * 99) * 0.5 + 0.5) * canvas.width;
          const sy = (Math.cos(i * 123) * 0.5 + 0.5) * (canvas.height * 0.4);
          const alpha = 0.3 + (Math.sin(time * 3 + i) * 0.3);

          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.save();
        ctx.globalCompositeOperation = 'multiply';

        for (let w = 0; w < 3; w++) {
          const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.65);
          if (w === 0) {
            grad.addColorStop(0, 'rgba(2, 132, 199, 0.05)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          } else if (w === 1) {
            grad.addColorStop(0.2, 'rgba(16, 185, 129, 0.04)');
            grad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
          } else {
            grad.addColorStop(0.1, 'rgba(139, 92, 246, 0.05)');
            grad.addColorStop(0.9, 'rgba(255, 255, 255, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height);

          for (let x = 0; x <= canvas.width; x += 30) {
            let ripple = 0;
            if (mouse.active && mouse.x !== null) {
              const dx = x - mouse.x;
              ripple = Math.exp(-((dx * dx) / 10000)) * 25 * Math.sin(time * 5);
            }

            const y = (canvas.height * 0.15) + (w * 45) +
              Math.sin(time * 0.8 + x * 0.0035 + w) * 35 +
              Math.cos(time * 0.4 - x * 0.002) * 15 + ripple;

            ctx.lineTo(x, y);
          }

          ctx.lineTo(canvas.width, canvas.height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
};
