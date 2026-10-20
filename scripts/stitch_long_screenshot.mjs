import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\MostafaAliMohamedElS\\.gemini\\antigravity-ide\\brain\\485df213-25dc-4c54-a44f-a8d2c72ed33d';
const finalOutputPath = path.join(artifactDir, 'homepage_long_screenshot.png');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Launching headless Edge on port 9336...');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9336',
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  let version = null;
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9336/json/version');
      if (res.ok) {
        version = await res.json();
        break;
      }
    } catch (e) {}
  }

  const targetsRes = await fetch('http://127.0.0.1:9336/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      const { resolve, reject } = pending.get(d.id);
      pending.delete(d.id);
      if (d.error) reject(d.error);
      else resolve(d.result);
    }
  };

  function send(method, params = {}) {
    const id = msgId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');
  await sleep(3000);

  // Scroll down to wake up all animations and load images
  console.log('Waking up animations and lazy images...');
  for (let y = 0; y < 8000; y += 800) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await sleep(150);
  }
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(800);

  const slices = [];

  // Key scroll positions to capture full page narrative
  const scrollTargets = [
    { name: 'hero', y: 0, hideHeader: false },
    { name: 'about', y: 800, hideHeader: true },
    { name: 'experience', y: 1550, hideHeader: true },
    { name: 'work_top', y: 2300, hideHeader: true },
    { name: 'work_grid_1', y: 3100, hideHeader: true },
    { name: 'work_grid_2', y: 3950, hideHeader: true },
    { name: 'services', y: 4800, hideHeader: true },
    { name: 'contact_footer', y: 5650, hideHeader: true }
  ];

  for (let i = 0; i < scrollTargets.length; i++) {
    const target = scrollTargets[i];
    console.log(`Capturing slice ${i + 1}/${scrollTargets.length}: ${target.name} at y=${target.y}...`);

    if (target.hideHeader) {
      await send('Runtime.evaluate', {
        expression: `
          const h = document.querySelector('header');
          if (h) h.style.display = 'none';
        `
      });
    }

    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${target.y})` });
    await sleep(600);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    slices.push(buffer);
  }

  ws.close();
  proc.kill();

  console.log('Stitching slices with sharp...');
  const sliceMeta = await Promise.all(slices.map(b => sharp(b).metadata()));
  const width = sliceMeta[0].width;
  const totalHeight = sliceMeta.reduce((acc, m) => acc + m.height, 0);

  console.log(`Canvas dimensions: ${width}x${totalHeight}`);

  let currentY = 0;
  const compositeList = [];
  for (let i = 0; i < slices.length; i++) {
    compositeList.push({
      input: slices[i],
      top: currentY,
      left: 0
    });
    currentY += sliceMeta[i].height;
  }

  await sharp({
    create: {
      width,
      height: totalHeight,
      channels: 4,
      background: { r: 8, g: 9, b: 13, alpha: 1 }
    }
  })
    .composite(compositeList)
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(finalOutputPath);

  const stats = fs.statSync(finalOutputPath);
  console.log(`SUCCESS! Generated long screenshot: ${finalOutputPath} (${Math.round(stats.size / 1024)} KB)`);
}

run().catch(console.error);
