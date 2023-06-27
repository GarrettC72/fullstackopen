import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  try {
    if (!height || !weight) {
      throw new Error('missing height or weight');
    }
    
    if (isNaN(Number(height)) || isNaN(Number(weight))) {
      throw new Error('malformatted parameters');
    }
  
    const heightValue = Number(height);
    const weightValue = Number(weight);
    const bmi = calculateBmi(heightValue, weightValue);
  
    res.json({
      weight: weightValue,
      height: heightValue,
      bmi
    });
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  try {
    if (!daily_exercises || !target) {
      throw new Error('parameters missing');
    }

    if (isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.length === 0 ||
    daily_exercises.some(el => isNaN(Number(el)))) {
      throw new Error('malformatted parameters');
    }

    res.send(calculateExercises(daily_exercises as number[], Number(target)));
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});