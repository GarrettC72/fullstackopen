interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface exerciseValues {
  target: number;
  dailyExerciseHours: number[];
}

const parseExerciseArguments = (args: string[]): exerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  let target: number;
  if (!isNaN(Number(args[2]))) {
    target = Number(args[2]);
  } else {
    throw new Error('Provided values were not numbers!');
  }

  const dailyExerciseHours: number[] = [];
  for (let i = 3; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error('Provided values were not numbers!');
    }
    dailyExerciseHours.push(Number(args[i]));
  }

  return { target, dailyExerciseHours };
};

const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
): Result => {
  if (target === 0) {
    throw new Error('Target amount of daily hours can not be zero');
  }

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
    ratingDescription = 'not enough daily exercise';
  } else if (ratio < 1) {
    rating = 2;
    ratingDescription = 'no too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'target hours was reached';
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
};

try {
  const { target, dailyExerciseHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(dailyExerciseHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
