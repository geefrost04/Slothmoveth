import { Fragment, type ReactNode } from 'react';
import type { StudySheetAsset } from '@/lib/study-sheet-types';
import { getStudySheetAssetUrl } from '@/lib/study-sheets';

const ASSET_LINE = /^\s*\{\{asset:([a-z0-9-]+)\}\}\s*$/;
const BLOCK_START = /^(#{1,6}\s|```|~~~|>\s?|[-*+]\s+|\d+\.\s+|\s*---\s*$)/;

function safeHref(href: string): string | null {
  if (/^(https?:|mailto:|\/|#)/i.test(href)) return href;
  return null;
}

function renderInline(source: string, keyPrefix: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    if (match.index > cursor) tokens.push(source.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;
    if (token.startsWith('**')) {
      tokens.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      tokens.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('*')) {
      tokens.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = linkMatch ? safeHref(linkMatch[2]) : null;
      tokens.push(href ? <a key={key} href={href}>{linkMatch?.[1]}</a> : token);
    }
    cursor = match.index + token.length;
  }
  if (cursor < source.length) tokens.push(source.slice(cursor));
  return tokens;
}

function splitTableRow(line: string): string[] {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index] ?? '';
  return BLOCK_START.test(line) || ASSET_LINE.test(line) || Boolean(lines[index + 1] && line.includes('|') && isTableDivider(lines[index + 1]));
}

function PendingAwareAsset({ assetKey, assets }: { assetKey: string; assets: Map<string, StudySheetAsset> }) {
  const asset = assets.get(assetKey);
  if (!asset) return null;

  let src = getStudySheetAssetUrl(asset);
  if (!src && asset.metadata && typeof asset.metadata.public_path === 'string') {
    src = asset.metadata.public_path;
  }

  if (!src) {
    return (
      <div className="study-markdown-asset-placeholder" style={{
        border: '2px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '24px',
        margin: '20px 0',
        backgroundColor: '#f8fafc',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
        <strong style={{ color: '#1e293b', display: 'block', fontSize: '15px' }}>{asset.title}</strong>
        {asset.description && <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>{asset.description}</p>}
        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
          [ ภาพประกอบบทที่ {asset.chapter_no}: {asset.asset_key} ]
        </span>
      </div>
    );
  }

  return (
    <figure className="study-markdown-asset">
      {/* eslint-disable-next-line @next/next/no-img-element -- Storage dimensions arrive with the future asset. */}
      <img src={src} alt={asset.alt_text} loading="lazy" />
      {asset.description ? <figcaption>{asset.description}</figcaption> : null}
    </figure>
  );
}

function MarkdownBlocks({ source, assets, keyPrefix }: { source: string; assets: Map<string, StudySheetAsset>; keyPrefix: string }) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const assetMatch = line.match(ASSET_LINE);
    if (assetMatch) {
      blocks.push(<PendingAwareAsset key={`${keyPrefix}-asset-${index}`} assetKey={assetMatch[1]} assets={assets} />);
      index += 1;
      continue;
    }

    const fence = line.match(/^(```|~~~)(.*)$/);
    if (fence) {
      const marker = fence[1];
      const language = fence[2].trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith(marker)) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(<pre key={`${keyPrefix}-code-${index}`}><code data-language={language || undefined}>{code.join('\n')}</code></pre>);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + 1);
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
      blocks.push(<Tag key={`${keyPrefix}-heading-${index}`}>{renderInline(heading[2], `${keyPrefix}-heading-${index}`)}</Tag>);
      index += 1;
      continue;
    }

    if (/^\s*---\s*$/.test(line)) {
      blocks.push(<hr key={`${keyPrefix}-hr-${index}`} />);
      index += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quote: string[] = [];
      const start = index;
      while (index < lines.length && lines[index].startsWith('>')) quote.push(lines[index++].replace(/^>\s?/, ''));
      blocks.push(<blockquote key={`${keyPrefix}-quote-${start}`}><MarkdownBlocks source={quote.join('\n')} assets={assets} keyPrefix={`${keyPrefix}-quote-${start}`} /></blockquote>);
      continue;
    }

    if (line.includes('|') && lines[index + 1] && isTableDivider(lines[index + 1])) {
      const start = index;
      const headers = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(splitTableRow(lines[index++]));
      blocks.push(
        <div className="study-markdown-table-wrap" key={`${keyPrefix}-table-${start}`}>
          <table>
            <thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex} scope="col">{renderInline(cell, `${keyPrefix}-th-${start}-${cellIndex}`)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{headers.map((_, cellIndex) => <td key={cellIndex}>{renderInline(row[cellIndex] ?? '', `${keyPrefix}-td-${start}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }

    const listMatch = line.match(/^\s*([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = /\d+\./.test(listMatch[1]);
      const items: string[] = [];
      const start = index;
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-*+]|\d+\.)\s+(.+)$/);
        if (!item || /\d+\./.test(item[1]) !== ordered) break;
        items.push(item[2]);
        index += 1;
      }
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={`${keyPrefix}-list-${start}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `${keyPrefix}-li-${start}-${itemIndex}`)}</li>)}</List>);
      continue;
    }

    const paragraph: string[] = [line];
    const start = index;
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) paragraph.push(lines[index++]);
    blocks.push(
      <p key={`${keyPrefix}-p-${start}`}>
        {paragraph.map((part, partIndex) => <Fragment key={partIndex}>{partIndex ? <br /> : null}{renderInline(part, `${keyPrefix}-p-${start}-${partIndex}`)}</Fragment>)}
      </p>
    );
  }

  return <>{blocks}</>;
}

export function SafeMarkdown({ content, assets, id }: { content: string; assets: StudySheetAsset[]; id: string }) {
  const assetMap = new Map(assets.map((asset) => [asset.asset_key, asset]));
  return <div className="study-markdown"><MarkdownBlocks source={content} assets={assetMap} keyPrefix={id} /></div>;
}
