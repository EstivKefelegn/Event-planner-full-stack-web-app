import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../styles/UpdateEvent.css";
import LogoutButton from "../components/LogoutButton";

function UpdateEventForm() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

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
    const [loading, setLoading] = useState(false);

    // New state for form errors
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Load event on mount
    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/events/${eventId}/`);
                const event = res.data;

                setTitle(event.title);
                setDescription(event.description);
                setStartTime(event.start_time);
                setEndTime(event.end_time);
                setIsRecurring(event.is_repeated);

                if (event.is_repeated) {
                    setRepeat(event.repeat);
                    setRepeatInterval(event.repeat_interval);

                    if (event.repeat_weekdays) {
                        const weekdays = event.repeat_weekdays.map((index: number) =>
                            ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index]
                        );
                        setRepeatWeekdays(weekdays);
                    }

                    if (event.repeat_month_week !== undefined) {
                        setRepeatMonthWeek(event.repeat_month_week.toString());
                        setRepeatMonthWeekday(
                            ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][event.repeat_month_weekday]
                        );
                    }

                    if (event.repeat_end_date) {
                        setEndOption("on");
                        setRepeatEndDate(event.repeat_end_date);
                    } else if (event.repeat_count) {
                        setEndOption("after");
                        setRepeatCount(event.repeat_count);
                    }
                }
            } catch (error) {
                console.error("Failed to load event", error);
                // alert("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    // Validation function
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!title.trim()) {
            errors.title = "Title is required.";
        }

        if (!startTime) {
            errors.startTime = "Start time is required.";
        }

        if (!endTime) {
            errors.endTime = "End time is required.";
        }

        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            errors.endTime = "End time must be after start time.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const payload: any = {
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            is_repeated: isRecurring,
        };

        if (isRecurring) {
            payload.repeat = repeat;
            payload.repeat_interval = repeatInterval;

            if (repeat === "WEEKLY") {
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
            await api.put(`/events/${eventId}/`, payload);
            navigate("/list");
        } catch (error: any) {
            console.error("Error updating event:", error.response?.data || error);
            alert("Failed to update event: " + JSON.stringify(error.response?.data));
        } finally {
            setLoading(false);
        }
    };

    const toggleWeekday = (day: string) => {
        setRepeatWeekdays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    if (loading) {
        return <div className="loading-container">Loading event details...</div>;
    }

    return (
        <div className="update-event-container">
            <div className="logout-bar" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <LogoutButton />
            </div>

            <form onSubmit={handleSubmit} className="update-event-form" noValidate>
                <h2 className="form-title">Update Event</h2>

                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`form-input ${formErrors.title ? "error" : ""}`}
                    />
                    {formErrors.title && <span className="error-text">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-textarea"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="start-time">Start Time</label>
                        <input
                            id="start-time"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className={`form-input ${formErrors.startTime ? "error" : ""}`}
                        />
                        {formErrors.startTime && <span className="error-text">{formErrors.startTime}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="end-time">End Time</label>
                        <input
                            id="end-time"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className={`form-input ${formErrors.endTime ? "error" : ""}`}
                        />
                        {formErrors.endTime && <span className="error-text">{formErrors.endTime}</span>}
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <input
                        id="is-recurring"
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <label htmlFor="is-recurring">Is Repeated Event</label>
                </div>

                {isRecurring && (
                    <div className="recurring-options">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="repeat">Repeat</label>
                                <select
                                    id="repeat"
                                    value={repeat}
                                    onChange={(e) => setRepeat(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="repeat-interval">Repeat Interval</label>
                                <input
                                    id="repeat-interval"
                                    type="number"
                                    value={repeatInterval}
                                    onChange={(e) => setRepeatInterval(Number(e.target.value))}
                                    min={1}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {repeat === "WEEKLY" && (
                            <div className="form-group weekday-selector">
                                <label>Repeat on:</label>
                                <div className="weekday-options">
                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                                        <div key={day} className="weekday-option">
                                            <input
                                                id={`weekday-${day}`}
                                                type="checkbox"
                                                checked={repeatWeekdays.includes(day)}
                                                onChange={() => toggleWeekday(day)}
                                            />
                                            <label htmlFor={`weekday-${day}`}>{day}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {repeat === "MONTHLY" && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="repeat-month-week">Week of Month</label>
                                    <input
                                        id="repeat-month-week"
                                        type="number"
                                        placeholder="Week of Month"
                                        value={repeatMonthWeek}
                                        onChange={(e) => setRepeatMonthWeek(e.target.value)}
                                        className="form-input"
                                        min={1}
                                        max={5}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="repeat-month-weekday">Weekday</label>
                                    <select
                                        id="repeat-month-weekday"
                                        value={repeatMonthWeekday}
                                        onChange={(e) => setRepeatMonthWeekday(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">Select weekday</option>
                                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="form-group end-repeat-options">
                            <fieldset>
                                <legend>End Repeat</legend>
                                <div className="radio-options">
                                    <div className="radio-option">
                                        <input
                                            id="end-never"
                                            type="radio"
                                            name="end_option"
                                            value="never"
                                            checked={endOption === "never"}
                                            onChange={() => setEndOption("never")}
                                        />
                                        <label htmlFor="end-never">Never</label>
                                    </div>

                                    <div className="radio-option">
                                        <input
                                            id="end-on"
                                            type="radio"
                                            name="end_option"
                                            value="on"
                                            checked={endOption === "on"}
                                            onChange={() => setEndOption("on")}
                                        />
                                        <label htmlFor="end-on">On</label>
                                        <input
                                            type="date"
                                            value={repeatEndDate}
                                            onChange={(e) => setRepeatEndDate(e.target.value)}
                                            disabled={endOption !== "on"}
                                            className="form-input date-input"
                                        />
                                    </div>

                                    <div className="radio-option">
                                        <input
                                            id="end-after"
                                            type="radio"
                                            name="end_option"
                                            value="after"
                                            checked={endOption === "after"}
                                            onChange={() => setEndOption("after")}
                                        />
                                        <label htmlFor="end-after">After</label>
                                        <input
                                            type="number"
                                            value={repeatCount}
                                            onChange={(e) => setRepeatCount(Number(e.target.value))}
                                            disabled={endOption !== "after"}
                                            min={1}
                                            className="form-input count-input"
                                        />
                                        <span>occurrences</span>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Updating..." : "Update Event"}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/list")}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateEventForm;


