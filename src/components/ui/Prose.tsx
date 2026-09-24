import { Link } from '@/i18n/navigation';
import { splitLinks, type Block } from '@/content/journal/types';

const linkClass =
  'text-ink-900 underline decoration-brand-500 decoration-2 underline-offset-4 hover:text-brand-900 transition-colors';

function renderText(text: string) {
  return splitLinks(text).map((part, i) => {
    if (typeof part === 'string') return part;
    return part.href.startsWith('/') ? (
      <Link key={i} href={part.href} className={linkClass}>
        {part.text}
      </Link>
    ) : (
      <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {part.text}
      </a>
    );
  });
}

function renderBlock(block: Block, index: number) {
  if (block.type === 'h2') {
    return (
      <h2 key={index} className="mt-10 mb-3 text-2xl font-serif font-medium text-ink-900">
        {block.text}
      </h2>
    );
  }

  if (block.type === 'ul') {
    return (
      <ul key={index} className="mt-4 space-y-2">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-ink-600 leading-relaxed">
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
            <span>{renderText(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="mt-4 text-ink-600 leading-relaxed">
      {renderText(block.text)}
    </p>
  );
}

/** Long-form copy (journal articles, the privacy policy): paragraphs, h2s
 * and bullet lists, with `[text](/path)` links inside the text. */
export function Prose({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map(renderBlock)}</>;
}
