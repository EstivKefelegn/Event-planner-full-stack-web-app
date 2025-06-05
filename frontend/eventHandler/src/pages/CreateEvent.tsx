import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/CreateEvent.css";
import LogoutButton from "../components/LogoutButton";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (startTime && endTime && startTime >= endTime)
      newErrors.endTime = "End time must be after start time.";

    if (isRecurring) {
      if (repeat === "WEEKLY" && repeatWeekdays.length === 0)
        newErrors.repeatWeekdays = "Please select at least one weekday.";

      if (repeat === "MONTHLY") {
        if (!repeatMonthWeek.trim())
          newErrors.repeatMonthWeek = "Week of month is required.";
        if (!repeatMonthWeekday.trim())
          newErrors.repeatMonthWeekday = "Weekday is required.";
      }

      if (endOption === "on" && !repeatEndDate)
        newErrors.repeatEndDate = "End date is required.";

      if (endOption === "after" && (!repeatCount || repeatCount < 1))
        newErrors.repeatCount = "Occurrences must be at least 1.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
        payload.repeat_weekdays = repeatWeekdays.map((day) =>
          ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].indexOf(day)
        );
      }

      if (repeat === "MONTHLY") {
        payload.repeat_month_week = parseInt(repeatMonthWeek, 10);
        payload.repeat_month_weekday = [
          "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN",
        ].indexOf(repeatMonthWeekday);
      }

      if (endOption === "on") {
        payload.repeat_end_date = repeatEndDate;
      } else if (endOption === "after") {
        payload.repeat_count = repeatCount;
      }
    }

    try {
      await api.post("/", payload);
      navigate("/list");
    } catch (error: any) {
      console.error("Error creating event:", error.response?.data || error);
      alert("Failed to create event: " + JSON.stringify(error.response?.data));
    }
  };

  const toggleWeekday = (day: string) => {
    setRepeatWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="form-page">
      <div className="logout-bar" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <LogoutButton />
      </div>
      <form onSubmit={handleSubmit} className="form-container" noValidate>
        <h2>Create Event</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "input-error" : ""}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="start-time">Start Time</label>
        <input
          id="start-time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={errors.startTime ? "input-error" : ""}
        />
        {errors.startTime && <p className="error-text">{errors.startTime}</p>}

        <label htmlFor="end-time">End Time</label>
        <input
          id="end-time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className={errors.endTime ? "input-error" : ""}
        />
        {errors.endTime && <p className="error-text">{errors.endTime}</p>}

        <label htmlFor="is-recurring">
          <input
            id="is-recurring"
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Is Repeated Event
        </label>

        {isRecurring && (
          <>
            <label htmlFor="repeat">Repeat</label>
            <select
              id="repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>

            <label htmlFor="repeat-interval">Repeat Interval</label>
            <input
              id="repeat-interval"
              type="number"
              value={repeatInterval}
              onChange={(e) => setRepeatInterval(Number(e.target.value))}
              min={1}
            />

            {repeat === "WEEKLY" && (
              <div aria-label="Select weekdays">
                <span>Repeat on:</span>
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                  <label key={day} htmlFor={`weekday-${day}`}>
                    <input
                      id={`weekday-${day}`}
                      type="checkbox"
                      checked={repeatWeekdays.includes(day)}
                      onChange={() => toggleWeekday(day)}
                    />
                    {day}
                  </label>
                ))}
                {errors.repeatWeekdays && (
                  <p className="error-text">{errors.repeatWeekdays}</p>
                )}
              </div>
            )}

            {repeat === "MONTHLY" && (
              <>
                <label htmlFor="repeat-month-week">Week of Month</label>
                <input
                  id="repeat-month-week"
                  type="number"
                  value={repeatMonthWeek}
                  onChange={(e) => setRepeatMonthWeek(e.target.value)}
                  className={errors.repeatMonthWeek ? "input-error" : ""}
                />
                {errors.repeatMonthWeek && (
                  <p className="error-text">{errors.repeatMonthWeek}</p>
                )}

                <label htmlFor="repeat-month-weekday">Weekday</label>
                <input
                  id="repeat-month-weekday"
                  type="text"
                  value={repeatMonthWeekday}
                  onChange={(e) => setRepeatMonthWeekday(e.target.value)}
                  className={errors.repeatMonthWeekday ? "input-error" : ""}
                />
                {errors.repeatMonthWeekday && (
                  <p className="error-text">{errors.repeatMonthWeekday}</p>
                )}
              </>
            )}

            <fieldset>
              <legend>End Repeat</legend>

              <label htmlFor="end-never">
                <input
                  id="end-never"
                  type="radio"
                  name="end_option"
                  value="never"
                  checked={endOption === "never"}
                  onChange={() => setEndOption("never")}
                />
                Never
              </label>

              <label htmlFor="end-on">
                <input
                  id="end-on"
                  type="radio"
                  name="end_option"
                  value="on"
                  checked={endOption === "on"}
                  onChange={() => setEndOption("on")}
                />
                On
                <input
                  type="date"
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                  disabled={endOption !== "on"}
                  className={errors.repeatEndDate ? "input-error" : ""}
                />
              </label>
              {errors.repeatEndDate && (
                <p className="error-text">{errors.repeatEndDate}</p>
              )}

              <label htmlFor="end-after">
                <input
                  id="end-after"
                  type="radio"
                  name="end_option"
                  value="after"
                  checked={endOption === "after"}
                  onChange={() => setEndOption("after")}
                />
                After
                <input
                  type="number"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Number(e.target.value))}
                  disabled={endOption !== "after"}
                  min={1}
                  className={errors.repeatCount ? "input-error" : ""}
                />
                occurrences
              </label>
              {errors.repeatCount && (
                <p className="error-text">{errors.repeatCount}</p>
              )}
            </fieldset>
          </>
        )}

        <button type="submit">Save Event</button>
      </form>
    </div>
  );
}

export default CreateEventForm;
