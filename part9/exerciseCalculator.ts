interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const calculateExercises = (target: number, array: number[]): Result => {
  const periodLength = array.length;

  const trainingDays = array.filter((exerciseHour) => exerciseHour > 0).length;

  const average = array.reduce((a, b) => a + b, 0) / array.length;

  const success = average >= target;

  let rating;
  let ratingDescription;

  if (average < target) {
    rating = 1;
    ratingDescription = `not too bad but could be better`;
  } else if (target === average) {
    rating = 2;
    ratingDescription = `Well done, you made it!`;
  } else if (average > target) {
    rating = 3;
    ratingDescription = `Congratulations! you made more work than what you planned`;
  }
  
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

calculateExercises(2, [3, 0, 2, 4.5, 0, 3, 1]);