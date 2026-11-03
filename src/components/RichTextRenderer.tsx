import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // If content contains standard HTML tags (h1, h2, h3, strong, a, p)
  const hasHtml = /<(h1|h2|h3|b|strong|a|p|ul|li)[^>]*>/i.test(content);

  if (hasHtml) {
    return (
      <div
        className={`rich-text-content space-y-3 prose prose-slate max-w-full text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere] overflow-hidden ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Parse markdown headings, bold, links, lists
  const lines = content.split('\n');

  return (
    <div className={`space-y-3 text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere] max-w-full overflow-hidden ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 1 (# or H1)
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl sm:text-2xl font-black text-[#002B49] mt-3 mb-1">
              {renderFormattedInline(trimmed.substring(2))}
            </h1>
          );
        }

        // Heading 2 (## or H2)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-[#002B49] mt-2.5 mb-1">
              {renderFormattedInline(trimmed.substring(3))}
            </h2>
          );
        }

        // Heading 3 (### or H3)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-bold text-[#002B49] mt-2 mb-0.5">
              {renderFormattedInline(trimmed.substring(4))}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{renderFormattedInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper for inline bold (**text**) and links [text](url)
function renderFormattedInline(text: string): React.ReactNode {
  // Regex for bold (**bold**) and markdown link ([text](url))
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  // Simple parser loop
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);

    // Find whichever comes first
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
    const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : -1;

    if (boldIndex === -1 && linkIndex === -1) {
      parts.push(remaining);
      break;
    }

    if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
      // Bold comes first
      if (boldIndex > 0) {
        parts.push(remaining.substring(0, boldIndex));
      }
      parts.push(
        <strong key={`b-${keyCounter++}`} className="font-bold text-slate-900">
          {boldMatch![1]}
        </strong>
      );
      remaining = remaining.substring(boldIndex + boldMatch![0].length);
    } else if (linkIndex !== -1) {
      // Link comes first
      if (linkIndex > 0) {
        parts.push(remaining.substring(0, linkIndex));
      }
      const linkText = linkMatch![1];
      const linkUrl = linkMatch![2];
      parts.push(
        <a
          key={`l-${keyCounter++}`}
          href={linkUrl}
          target={linkUrl.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="text-blue-600 underline font-semibold hover:text-blue-800 transition break-words [overflow-wrap:anywhere]"
        >
          {linkText}
        </a>
      );
      remaining = remaining.substring(linkIndex + linkMatch![0].length);
    }
  }

  return parts;
}
