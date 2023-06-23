import Image from "next/image";
import React, { ReactNode } from "react";

interface WorkPanelProps {
  image: string;
  title: string;
  techStack: string[];
  children?: ReactNode;
}

export default function WorkPanel({
  image,
  title,
  techStack,
  children,
}: WorkPanelProps) {
  return (
    <div className="flex flex-row py-6">
      <div className="invisible w-0 md:w-1/4 md:visible md:pr-6 lg:pr-12">
        <img src={image} alt="logo" className="w-full w-[300px]" />
      </div>
      <div className="flex-initial w-full md:w-3/4">
        <div className="flex-column">
          <div className="mb-2 mt-0 text-3xl font-medium leading-tight text-primary">
            {title}
          </div>
          <div className="flex flex-row py-3">
            {techStack.map((tech, item) => (
              <div className="flex items-center" key={item}>
                <div className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2" />
                <h3 className="mr-6">{tech}</h3>
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
