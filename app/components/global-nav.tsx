"use client";
import { TbExternalLink, TbX } from "react-icons/tb";

import Link from "next/link";
import { useState } from "react";

const menuSections = [
  {
    name: "Quick links",
    items: [
      { name: "Welcome", link: "#welcome" },
      { name: "About", link: "#about" },
      { name: "My Work", link: "#my-work" },
      { name: "Tech Stack", link: "#tech-stack" },
      { name: "Contact", link: "#contact" },
    ],
  },
];

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="invisible fixed h-0 top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:visible lg:bottom-0 lg:z-auto lg:w-72 lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex h-14 items-center py-4 px-4 lg:h-auto"></div>

      <div className="">
        <nav className="space-y-6 px-2 py-5">
          {menuSections.map((section) => {
            return (
              <div key={section.name}>
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                  <div>{section.name}</div>
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <GlobalNavItem key={item.slug} item={item} close={close} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function GlobalNavItem({
  item,
  close,
}: {
  item: Item;
  close: () => false | void;
}) {
  const isActive = false;
  return (
    <a
      href={item.link}
      className="block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300 text-white"
    >
      {item.name}
    </a>
  );
}
