interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
): Result => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter((hours) => hours > 0).length;
  const average =
    dailyExerciseHours.reduce((sum, currentValue) => sum + currentValue, 0) /
    periodLength;
  const success = average >= target;
  const ratio = average / target;
  let rating: number;
  let ratingDescription: string;

  if (ratio < 0.75) {
    rating = 1;
    ratingDescription = "";
  } else if (ratio < 1) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "target hours was reached";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
