  interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number | undefined;
    ratingDescription: string | undefined;
    target: number;
    average: number;
  }

export const calculateExercises = (target: number, array: number[]): Result => {
  const periodLength = array.length;

  const trainingDays = array.filter((exerciseHour) => exerciseHour > 0).length;

  const average = array.reduce((a, b) => a + b, 0) / array.length;

  const success = average >= target;

  let rating;
  let ratingDescription;

  if (average < target) {
    rating = 1;
    ratingDescription = `bad`;
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
interface ParsedExerciseArgs {
  target: number;
  dailyHours: number[];
}
const parseArguments = (args: Array<string>): ParsedExerciseArgs => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  let dailyHours = args.slice(3).map((hours) => Number(hours));
  const hasNaNInDailyHours = dailyHours.some((hours) => isNaN(hours));

  if (isNaN(target) || hasNaNInDailyHours) {
    throw new Error("Please provide arguments as numbers");
  }

  const hasInvalidDailyHours = dailyHours.some((hours) => hours > 24);

  if (target > 24 || hasInvalidDailyHours) {
    throw new Error("Maximum hours per day is 24");
  }

  return { target, dailyHours };
};

export const parseExerciseArguments = ( target: number, dailyHours: Array<number> ): ParsedExerciseArgs => {
  if (!isNaN(target) && !dailyHours.some(isNaN)) {
    return {
      target: target,
      dailyHours: dailyHours
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { target, dailyHours } = parseArguments(process.argv);
  console.log(calculateExercises(target, dailyHours));
} catch (e) {
  console.log("An error has occured:", e.message);
  console.log(
    "USAGE: npm run exer target(hrs) dailyHours(hrs)[]"
  );
  console.log("dailyHours is space separated hours exercised per day");
}