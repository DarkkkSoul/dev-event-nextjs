import ExploreBtn from "@/components/ExploreBtn";

export default function Home() {
  return (
    <section>
      <h1 className="text-center">The hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, meetups, conferences, all in one place.</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {
            [1,2,3,4,5].map((item) => (
              <li key={item}>Event {item}</li>
            ))
          }
        </ul>
      </div>
    </section>
  );
}
