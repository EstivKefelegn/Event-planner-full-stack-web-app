import { useEffect, useState } from "react";
import api from "../api"; 
import { Link } from "react-router-dom";

type EventType = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_repeated: boolean;
  recurrence_description: string;
};

function Home() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/list/"); // Ensure this matches your Django URL conf
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>

      {loading && <p>Loading...</p>}

      {!loading && events.length === 0 && (
        <p className="text-gray-500">No events found.</p>
      )}

      <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="p-4 border rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-blue-700">
              {event.title}
            </h2>
            <p className="text-sm text-gray-600">
              {new Date(event.start_time).toLocaleString()} —{" "}
              {new Date(event.end_time).toLocaleString()}
            </p>
            <p className="mt-1">{event.description}</p>
            <p className="mt-1 italic text-sm text-green-700">
              {event.recurrence_description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create New Event
        </Link>
      </div>
    </div>
  );
}

export default Home;
