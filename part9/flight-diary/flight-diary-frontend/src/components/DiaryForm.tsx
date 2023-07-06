import { useState } from "react";
import { NewDiaryEntry, Visibility, Weather } from "../types";

interface DiaryFormProps {
  diaryCreation: (object: NewDiaryEntry) => void;
}

interface VisibilityOption {
  value: Visibility;
  label: string;
}

interface WeatherOption {
  value: Weather;
  label: string;
}

const visibilityOptions: VisibilityOption[] = Object.values(Visibility).map(v => ({
  value: v, label: v.toString()
}));

const weatherOptions: WeatherOption[] = Object.values(Weather).map(v => ({
  value: v, label: v.toString()
}));

const DiaryForm = (props: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState(Visibility.Great);
  const [weather, setWeather] = useState(Weather.Sunny);
  const [comment, setComment] = useState('');

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    props.diaryCreation({
      date,
      visibility,
      weather,
      comment
    });

    setDate('');
    setVisibility(Visibility.Great);
    setWeather(Weather.Sunny);
    setComment('');
  };

  return (
    <form onSubmit={addDiary}>
      <div>
        date
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div>
        visibility
        <span style={{marginLeft: '15px'}}>
          {visibilityOptions.map(option =>
            <span key={option.label}>
              {option.label}
              <input
                type="radio"
                name={option.label}
                checked={visibility === option.value}
                onChange={() => setVisibility(option.value)}
              >
              </input>
            </span>
          )}
        </span>
      </div>
      <div>
        weather
        <span style={{marginLeft: '15px'}}>
          {weatherOptions.map(option =>
            <span key={option.label}>
              {option.label}
              <input
                type="radio"
                name={option.label}
                checked={weather === option.value}
                onChange={() => setWeather(option.value)}
              >
              </input>
            </span>
          )}
        </span>
      </div>
      <div>
        comment
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default DiaryForm;