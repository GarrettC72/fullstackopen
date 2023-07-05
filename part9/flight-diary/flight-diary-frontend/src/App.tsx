import { useState, useEffect } from "react";

import { DiaryEntry } from "./types";
import { getAllDiaries } from "./diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
  }

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    })
  }, []);

  return (
    <div>
      <h3>Add new diary</h3>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input/>
        </div>
        <div>
          visibility
          <input/>
        </div>
        <div>
          weather
          <input/>
        </div>
        <div>
          comment
          <input/>
        </div>
        <button type="submit">add</button>
      </form>
      <h3>Diary entries</h3>
      {diaries.map(diary => 
        <div key={diary.id}>
          <h4>{diary.date}</h4>
          <div>visibility: {diary.visibility}</div>
          <div>weather: {diary.weather}</div>
        </div>
      )}
    </div>
  );
};

export default App;
