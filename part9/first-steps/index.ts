import { calculateBmi } from './bmiCalculator';
import { calculateExercises, parseExerciseArguments } from './exerciseCalculator';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (_req, res) => {
  const {
    height,
    weight
  } = _req.query

  if (!weight || !height) {
    res.status(400);
    res.send({ error: 'missing parameter height or weight' });
  } else {
    try {

      if(isNaN(Number(height)) || isNaN(Number(weight))){
        throw new Error('malformatted parameters');
      }
      const bmi = calculateBmi(Number(height), Number(weight));
      
      res.send({
        weight: weight,
        height: height,
        bmi: bmi
      });
    } catch (e) {
      res.status(400);
      res.send({ error: e.message });
    }
  }
});

app.post('/exercises', (req, res) => {
  const vDailyHours = req.body.daily_exercises;
  const vTarget = req.body.target;

  if (!vDailyHours || !vTarget) {
    res.status(400);
    res.send({ error: 'missing parameter daily_exercises or target' });
  } else {
    try {
      const { target, dailyHours } = parseExerciseArguments(vTarget, vDailyHours)
      res.send(calculateExercises(target, dailyHours));
    } catch (e) {
      res.status(400);
      res.send({ error: e.message });
    }
  }

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});