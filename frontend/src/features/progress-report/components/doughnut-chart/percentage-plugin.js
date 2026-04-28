// Plugin to display percentages in each segment + optional center star
export const percentagePlugin = {
  id: "percentagePlugin",

  // AfterDatasetDraw is a hook provided by Chart.js to add custom drawing to the canvas
  afterDatasetDraw(chart, args, options) {
    // We only work with the first dataset
    if (args?.index !== 0) return;

    const helpers = getPrimaryDataset(chart);
    if (!helpers) return;

    // Const ctx = chart.ctx; 2D context of the <canvas>
    const { ctx, chartArea } = chart;
    const { meta, dataset } = helpers;

    // Sum of the values in the dataset
    const total = dataset.data.reduce((sum, v) => sum + (Number(v) || 0), 0);
    if (!total) return;

    // Retrieving the size of the donut from the first arc
    const firstArc = meta.data[0];
    if (
      !firstArc ||
      typeof firstArc.innerRadius !== "number" ||
      typeof firstArc.outerRadius !== "number"
    ) {
      return;
    }

    const { innerRadius, outerRadius } = firstArc;
    const ringThickness = outerRadius - innerRadius;

    const {
      bubbleScale = 0.6,
      maxWidth = 120,
      maxHeight = 80,
      minPercentage = 3, // minimum value required to draw a segment
      starColor = "#AE9B70",
      starThreshold = 100, // draw the star only if the first segment reaches this %
    } = options || {};

    const { isEmpty } = options || {};
    if(isEmpty) return;

    const bubbleRadius = bubbleScale * ringThickness;
    // Font size proportional to the bubble size
    const fontSize = Math.max(10, Math.round(bubbleRadius * 0.5)); // min 10px

    // --- Center star logic (based on the first segment) ---
    const firstRawValue = Number(dataset.data[0]) || 0;
    const firstPct = Math.round((firstRawValue / total) * 100);

    if (firstPct === starThreshold) {
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const starRadius = innerRadius * 0.35;

      ctx.save();
      ctx.strokeStyle = starColor;
      ctx.fillStyle = starColor;
      ctx.lineWidth = 2.5;

      drawStar(ctx, centerX, centerY, 5, starRadius, starRadius * 0.45);

      ctx.restore();
    }

    // --- Percentage bubbles for each visible segment ---
    for (let i = 0; i < meta.data.length; i++) {
      const arc = meta.data[i];
      const raw = dataset.data[i];
      const value = Number(raw) || 0;
      if (!value) continue;

      const pct = Math.round((value / total) * 100);
      if (pct < minPercentage) continue;

      const pos = arc.tooltipPosition();

      drawBlurBubble(ctx, pos.x, pos.y, bubbleRadius, maxWidth, maxHeight);
      drawPercentageText(ctx, pos.x, pos.y, pct, fontSize);
    }
  },
};

// Safely retrieves the primary dataset + its meta, or null if invalid
function getPrimaryDataset(chart) {
  if (!chart?.data?.datasets || chart.data.datasets.length === 0) return null;

  const dataset = chart.data.datasets[0];
  const meta = chart.getDatasetMeta(0);

  if (!meta || !Array.isArray(meta.data) || meta.data.length === 0) {
    return null;
  }

  return { dataset, meta };
}

// Function to draw a float value bubble
function drawBlurBubble(ctx, x, y, radius, maxWidth, maxHeight) {
  const width = Math.min(radius * 2.2, maxWidth);
  const height = Math.min(radius * 1.6, maxHeight);

  const r = Math.min(radius, width / 2, height / 2);

  const left = x - width / 2;
  const top = y - height / 2;
  const right = left + width;
  const bottom = top + height;

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.filter = "blur(5px)";
  ctx.beginPath();
  ctx.moveTo(left + r, top);
  ctx.lineTo(right - r, top);
  ctx.quadraticCurveTo(right, top, right, top + r);
  ctx.lineTo(right, bottom - r);
  ctx.quadraticCurveTo(right, bottom, right - r, bottom);
  ctx.lineTo(left + r, bottom);
  ctx.quadraticCurveTo(left, bottom, left, bottom - r);
  ctx.lineTo(left, top + r);
  ctx.quadraticCurveTo(left, top, left + r, top);
  ctx.closePath();

  ctx.fill();
  ctx.restore();
}

// Function to render text inside the bubble
function drawPercentageText(ctx, x, y, pct, fontSize) {
  ctx.save();
  ctx.fillStyle = "#005BA9";
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${pct}%`, x, y);
  ctx.restore();
}

// Function to draw the star/medal in the center
function drawStar(ctx, centerX, centerY, spikes, outerRadius, innerRadius) {
  // --- 1) INNER STAR (5 points) ---
  let rot = (Math.PI / 2) * 3;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - innerRadius);

  for (let i = 0; i < spikes; i++) {
    let x = centerX + Math.cos(rot) * innerRadius;
    let y = centerY + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = centerX + Math.cos(rot) * (innerRadius * 0.45);
    y = centerY + Math.sin(rot) * (innerRadius * 0.45);
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.closePath();
  ctx.fill();

  // --- 2) OUTER CONTOUR (10 points/medal) ---
  const points = 16;
  const angleStep = (Math.PI * 2) / points;
  const outerR = outerRadius;
  const innerR = outerRadius * 0.75;

  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    const r = i % 2 === 0 ? outerR : innerR;

    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.stroke();
}
