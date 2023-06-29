export default function PageTitle() {
  return (
    <div className="flex-column w-full items-center">
      <div className="flex flex-row items-center mb-2">
        <h2 className="flex text-lg md:text-2xl lg:text-3xl 2xl:text-4xl">
          hello, my name is
        </h2>
        <div className="grow ml-2 h-[1rem] md:h-[1.5rem] lg:h-[1.7rem] 2xl:h-[2rem] rounded-full bg-blue-500" />
      </div>
      <div className="flex flex-row items-center">
        <div className="grow mr-2 h-[1.6rem] md:h-[3.4rem] lg:h-[4.0rem] 2xl:h-[5rem] rounded-full bg-blue-500" />
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl 2xl:text-8xl">
          Callum Thomas
        </h1>
      </div>
    </div>
  );
}
