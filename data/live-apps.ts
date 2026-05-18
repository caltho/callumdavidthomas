/**
 * Featured live apps for the homepage "in the wild" section.
 * Edit freely — the homepage reads this directly. Order = display order.
 * The first entry takes the wide hero tile.
 */
export type LiveApp = {
  slug: string;
  name: string;
  url: string;
  blurb: string;
  /** Short tag — what is this? */
  kind: string;
  /** Year or year-range, e.g. "2024" or "2022–" */
  year: string;
  /** Optional accent ramp for the card — picked from the design tokens. */
  accent?: "ember" | "ultra" | "halo";
};

export const liveApps: LiveApp[] = [
  {
    slug: "almanac",
    name: "Almanac",
    url: "https://almanac.callumdavidthomas.com",
    blurb: "A personal knowledge base I use every day — notes, links, and recurring rituals, all searchable.",
    kind: "Personal tool",
    year: "2026",
    accent: "ultra",
  },
  {
    slug: "traffic-tools",
    name: "Traffic Tools",
    url: "https://www.traffictools.com.au",
    blurb: "Open-source calculators for traffic engineers and town planners.",
    kind: "Public web app",
    year: "2023–",
    accent: "ember",
  },
  {
    slug: "boatlog",
    name: "Boatlog",
    url: "https://boatlog.callumdavidthomas.com",
    blurb: "Trip logbook for the boat — distance, weather, fuel, crew.",
    kind: "Personal tool",
    year: "2026",
    accent: "halo",
  },
  {
    slug: "sliding-tiles",
    name: "Sliding Tiles",
    url: "https://sliding-puzzle.callumdavidthomas.com",
    blurb: "Retro sliding-tile puzzle with five grid sizes and Unsplash imagery.",
    kind: "Web game",
    year: "2024",
    accent: "ember",
  },
  {
    slug: "connect-five",
    name: "Connect Five",
    url: "https://connect-five.callumdavidthomas.com",
    blurb: "Strategic five-in-a-row on a 19×19 grid. Black vs. white, turn-based.",
    kind: "Web game",
    year: "2024",
    accent: "ultra",
  },
];
