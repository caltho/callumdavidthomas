/**
 * "Shop" relic: one product, $0, you print it yourself.
 * Half product card, half art piece.
 */
import Image from "next/image";

export function StickerShop() {
  return (
    <div className="grid grid-cols-12 gap-0 overflow-hidden border border-border bg-ink-700/40">
      {/* Preview pane */}
      <div className="col-span-12 flex items-center justify-center bg-bone-50 p-8 md:col-span-7 md:p-12">
        <Image
          src="/cdt-sticker.svg"
          alt="DIY sticker — Callum David Thomas"
          width={800}
          height={240}
          className="h-auto w-full max-w-md"
          priority={false}
          unoptimized
        />
      </div>

      {/* Product detail */}
      <div className="col-span-12 flex flex-col justify-between p-7 md:col-span-5 md:p-10">
        <div>
          <p className="eyebrow flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-ember" aria-hidden />
            Shop · 1 product
          </p>

          <h3 className="font-display mt-6 text-4xl leading-[0.95] text-bone-50 md:text-5xl">
            CDT Sticker<span className="text-ember">.</span>
          </h3>

          <p className="mt-4 text-bone-400">
            Premium adhesive vinyl, hand-die-cut, signed by the artist.{" "}
            <span className="text-bone-200">
              Sourced and assembled by you, at home, with materials of your
              choosing.
            </span>
          </p>

          <ul className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400">
            <li className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <span>SKU</span>
              <span className="text-bone-200">CDT-001</span>
            </li>
            <li className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <span>Edition</span>
              <span className="text-bone-200">001 of ∞</span>
            </li>
            <li className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <span>Material</span>
              <span className="text-bone-200">BYO</span>
            </li>
            <li className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <span>Ship time</span>
              <span className="text-bone-200">~30s</span>
            </li>
          </ul>
        </div>

        <div className="mt-10 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl text-bone-50">$0</span>
            <span className="font-mono text-xs text-bone-600 line-through">
              $15.00
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
              ◉ today only
            </span>
          </div>

          <a
            href="/cdt-sticker.svg"
            download="cdt-sticker.svg"
            className="sweep group inline-flex w-full items-center justify-between border border-border bg-ink-800 px-5 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone-200 transition-colors hover:border-ember/60 hover:text-bone-50"
          >
            <span>↓ Download stencil</span>
            <span className="text-bone-400 group-hover:text-ember">.svg</span>
          </a>

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-600">
            Print, cut, stick. Results not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
