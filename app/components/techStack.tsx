import {
  TbBrandCss3,
  TbBrandFirebase,
  TbBrandJavascript,
  TbBrandMysql,
  TbBrandNextjs,
  TbBrandPhp,
  TbBrandReact,
  TbHtml,
} from "react-icons/tb";

const icons = [
  { icon: TbBrandReact, name: "React" },
  { icon: TbBrandNextjs, name: "Nextjs" },
  { icon: TbBrandCss3, name: "CSS" },
  { icon: TbBrandFirebase, name: "Firebase" },
  { icon: TbHtml, name: "HTML" },
  { icon: TbBrandJavascript, name: "Javascript" },
  { icon: TbBrandMysql, name: "MySql" },

  { icon: TbBrandPhp, name: "PhP" },
];
export default function TechStack() {
  return (
    <div className="w-full">
      <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">
        Tech Stack
      </h2>
      <div className="my-6 h-0.5 w-full bg-neutral-100 opacity-100" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 justify-items-center">
        {icons.map((icon, item) => (
          <div className="flex justify-center" key={item}>
            <CustomIcon IconName={icon.icon} title={icon.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

type IconNameProps = {
  size: string;
};

type CustomIcon = {
  IconName: React.FunctionComponent<IconNameProps>;
  title: string;
};

const CustomIcon = ({ IconName, title }: CustomIcon) => {
  return (
    <div className="flex-column">
      <div className="flex justify-center font-large">
        <IconName size="60" />
      </div>
      <h4 className="text-center">{title}</h4>
    </div>
  );
};
