import React from "react";

// Renderiza un string con marcado ligero para copias i18n:
//   **negrita**        -> <strong>
//   [texto](url)       -> <a href> (los externos http reciben target/rel)
// El resto es texto plano. Permite mantener enlaces/negrita dentro de traducciones.
export function renderRich(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={key++}>{m[1]}</strong>);
    } else {
      const label = m[2];
      const url = m[3] ?? "#";
      const external = /^https?:\/\//.test(url);
      nodes.push(
        external ? (
          <a key={key++} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
        ) : (
          <a key={key++} href={url}>{label}</a>
        )
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
