/**
 * Internet relic: a 4chan-style greentext post.
 * Authentic colours and layout, dropped into the basement frame.
 */

type Greentext = {
  /** Each string is one line. Lines starting with "&gt;" render as greentext. */
  lines: string[];
  /** Optional file attachment metadata, for full chan-board fidelity. */
  attachment?: { filename: string; size: string; dims: string };
  /** Date of post — pure flavour. */
  date?: string;
  /** Post number — also pure flavour. */
  no?: string;
};

const POST: Greentext = {
  attachment: { filename: "cape.jpg", size: "12 KB", dims: "480x640" },
  date: "05/12/26(Tue)",
  no: "4815162342",
  lines: [
    ">be me",
    ">be wearing a cape",
  ],
};

export function GreentextRelic() {
  const { lines, attachment, date, no } = POST;
  return (
    <div className="flex h-full flex-col border border-border bg-ink-700/40">
      <div className="border-b border-border/60 px-6 py-4">
        <p className="eyebrow flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-ember" aria-hidden />
          Greentext · /b/asement
        </p>
      </div>

      {/* The actual 4chan-styled post */}
      <div className="flex-1 p-6 md:p-8">
        <div
          className="font-mono text-sm leading-[1.4]"
          style={{
            // Faithful chan palette — local override only, doesn't bleed.
            background: "#f0e0d6",
            color: "#000000",
            border: "1px solid #d9bfb7",
            padding: "12px 16px",
          }}
        >
          {/* Attachment line */}
          {attachment && (
            <p className="mb-1 text-[12px]">
              <span style={{ fontWeight: 700 }}>File:</span>{" "}
              <span style={{ color: "#34345c", textDecoration: "underline" }}>
                {attachment.filename}
              </span>{" "}
              ({attachment.size}, {attachment.dims})
            </p>
          )}

          {/* Header line: name, date, post no. */}
          <p className="mb-2 text-[12px]">
            <span style={{ color: "#117743", fontWeight: 700 }}>Anonymous</span>{" "}
            {date}{" "}
            <span style={{ color: "#34345c" }}>No.{no}</span>
          </p>

          {/* Greentext body */}
          <div className="space-y-1 text-[14px]">
            {lines.map((line, i) =>
              line.startsWith(">") ? (
                <p key={i} style={{ color: "#789922" }}>
                  {line}
                </p>
              ) : (
                <p key={i}>{line}</p>
              )
            )}
          </div>
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-600">
          (no it&apos;s actually true)
        </p>
      </div>
    </div>
  );
}
