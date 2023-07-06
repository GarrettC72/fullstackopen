import { useState, useEffect } from "react";
import axios from "axios";

import { DiaryEntry, NewDiaryEntry } from "./types";
import { createDiary, getAllDiaries } from "./diaryService";
import DiaryForm from "./components/DiaryForm";
import Notification from "./components/Notification";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    })
  }, []);

  const notify = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }

  const diaryCreation = (object: NewDiaryEntry) => {
    createDiary(object).then(data => {
      setDiaries(diaries.concat(data));
    })
    .catch((error) => {
      if (axios.isAxiosError<string>(error)) {
        console.log(error);
        if (error.response) {
          notify(error.response.data.replace('Something went wrong. ', ''));
        }
      } else {
        console.error(error);
        notify('Unknown error')
      }
    });
  }

  return (
    <div>
      <h3>Add new entry</h3>
      <Notification errorMessage={errorMessage} />
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
