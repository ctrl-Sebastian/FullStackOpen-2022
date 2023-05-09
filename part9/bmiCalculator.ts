const calculateBmi = (height: number, weight: number) => {
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

console.log(calculateBmi(180, 74))