import { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/EventList.css";
import LogoutButton from "../components/LogoutButton";

type EventType = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_repeated: boolean;
  recurrence_description: string;
};

function EventList() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const goToDetails = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };

  const handleUpdate = (eventId: number) => {
    navigate(`/update/${eventId}`);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}/`);
      setEvents(events.filter(event => event.id !== eventId)); // Update UI
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Failed to delete event");
    }
  };

  const oneTimeEvents = events.filter((e) => !e.is_repeated);
  const repeatedEvents = events.filter((e) => e.is_repeated);

  return (
    <div className="container">

      <div
        className="logout-bar"
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}
      >
        <LogoutButton />
      </div>

      <h1>Upcoming Events</h1>

      {loading && <p className="loading">Loading...</p>}

      {!loading && (
        <>
          <section>
            <h2 className="section-title">One-Time Events</h2>
            <ul className="event-list">
              {oneTimeEvents.map((event) => (
                <li key={event.id} className="event-item">
                  <div
                    className="event-content clickable"
                    onClick={() => goToDetails(event.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") goToDetails(event.id);
                    }}
                  >
                    <h2>{event.title}</h2>
                    <time>
                      {new Date(event.start_time).toLocaleString()} — {new Date(event.end_time).toLocaleString()}
                    </time>
                    <p className="description">{event.description}</p>
                  </div>
                  <button
                    onClick={() => handleUpdate(event.id)}
                    className="update-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {oneTimeEvents.length === 0 && <p className="no-events">No one-time events.</p>}
            </ul>
          </section>

          <section>
            <h2 className="section-title">Recurring Events</h2>
            <ul className="event-list">
              {repeatedEvents.map((event) => (
                <li key={event.id} className="event-item">
                  <div
                    className="event-content clickable"
                    onClick={() => goToDetails(event.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") goToDetails(event.id);
                    }}
                  >
                    <h2>{event.title}</h2>
                    <time>
                      {new Date(event.start_time).toLocaleString()} — {new Date(event.end_time).toLocaleString()}
                    </time>
                    <p className="description">{event.description}</p>
                    <p className="recurrence">{event.recurrence_description}</p>
                  </div>
                  <button
                    onClick={() => handleUpdate(event.id)}
                    className="update-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {repeatedEvents.length === 0 && <p className="no-events">No recurring events.</p>}
            </ul>
          </section>
        </>
      )}

      <div className="action-buttons">
        <Link to="/create" className="create-event-link">
          + Create New Event
        </Link>
      </div>
    </div>
  );
}

export default EventList;



// import { useEffect, useState } from "react";
// import api from "../api";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/EventList.css";
// import LogoutButton from "../components/LogoutButton";

// type EventType = {
//     id: number;
//     title: string;
//     description: string;
//     start_time: string;
//     end_time: string;
//     is_repeated: boolean;
//     recurrence_description: string;
// };

// function EventList() {
//     const [events, setEvents] = useState<EventType[]>([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const res = await api.get("/events");
//                 setEvents(res.data);
//             } catch (err) {
//                 console.error("Failed to fetch events", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchEvents();
//     }, []);

//     const handleUpdate = (eventId: number) => {
//         navigate(`/update/${eventId}`);
//     };


//     const handleDelete = async (eventId: number) => {
//         if (!window.confirm("Are you sure you want to delete this event?")) {
//             return;
//         }

//         try {
//             await api.delete(`/events/${eventId}/`);
//             setEvents(events.filter(event => event.id !== eventId));  // Update UI
//         } catch (err) {
//             console.error("Failed to delete event", err);
//             alert("Failed to delete event");
//         }
//     };


//     const oneTimeEvents = events.filter((e) => !e.is_repeated);
//     const repeatedEvents = events.filter((e) => e.is_repeated);

//     return (

//         <div className="container">

//             <div className="logout-bar" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
//                 <LogoutButton />
//             </div>
//             <h1>Upcoming Events</h1>

//             {loading && <p className="loading">Loading...</p>}


//             {!loading && (
//                 <>
//                     <section>
//                         <h2 className="section-title">One-Time Events</h2>
//                         <ul className="event-list">
//                             {oneTimeEvents.map((event) => (
//                                 <li key={event.id} className="event-item">
//                                     <div className="event-content">
//                                         <h2>{event.title}</h2>
//                                         <time>
//                                             {new Date(event.start_time).toLocaleString()} — {new Date(event.end_time).toLocaleString()}
//                                         </time>
//                                         <p className="description">{event.description}</p>
//                                     </div>
//                                     <button
//                                         onClick={() => handleUpdate(event.id)}
//                                         className="update-button"
//                                     >
//                                         Update
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(event.id)}
//                                         className="delete-button"
//                                     >
//                                         Delete
//                                     </button>
//                                 </li>
//                             ))}
//                             {oneTimeEvents.length === 0 && <p className="no-events">No one-time events.</p>}
//                         </ul>
//                     </section>

//                     <section>
//                         <h2 className="section-title">Recurring Events</h2>
//                         <ul className="event-list">
//                             {repeatedEvents.map((event) => (
//                                 <li key={event.id} className="event-item">
//                                     <div className="event-content">
//                                         <h2>{event.title}</h2>
//                                         <time>
//                                             {new Date(event.start_time).toLocaleString()} — {new Date(event.end_time).toLocaleString()}
//                                         </time>
//                                         <p className="description">{event.description}</p>
//                                         <p className="recurrence">{event.recurrence_description}</p>
//                                     </div>
//                                     <button
//                                         onClick={() => handleUpdate(event.id)}
//                                         className="update-button"
//                                     >
//                                         Update
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(event.id)}
//                                         className="delete-button"
//                                     >
//                                         Delete
//                                     </button>
//                                 </li>
//                             ))}
//                             {repeatedEvents.length === 0 && <p className="no-events">No recurring events.</p>}
//                         </ul>
//                     </section>
//                 </>
//             )}

//             <div className="action-buttons">
//                 <Link to="/create" className="create-event-link">
//                     + Create New Event
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default EventList;