export default function ContactPanel() {
  return (
    <div className="flex flex-row items-center">
      <div className="grow">
        <ArrowIcon />
      </div>
      <a
        href="https://www.linkedin.com/in/callum-thomas/"
        className="flex border-2 rounded-full w-1/3 m-3 p-3 hover:bg-blue-500 cursor-pointer"
      >
        <p className="text-center whitespace-nowrap w-full font-bold">
          LinkedIn
        </p>
      </a>
    </div>
  );
}

const ArrowIcon = () => {
  const color = "white";
  const size = 50;
  const width = size * 8;
  const sWidth: number = 0.99 * width;
  return (
    <svg
      className="stroke-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} 24`}
      fill={color}
      width="100%"
      height="3rem"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.5"
        d={`M${sWidth} 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-${sWidth}v1h21.883z`}
      />
    </svg>
  );
};
