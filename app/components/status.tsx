export default function Status() {
  return (
    <a
      href="https://www.linkedin.com/in/callum-thomas/"
      className="border-2 rounded-full p-3 flex items-center"
      target="_blank"
    >
      <img
        className="inline-block h-14 w-14 rounded-full"
        src="profile photo.jfif"
        alt=""
      />
      <div className="inline-block h-4 w-4 rounded-full bg-green-500 ml-6 mr-6" />
      <h3 className="mr-6 font-semibold text-lg">Available</h3>
    </a>
  );
}
