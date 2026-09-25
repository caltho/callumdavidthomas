import { Stamp } from "./stamp";

/** The drawing's title block, used as the footer on every page. */
export function TitleBlock({
  drawing = "Homepage",
  stamp = { top: "Issued for", main: "World Wide Web" },
}: {
  drawing?: string;
  stamp?: { top: string; main: string };
}) {
  return (
    <footer>
      <div className="row tb">
        <div className="cell">
          <p className="label">Project</p>
          <p className="v">callum-thomas.com</p>
        </div>
        <div className="cell">
          <p className="label">Drawing</p>
          <p className="v">{drawing}</p>
        </div>
        <div className="cell">
          <p className="label">Drawn</p>
          <p className="v">
            C. Thomas <small>(human)</small>
          </p>
        </div>
        <div className="cell">
          <p className="label">Checked</p>
          <p className="v">
            Claude <small>(not human)</small>
          </p>
        </div>
        <div className="cell">
          <p className="label">Scale</p>
          <p className="v">1:1</p>
        </div>
        <div className="cell">
          <p className="label">Rev</p>
          <p className="v">26.09</p>
        </div>
        <div className="cell">
          <p className="label">Status</p>
          <Stamp top={stamp.top} main={stamp.main} interactive />
        </div>
      </div>
      <div className="colophon">
        <span className="label">© 2026 Callum Thomas · Written by a human, proofread by a machine</span>
        <span className="label">No cookies. No tracking. No terminal.</span>
      </div>
    </footer>
  );
}
