const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height * height) / 10000);

  if (bmi >= 40) {
    return "Obese (Class III)";
  } else if (bmi >= 35) {
    return "Obese (Class II)";
  } else if (bmi >= 30) {
    return "Obese (Class I)";
  } else if (bmi >= 25) {
    return "Overweight (Pre-obese)";
  } else if (bmi >= 18.5) {
    return "Normal (healthy weight)";
  } else if (bmi >= 17) {
    return "Underweight (Mild thinness)";
  } else if (bmi >= 16) {
    return "Underweight (Moderate thinness)";
  } else {
    return "Underweight (Severe thinness)";
  }
}

console.log(calculateBmi(180, 74));
