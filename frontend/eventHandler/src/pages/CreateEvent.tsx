
// const Home = () => {
//   return (
//     <div>Home</div>
//   )
// }

// export default Home

import { useState } from "react";
import api from "../api"; // Axios instance
import { useNavigate } from "react-router-dom";

function CreateEventForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeat, setRepeat] = useState("DAILY");
    const [repeatInterval, setRepeatInterval] = useState(1);
    const [repeatWeekdays, setRepeatWeekdays] = useState<string[]>([]);
    const [repeatMonthWeek, setRepeatMonthWeek] = useState("");
    const [repeatMonthWeekday, setRepeatMonthWeekday] = useState("");
    const [endOption, setEndOption] = useState("never");
    const [repeatEndDate, setRepeatEndDate] = useState("");
    const [repeatCount, setRepeatCount] = useState(1);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const payload: any = {
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            is_repeated: isRecurring, // renamed to match Django model
        };
    
        if (isRecurring) {
            payload.repeat = repeat;
            payload.repeat_interval = repeatInterval;
    
            if (repeat === "WEEKLY") {
                // convert weekday strings to integers
                payload.repeat_weekdays = repeatWeekdays.map(day =>
                    ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].indexOf(day)
                );
            }
    
            if (repeat === "MONTHLY") {
                payload.repeat_month_week = parseInt(repeatMonthWeek, 10);
                payload.repeat_month_weekday = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].indexOf(repeatMonthWeekday);
            }
    
            if (endOption === "on") {
                payload.repeat_end_date = repeatEndDate;
            } else if (endOption === "after") {
                payload.repeat_count = repeatCount;
            }
        }
    
        try {
            await api.post("/events/", payload); // Adjust URL if your endpoint is /events/list/
            navigate("/"); // redirect to Home
        } catch (error: any) {
            console.error("Error creating event:", error.response?.data || error);
            alert("Failed to create event: " + JSON.stringify(error.response?.data));
        }
    };
        const toggleWeekday = (day: string) => {
        setRepeatWeekdays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Create Event</h2>

            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <label>
                <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
                Recurring Event
            </label>

            {isRecurring && (
                <>
                    <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                    </select>

                    <input type="number" value={repeatInterval} onChange={(e) => setRepeatInterval(Number(e.target.value))} />

                    {repeat === "WEEKLY" && (
                        <div>
                            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                                <label key={day}>
                                    <input type="checkbox" checked={repeatWeekdays.includes(day)} onChange={() => toggleWeekday(day)} />
                                    {day}
                                </label>
                            ))}
                        </div>
                    )}

                    {repeat === "MONTHLY" && (
                        <>
                            <input type="number" placeholder="Week of Month" value={repeatMonthWeek} onChange={(e) => setRepeatMonthWeek(e.target.value)} />
                            <input type="text" placeholder="Weekday" value={repeatMonthWeekday} onChange={(e) => setRepeatMonthWeekday(e.target.value)} />
                        </>
                    )}

                    <div>
                        <label>
                            <input type="radio" name="end_option" value="never" checked={endOption === "never"} onChange={() => setEndOption("never")} />
                            Never
                        </label>
                        <label>
                            <input type="radio" name="end_option" value="on" checked={endOption === "on"} onChange={() => setEndOption("on")} />
                            On
                            <input type="date" value={repeatEndDate} onChange={(e) => setRepeatEndDate(e.target.value)} />
                        </label>
                        <label>
                            <input type="radio" name="end_option" value="after" checked={endOption === "after"} onChange={() => setEndOption("after")} />
                            After
                            <input type="number" value={repeatCount} onChange={(e) => setRepeatCount(Number(e.target.value))} />
                            occurrences
                        </label>
                    </div>
                </>
            )}

            <button type="submit">Save Event</button>
        </form>
    );
}

export default CreateEventForm;
