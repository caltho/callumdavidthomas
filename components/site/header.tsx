import Link from "next/link";
import { HeaderStatus } from "./live";

export function BrandMark() {
  return (
    <svg viewBox="0 0 1632 996" aria-hidden="true">
      <path d="M798 825H171V171H1461V825" stroke="currentColor" strokeWidth="300" strokeLinecap="square" fill="none" />
    </svg>
  );
}

const NAV = [
  { n: "01", label: "Work", href: "/#work" },
  { n: "02", label: "CV", href: "/#cv" },
  { n: "03", label: "Proof of humanity", href: "/#proof" },
  { n: "04", label: "Ask Callum", href: "/#ask" },
];

export function Header() {
  return (
    <header className="row head">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Link className="cell brand" href="/" aria-label="Callum Thomas, home">
        <BrandMark />
        Callum Thomas
      </Link>
      <nav className="cell nav" aria-label="Sections">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            <span>{item.n}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <HeaderStatus />
    </header>
  );
}
