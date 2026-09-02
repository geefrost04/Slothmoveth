#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.join(process.cwd(), 'public/exams/police-math-categories');
fs.mkdirSync(outputDir, { recursive: true });

const wrap = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#ffffff"/>
  <style>.line{fill:none;stroke:#172554;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.thin{fill:none;stroke:#64748b;stroke-width:4}.accent{fill:none;stroke:#be123c;stroke-width:7;stroke-dasharray:16 10}.label{font:600 42px Arial,sans-serif;fill:#172554}.small{font:500 30px Arial,sans-serif;fill:#334155}.fill{fill:#e0f2fe;stroke:#172554;stroke-width:6}</style>${body}</svg>`;
const write = (name, body) => fs.writeFileSync(path.join(outputDir, name), wrap(body));

write('aptitude-q13-cube-net.svg', `
  <g transform="translate(315 100)"><rect class="fill" x="190" y="0" width="160" height="160"/><rect class="fill" x="30" y="160" width="160" height="160"/><rect class="fill" x="190" y="160" width="160" height="160"/><rect class="fill" x="350" y="160" width="160" height="160"/><rect class="fill" x="510" y="160" width="160" height="160"/><rect class="fill" x="190" y="320" width="160" height="160"/><g class="label" text-anchor="middle"><text x="270" y="100">B</text><text x="110" y="260">A</text><text x="270" y="260">C</text><text x="430" y="260">D</text><text x="590" y="260">E</text><text x="270" y="420">F</text></g></g>`);
write('aptitude-q14-rotation.svg', `
  <circle class="line" cx="600" cy="470" r="210"/><path class="line" d="M600 690V220"/><path fill="#172554" d="M600 145l-35 95h70z"/><text class="label" x="578" y="105">N</text><text class="label" x="830" y="485">E</text><text class="label" x="578" y="800">S</text><text class="label" x="345" y="485">W</text><path class="accent" d="M600 220 A250 250 0 0 0 425 645"/><path fill="#be123c" d="M395 675l80-36-50-50z"/><text class="label" x="330" y="270">135°</text>`);
write('aptitude-q15-matrix.svg', `
  <g transform="translate(270 145)">${[0,1,2,3,4,5,6,7].map((n)=>{const x=(n%3)*220,y=Math.floor(n/3)*220;return `<rect class="thin" x="${x}" y="${y}" width="220" height="220"/><path class="line" d="M${x+65} ${y+110}h90M${x+110} ${y+65}v90" transform="rotate(${(n%3)*45} ${x+110} ${y+110})"/>`;}).join('')}<rect class="thin" x="440" y="440" width="220" height="220"/><text class="label" x="530" y="570">?</text></g>`);
write('aptitude-q16-pyramid-section.svg', `<path class="line" d="M600 130L310 650h580zM310 650l220 115 360-115"/><path class="thin" d="M600 130v635M310 650l290 115 290-115"/><path class="accent" d="M455 390L745 390M455 390l145 375M745 390L600 765"/>`);
write('geometry-q01-ladder.svg', `<path class="line" d="M300 730H900M900 730V210M300 730L900 210"/><text class="label" x="575" y="820">5 m</text><text class="label" x="945" y="490">h</text><text class="label" x="560" y="435" transform="rotate(-40 560 435)">13 m</text>`);
write('geometry-q03-patrol-route.svg', `<g transform="translate(300 680)"><path class="thin" d="M0 0h600M0-120h600M0-240h600M0-360h600M0-480h600M0 0v-480M120 0v-480M240 0v-480M360 0v-480M480 0v-480M600 0v-480"/><path class="line" d="M80 0V-360H320V-450"/><path class="accent" d="M80 0L320-450"/><text class="label" x="335" y="-455">d</text><text class="small" x="20" y="-190">12 km</text><text class="small" x="165" y="-385">8 km</text><text class="small" x="335" y="-425">3 km</text></g>`);
write('geometry-q05-triangle-angles.svg', `<path class="line" d="M290 690L600 170 930 690z"/><text class="label" x="340" y="665">50°</text><text class="label" x="570" y="255">2x</text><text class="label" x="805" y="665">3x</text>`);
write('geometry-q07-parallel.svg', `<path class="line" d="M220 270h760M220 620h760M350 770L840 120"/><text class="label" x="235" y="230">L1</text><text class="label" x="235" y="690">L2</text><text class="label" x="420" y="340">(3x + 10)°</text><text class="label" x="675" y="555">(2x + 20)°</text>`);
write('geometry-q11-trapezoid.svg', `<path class="line" d="M330 680L470 250H730L870 680z"/><path class="accent" d="M470 680V250"/><text class="label" x="535" y="220">8 cm</text><text class="label" x="535" y="745">12 cm</text><text class="label" x="385" y="485">6 cm</text>`);
write('geometry-q12-square-circle.svg', `<rect class="line" x="350" y="180" width="500" height="500"/><circle class="thin" cx="600" cy="430" r="250"/><path fill="#fde68a" fill-rule="evenodd" d="M350 180h500v500H350z M600 180a250 250 0 1 0 0 500 250 250 0 1 0 0-500z"/><text class="label" x="555" y="745">10 cm</text>`);
write('geometry-q14-cylinder.svg', `<ellipse class="line" cx="600" cy="240" rx="210" ry="70"/><path class="line" d="M390 240v400M810 240v400"/><path class="line" d="M390 640a210 70 0 0 0 420 0"/><path class="accent" d="M600 240v400"/><text class="label" x="630" y="470">h</text><text class="label" x="690" y="230">r</text>`);
write('geometry-q15-cone.svg', `<ellipse class="line" cx="600" cy="660" rx="230" ry="75"/><path class="line" d="M600 150L370 660M600 150l230 510"/><path class="accent" d="M600 150v510"/><text class="label" x="630" y="450">h</text><text class="label" x="700" y="650">r</text>`);
write('geometry-q20-pyramid.svg', `<path class="line" d="M600 130L320 650l280 120 280-120zM320 650l280 120 280-120"/><path class="thin" d="M600 130V770"/><path class="accent" d="M600 130L880 650"/><text class="label" x="700" y="400">10 cm</text><text class="label" x="520" y="835">12 cm</text>`);

console.log(`Generated 13 diagrams in ${outputDir}`);
