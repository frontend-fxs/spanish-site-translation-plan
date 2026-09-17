#!/usr/bin/env node
/**
 * Regenerate the PO-facing Word document from README.md.
 * Requires Microsoft Word (COM automation) — Windows only.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const README = path.join(HERE, 'README.md');
const DOCX = path.join(HERE, 'FXStreet-es-Revision-textos-espanol.docx');

function inline(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function splitRow(line) {
  return line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

const isTableSeparator = (line) => /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line) && line.includes('-');

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let listItems = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${paragraph.join('<br>')}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listItems) {
      html.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join('')}</ul>`);
      listItems = null;
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      flushAll();
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      flushAll();
      html.push('<hr>');
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      continue;
    }

    if (line.trimStart().startsWith('|') && isTableSeparator(lines[i + 1] ?? '')) {
      flushAll();
      const head = splitRow(line);
      const body = [];
      i += 2;
      while (i < lines.length && lines[i].trimStart().startsWith('|')) {
        body.push(splitRow(lines[i]));
        i++;
      }
      i--;
      const headHtml = head.map((cell) => `<th>${inline(cell)}</th>`).join('');
      const bodyHtml = body
        .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`)
        .join('');
      html.push(`<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`);
      continue;
    }

    const listItem = line.match(/^\s*[-*+]\s+(.*)$/);
    if (listItem) {
      flushParagraph();
      const content = listItem[1]
        .replace(/^\[ \]\s*/, '\u2610 ')
        .replace(/^\[[xX]\]\s*/, '\u2612 ');
      listItems = listItems ?? [];
      listItems.push(inline(content));
      continue;
    }

    flushList();
    paragraph.push(inline(line.replace(/\s+$/, '')));
  }

  flushAll();
  return html.join('\n');
}

const body = markdownToHtml(fs.readFileSync(README, 'utf8'));

const document = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>FXStreet.es — Revisión de textos en español</title>
<style>
body { font-family: Calibri, sans-serif; font-size: 11pt; color: #1a1a1a; }
h1 { font-size: 20pt; color: #14315c; }
h2 { font-size: 14pt; color: #14315c; margin-top: 18pt; }
h3 { font-size: 12pt; color: #14315c; }
table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
th, td { border: 1px solid #a6a6a6; padding: 4pt 6pt; vertical-align: top; text-align: left; }
th { background: #eef2f7; }
code { font-family: Consolas, monospace; font-size: 10pt; background: #f3f3f3; }
hr { border: none; border-top: 1px solid #c8c8c8; }
</style>
</head>
<body>
${body}
</body>
</html>
`;

const htmlPath = path.join(os.tmpdir(), `po-readme-${process.pid}.html`);
fs.writeFileSync(htmlPath, `\uFEFF${document}`, 'utf8');

const powershell = `
$ErrorActionPreference = 'Stop'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open('${htmlPath.replace(/'/g, "''")}', $false, $false)
  $doc.SaveAs([ref]'${DOCX.replace(/'/g, "''")}', [ref]16)
  $doc.Close(0)
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
`;

try {
  execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', powershell], {
    stdio: 'inherit',
  });
  console.log(`wrote ${path.basename(DOCX)}`);
} finally {
  fs.rmSync(htmlPath, { force: true });
}
