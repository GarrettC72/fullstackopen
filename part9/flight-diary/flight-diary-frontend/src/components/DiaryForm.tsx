import { useState } from "react";
import { NewDiaryEntry, Visibility, Weather } from "../types";

interface DiaryFormProps {
  diaryCreation: (object: NewDiaryEntry) => void;
}

const DiaryForm = (props: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    props.diaryCreation({
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment
    });

    setDate('');
    setVisibility('');
    setWeather('');
    setComment('');
  };

  return (
    <form onSubmit={addDiary}>
      <div>
        date
        <input
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div>
        visibility
        <input
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
        />
      </div>
      <div>
        weather
        <input
          value={weather}
          onChange={(event) => setWeather(event.target.value)}
        />
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