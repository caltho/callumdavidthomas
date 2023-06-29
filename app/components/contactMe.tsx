export default function ContactMe() {
  return (
    <div className="w-full pb-24">
      <h2 className="mt-0 text-4xl font-medium leading-tight text-primary">
        Contact me
      </h2>
      <div className="my-6 h-0.5 w-full bg-neutral-100 opacity-100" />
      <div className="py-6">
        <p className="md:text-center font-medium">
          Send me a message at{" "}
          <a
            href="mailto:callumdavidthomas@gmail.com"
            className="text-blue-300"
          >
            callumdavidthomas@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
