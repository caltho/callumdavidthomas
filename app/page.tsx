import React from "react";
import PageTitle from "./components/pageTitle";
import AboutMe from "./components/aboutMe";
import Status from "./components/status";
import ContactPanel from "./components/contactPanel";
import MyWork from "./components/myWork";
import TechStack from "./components/techStack";
import ContactMe from "./components/contactMe";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  const varb = "TbBrandCss3";
  return (
    <div className="flex-column">
      <div className="flex pb-6" id="welcome">
        <Status />
      </div>
      <div className="flex py-6">
        <PageTitle />
      </div>
      <div className="flex py-6" id="about">
        <AboutMe />
      </div>
      <div className="flex py-6">
        <ContactPanel />
      </div>
      <div className="flex py-6" id="my-work">
        <MyWork />
      </div>
      <div className="flex py-6" id="tech-stack">
        <TechStack />
      </div>
      <div className="flex py-6" id="contact">
        <ContactMe />
      </div>
    </div>
  );
}
