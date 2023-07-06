import { useState, useEffect } from "react";

import { DiaryEntry, NewDiaryEntry } from "./types";
import { createDiary, getAllDiaries } from "./diaryService";
import DiaryForm from "./components/DiaryForm";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    })
  }, []);

  const diaryCreation = (object: NewDiaryEntry) => {
    createDiary(object).then(data => {
      setDiaries(diaries.concat(data));
    });
  }

  return (
    <div>
      <h3>Add new diary</h3>
      <DiaryForm diaryCreation={diaryCreation} />
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
