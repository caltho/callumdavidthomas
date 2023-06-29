export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="w-full pb-0 pt-[150px] md:text-center">
      <div className="flex flex-col-reverse">
        Thanks for visiting my portfoliio!
        <br />
        <br />
        <br />
        Copyright {year}
      </div>
    </div>
  );
}
