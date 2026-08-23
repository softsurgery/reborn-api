export type ExtractedMessageLink = {
  url: string;
  startOffset: number;
  endOffset: number;
  order: number;
};

const URL_REGEX = /(?:https?:\/\/|www\.)[^\s]+/gi;
const TRAILING_PUNCTUATION_REGEX = /[.,!?;:)\]]+$/;

export const extractMessageLinks = (
  content?: string | null,
): ExtractedMessageLink[] => {
  if (!content?.trim()) {
    return [];
  }

  const links: ExtractedMessageLink[] = [];
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(content)) !== null) {
    let url = match[0];
    let endOffset = match.index + url.length;

    const trailingPunctuation = url.match(TRAILING_PUNCTUATION_REGEX);
    if (trailingPunctuation) {
      url = url.slice(0, -trailingPunctuation[0].length);
      endOffset -= trailingPunctuation[0].length;
    }

    if (!url) {
      continue;
    }

    links.push({
      url,
      startOffset: match.index,
      endOffset,
      order: links.length,
    });
  }

  return links;
};
