import emojiKeywords from "emojilib";
import { lucideIconNames } from "./lib/lucideIconByName";
export { PROJECT_ICON_COLORS, projectIconColorClassName } from "./projectIconColors";

const POPULAR_PROJECT_ICONS: ReadonlyArray<string> = [
  "folder-code",
  "code-2",
  "terminal",
  "globe-2",
  "server",
  "database",
  "bot",
  "sparkles",
  "smartphone",
  "monitor",
  "cloud-cog",
  "package",
  "book-open",
  "flask-conical",
  "shield-check",
  "rocket",
  "gamepad-2",
  "music",
  "image",
  "shopping-bag",
  "git-branch",
  "workflow",
  "wrench",
  "layers-3",
];

export interface ProjectEmojiOption {
  readonly emoji: string;
  readonly label: string;
}

export const PROJECT_EMOJIS: ReadonlyArray<ProjectEmojiOption> = [
  { emoji: "💻", label: "Computer" },
  { emoji: "🛠️", label: "Tools" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "🤖", label: "Robot" },
  { emoji: "✨", label: "Sparkles" },
  { emoji: "⚡", label: "Lightning" },
  { emoji: "🌐", label: "Web" },
  { emoji: "📱", label: "Mobile" },
  { emoji: "🖥️", label: "Desktop" },
  { emoji: "⌨️", label: "Keyboard" },
  { emoji: "⚙️", label: "Gear" },
  { emoji: "🗄️", label: "Database" },
  { emoji: "☁️", label: "Cloud" },
  { emoji: "📦", label: "Package" },
  { emoji: "📚", label: "Books" },
  { emoji: "🧪", label: "Test tube" },
  { emoji: "🔒", label: "Lock" },
  { emoji: "🎮", label: "Game" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🎬", label: "Movie" },
  { emoji: "🖼️", label: "Picture" },
  { emoji: "🛍️", label: "Shopping" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🧩", label: "Puzzle" },
  { emoji: "📊", label: "Chart" },
  { emoji: "🧠", label: "Brain" },
  { emoji: "🦄", label: "Unicorn" },
  { emoji: "🐙", label: "Octopus" },
  { emoji: "🌱", label: "Seedling" },
];

export function filterProjectIconNames(query: string): ReadonlyArray<string> {
  const normalized = query.trim().toLowerCase().replaceAll(/\s+/g, "-");
  if (!normalized) return POPULAR_PROJECT_ICONS;
  return lucideIconNames.filter((name) => name.includes(normalized)).slice(0, 60);
}

function normalizeEmojiTerm(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .replaceAll(/[\s_]+/g, " ");
}

// emojilib lists each emoji's CLDR name first, in snake_case, then looser keywords.
const searchableEmojis = Object.entries(emojiKeywords).map(([emoji, [name = "", ...keywords]]) => {
  const label = normalizeEmojiTerm(name);
  return {
    emoji,
    label: label.charAt(0).toUpperCase() + label.slice(1),
    name: ` ${label}`,
    keywords: keywords.map((keyword) => ` ${normalizeEmojiTerm(keyword)}`),
  };
});

export function filterProjectEmojis(query: string): ReadonlyArray<ProjectEmojiOption> {
  const pasted = firstEmoji(query);
  if (pasted) {
    const label = searchableEmojis.find((option) => option.emoji === pasted)?.label;
    return [{ emoji: pasted, label: label ?? "Custom emoji" }];
  }
  const normalized = normalizeEmojiTerm(query);
  if (!normalized) return PROJECT_EMOJIS;
  const wordStart = ` ${normalized}`;
  return searchableEmojis
    .flatMap((option) => {
      const score =
        option.name === wordStart
          ? 0
          : option.name.includes(wordStart)
            ? 1
            : option.keywords.some((keyword) => keyword.includes(wordStart))
              ? 2
              : null;
      return score === null ? [] : [{ option, score }];
    })
    .toSorted((a, b) => a.score - b.score)
    .slice(0, 60)
    .map(({ option }) => option);
}

export function firstEmoji(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const segments = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(trimmed);
  const segment = segments[Symbol.iterator]().next().value?.segment;
  const isFlag = /^\p{Regional_Indicator}{2}$/u.test(segment ?? "");
  const isKeycap = /^[#*0-9]\uFE0F?\u20E3$/u.test(segment ?? "");
  if (!segment || (!/\p{Extended_Pictographic}/u.test(segment) && !isFlag && !isKeycap)) {
    return null;
  }
  return segment;
}
