export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold  text-orange-400 text-center mt-2">
        Salamander Tracker
      </h1>
      <p className="text-center mx-10">
        Salamander Tracker is a project dedicated to tracking the location of
        salamander through video. You upload a video and the API will track the
        salamander. It will export an excel file of its locations every minute.
      </p>
    </div>
  );
}
