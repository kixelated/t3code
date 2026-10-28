import { AlarmClockCheck, ArrowDown01, Layers3 } from "lucide-react";
import { describe, expect, it } from "vite-plus/test";
import { lucideIconByName } from "./lib/lucideIconByName";
import {
  filterProjectEmojis,
  filterProjectIconNames,
  firstEmoji,
  PROJECT_EMOJIS,
} from "./projectIconOptions";

describe("projectIconOptions", () => {
  it("resolves every offered icon name, including saved legacy spellings", () => {
    for (const name of filterProjectIconNames("")) expect(lucideIconByName(name)).toBeDefined();
    expect(lucideIconByName("layers-3")).toBe(Layers3);
    expect(lucideIconByName("arrow-down-01")).toBe(ArrowDown01);
    expect(lucideIconByName("arrow-down-0-1")).toBe(ArrowDown01);
    expect(lucideIconByName("alarm-check")).toBe(AlarmClockCheck);
    expect(lucideIconByName("create-lucide-icon")).toBeUndefined();
  });

  it("extracts one complete emoji grapheme", () => {
    expect(firstEmoji("  👩🏽‍💻 hello")).toBe("👩🏽‍💻");
    expect(firstEmoji("🇺🇸 project")).toBe("🇺🇸");
    expect(firstEmoji("1️⃣ project")).toBe("1️⃣");
    expect(firstEmoji("plain text")).toBeNull();
  });

  it("searches emoji by name, then keyword, and accepts a pasted emoji", () => {
    const emojis = (query: string) => filterProjectEmojis(query).map((option) => option.emoji);
    expect(filterProjectEmojis("  ")).toBe(PROJECT_EMOJIS);
    expect(emojis("Fire")[0]).toBe("🔥");
    expect(emojis("fire")).toContain("🚒");
    expect(emojis("lit")).toContain("🔥");
    expect(emojis("grinning face")).toContain("😀");
    expect(emojis("ire")).not.toContain("🔥");
    expect(filterProjectEmojis(" 🧑‍💻 ")).toEqual([{ emoji: "🧑‍💻", label: "Technologist" }]);
    expect(filterProjectEmojis("🫥")).toEqual([{ emoji: "🫥", label: "Dotted line face" }]);
    expect(filterProjectEmojis("zzzqqq")).toEqual([]);
  });
});
