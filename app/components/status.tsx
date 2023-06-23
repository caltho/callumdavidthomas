export default function Status() {
  return (
    <div className="border-2 rounded-full p-3 flex items-center">
      <img
        className="inline-block h-14 w-14 rounded-full"
        src="profile photo.jfif"
        alt=""
      />
      <div className="inline-block h-3 w-3 rounded-full bg-green-500 ml-6 mr-6" />
      <h3 className="mr-6">Available</h3>
    </div>
  );
}
