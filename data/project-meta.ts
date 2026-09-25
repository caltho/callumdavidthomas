/**
 * Presentation extras for projects that the database doesn't store: which
 * filter a project sits under, and which screenshot to show on hover.
 * Anything not listed here is a personal project with no preview.
 */
import type { WorkItem } from "@/components/site/work-list";

export const PROJECT_META: Record<string, { kind?: WorkItem["kind"]; peek?: string; title?: string }> = {
  "whats-cyber-terminal": { peek: "/images/whats-cyber-terminal.jpg" },
  "quality-management-system": { kind: "work", peek: "/images/rje/QMS (4).png" },
  "rje-global-csv-tool": { kind: "work" },
  centresafe: { kind: "work", peek: "/images/centresafe/CentreSafe Web Design.png" },
  "centresafe-web-design": { kind: "work", peek: "/images/centresafe/CS - Centres.png" },
  "amber-wordpress-plugin": { kind: "work" },
  "project-folder-shortcut": { kind: "work" },
  "outlook-filing-macro": { kind: "work" },
  "nzopa-revamp": { kind: "client" },
  "modal-group-replatform": { kind: "client" },
  "traffic-tools": { peek: "/images/traffictools/TT - Turn Treatment Calculator.png" },
  "connect-five": { peek: "/images/connect-five-3.png" },
  "sliding-tiles-puzzle": { peek: "/images/sliding-tiles/sliding-tiles-2.png" },
  portfolio: { title: "This site" },
};
