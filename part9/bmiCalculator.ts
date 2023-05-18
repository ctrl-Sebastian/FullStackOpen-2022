export const calculateBmi = (height: number, weight: number) => {
  height /= 100
  const bmi = weight / (height*height)
  console.log("bmi: ", bmi);
  
  switch(true) {
    case (bmi < 18.5):
      return "Underweight"

    case (bmi >= 18.5 && bmi <= 24.9):
      return "Normal (healthy weight)";

    case (bmi >= 25 && bmi <= 29.9):
      return "Overweightt"

    case (bmi > 30):
      return "Obesity"

    default:
      throw new Error('Could\'nt calculate bmi');
  }
}

interface ParsedBmiArgs {
  height: number;
  weight: number;
}

export const parseArgumentsBmi = (args: Array<string>): ParsedBmiArgs => {
  if (args.length < 3) throw new Error("Not enough arguments");

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (!isNaN(height) && !isNaN(weight)) {
    return { height, weight };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { height, weight } = parseArgumentsBmi(process.argv);
  console.log(calculateBmi(height, weight));
} catch (e) {
  console.log("An error has occured:", e.message);
  console.log(
    "USAGE: npm run bmi height weight"
  );
}