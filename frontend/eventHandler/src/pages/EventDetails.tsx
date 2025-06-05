import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/EventDetails.css";

type EventType = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_repeated: boolean;
  recurrence_description: string;
};

function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const res = await api.get(`/events/${eventId}/`);
        setEvent(res.data);
      } catch (err) {
        setError("Failed to fetch event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <p>Loading event details...</p>;

  if (error) return <p>{error}</p>;

  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <h1>{event.title}</h1>
      <p>
        <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
      </p>
      <p>
        <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      {event.is_repeated && (
        <p>
          <strong>Recurrence:</strong> {event.recurrence_description}
        </p>
      )}

      <div className="actions">
        <Link to={`/update/${event.id}`} className="update-link">
          Edit Event
        </Link>
        <Link to="/list" className="home-link">
          Home
        </Link>
      </div>
    </div>
  );
}

export default EventDetails;
