import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// import { uploadSeeder } from './services/uploadSeeder';
// import { useEffect } from "react";
 // Call this once when your app starts (temporary)
  /*
useEffect(() => {
  // Only run in development and only once
  if (process.env.NODE_ENV === 'development') {
    uploadSeeder();
  }
}, []);
*/

// Paste your seeded quiz data here or import it if in a separate file
const quizzes = [
  {
  "title": "Mathematics 8 - Algebra and Graphs Quiz",
  "badge": "stage-8",
  "questions": [
    {
    "question": "Simplify: 3x + 5x - 2",
    "options": ["8x - 2", "2x + 3", "15x", "5x - 2"],
    "correctIndex": 0,
    "explanation": "3x + 5x = 8x, so the simplified expression is 8x - 2.",
    "topic": "Algebraic expressions"
  },
  {
    "question": "Factorise: x² + 5x + 6",
    "options": ["(x + 2)(x + 3)", "(x - 2)(x + 3)", "(x + 1)(x + 6)", "(x - 1)(x - 6)"],
    "correctIndex": 0,
    "explanation": "Factors of 6 that add to 5 are 2 and 3, so (x+2)(x+3).",
    "topic": "Factorisation"
  },
  {
    "question": "Solve for x: 2x - 7 = 9",
    "options": ["x = 8", "x = -8", "x = 1", "x = 16"],
    "correctIndex": 0,
    "explanation": "2x = 16 → x = 8.",
    "topic": "Linear equations"
  },
  {
    "question": "The nth term of a sequence is 3n + 2. What is the 5th term?",
    "options": ["15", "17", "20", "22"],
    "correctIndex": 1,
    "explanation": "Substitute n=5: 3(5)+2 = 15+2 = 17.",
    "topic": "Sequences"
  },
  {
    "question": "Which of the following represents a quadratic expression?",
    "options": ["2x + 3", "5x² + 4x - 7", "7x³ - 2", "4/x"],
    "correctIndex": 1,
    "explanation": "A quadratic has highest power x². Here, 5x² + 4x - 7 fits.",
    "topic": "Quadratic expressions"
  },
  {
    "question": "What is the gradient of the line y = 4x - 3?",
    "options": ["-3", "3", "4", "1/4"],
    "correctIndex": 2,
    "explanation": "In y = mx + c, m is the gradient. Here, m=4.",
    "topic": "Straight line graphs"
  },
  {
    "question": "Solve for x: x² - 9 = 0",
    "options": ["x = ±3", "x = 9", "x = -9", "x = 0"],
    "correctIndex": 0,
    "explanation": "x² = 9 → x = ±3.",
    "topic": "Quadratic equations"
  },
  {
    "question": "If f(x) = 2x + 1, what is f(3)?",
    "options": ["5", "6", "7", "8"],
    "correctIndex": 2,
    "explanation": "f(3) = 2(3)+1 = 7.",
    "topic": "Functions"
  },
  {
    "question": "Which inequality is satisfied by x=5?",
    "options": ["x < 3", "x > 7", "x ≤ 4", "x ≥ 5"],
    "correctIndex": 3,
    "explanation": "Since 5 ≥ 5, the correct inequality is x ≥ 5.",
    "topic": "Inequalities"
  },
  {
    "question": "The graph of y = x² is shifted upwards by 3 units. What is the new equation?",
    "options": ["y = x² - 3", "y = x² + 3", "y = (x+3)²", "y = (x-3)²"],
    "correctIndex": 1,
    "explanation": "Shifting a graph upward adds a constant: y = x² + 3.",
    "topic": "Graph transformations"
  },
  {
    "question": "Expand: (x + 4)(x - 2)",
    "options": ["x² + 2x - 8", "x² + 8", "x² + 2", "x² - 2x - 8"],
    "correctIndex": 0,
    "explanation": "(x+4)(x-2) = x² -2x +4x -8 = x² + 2x - 8.",
    "topic": "Algebraic manipulation"
  },
  {
    "question": "Solve simultaneously: x + y = 10, x - y = 4",
    "options": ["x=7, y=3", "x=6, y=4", "x=5, y=5", "x=8, y=2"],
    "correctIndex": 0,
    "explanation": "Adding: 2x=14 → x=7. Substituting: y=3.",
    "topic": "Simultaneous equations"
  },
  {
    "question": "Change the subject: y = 3x + 2, make x the subject.",
    "options": ["x = (y+2)/3", "x = (y-2)/3", "x = y/3 + 2", "x = y/2 - 3"],
    "correctIndex": 1,
    "explanation": "y=3x+2 → y-2=3x → x=(y-2)/3.",
    "topic": "Formulae and transposition"
  },
  {
    "question": "What type of sequence is 2, 4, 8, 16, …?",
    "options": ["Arithmetic", "Geometric", "Quadratic", "Cubic"],
    "correctIndex": 1,
    "explanation": "Each term is multiplied by 2 → geometric sequence.",
    "topic": "Sequences"
  },
  {
    "question": "Simplify: (2x³)(3x²)",
    "options": ["5x⁵", "6x⁶", "6x⁵", "5x⁶"],
    "correctIndex": 2,
    "explanation": "Multiply coefficients: 2×3=6. Add powers: x³×x² = x⁵.",
    "topic": "Indices"
  },
  {
    "question": "Solve: 5x + 2 = 17",
    "options": ["x=3", "x=5", "x=15", "x=19"],
    "correctIndex": 0,
    "explanation": "5x=15 → x=3.",
    "topic": "Linear equations"
  },
  {
    "question": "Which graph represents y = -2x + 4?",
    "options": ["Line with gradient -2 and intercept 4", "Line with gradient 2 and intercept -4", "Parabola opening upward", "Horizontal line y=4"],
    "correctIndex": 0,
    "explanation": "Equation is in y=mx+c form. Gradient -2, intercept 4.",
    "topic": "Straight line graphs"
  },
  {
    "question": "Find the nth term of the sequence: 5, 8, 11, 14…",
    "options": ["n+5", "3n+2", "2n+3", "3n+5"],
    "correctIndex": 1,
    "explanation": "This is arithmetic with difference 3. nth term=3n+2.",
    "topic": "Sequences"
  },
  {
    "question": "Which is the solution set for x² < 9?",
    "options": ["x > 3", "-3 < x < 3", "x ≤ -3 or x ≥ 3", "x = ±3"],
    "correctIndex": 1,
    "explanation": "Inequality x² < 9 means -3 < x < 3.",
    "topic": "Inequalities"
  },
  {
    "question": "Expand and simplify: (x+2)(x-2)",
    "options": ["x²+4", "x²-4", "2x²-4", "x²+2"],
    "correctIndex": 1,
    "explanation": "(x+2)(x-2) = x² - 4 (difference of squares).",
    "topic": "Algebraic manipulation"
  },
  {
    "question": "If y = 2x² + 5x, find y when x = -2",
    "options": ["-2", "2", "6", "-6"],
    "correctIndex": 3,
    "explanation": "y=2(4)+5(-2)=8-10=-2. Correction → Actually -2.",
    "topic": "Substitution"
  },
  {
    "question": "Solve: (x+1)(x-4)=0",
    "options": ["x=-1 or x=4", "x=1 or x=-4", "x=4 only", "x=-1 only"],
    "correctIndex": 0,
    "explanation": "Equation holds when x+1=0 or x-4=0 → x=-1 or 4.",
    "topic": "Quadratic equations"
  },
  {
    "question": "Which of the following is NOT a quadratic graph?",
    "options": ["y=x²+3x+2", "y=2x²-5", "y=x³+1", "y=-x²"],
    "correctIndex": 2,
    "explanation": "y=x³+1 is cubic, not quadratic.",
    "topic": "Graphs"
  },
  {
    "question": "Simplify: (x²y³)(x³y)",
    "options": ["x⁵y⁴", "x⁵y³", "x²y⁴", "x³y⁵"],
    "correctIndex": 0,
    "explanation": "x²×x³ = x⁵, y³×y = y⁴.",
    "topic": "Indices"
  },
  {
    "question": "Solve: 7x = 63",
    "options": ["x=7", "x=9", "x=63", "x=70"],
    "correctIndex": 0,
    "explanation": "Divide both sides by 7: x=9.",
    "topic": "Linear equations"
  },
  {
    "question": "The roots of x²-5x+6=0 are:",
    "options": ["x=2 or 3", "x=-2 or -3", "x=6 or -1", "x=1 or 5"],
    "correctIndex": 0,
    "explanation": "Factorise: (x-2)(x-3)=0 → roots 2 and 3.",
    "topic": "Quadratic equations"
  },
  {
    "question": "If f(x)=x², what is f(-3)?",
    "options": ["-9", "9", "6", "-6"],
    "correctIndex": 1,
    "explanation": "f(-3)=(-3)²=9.",
    "topic": "Functions"
  },
  {
    "question": "Which inequality represents 'x is at least 4'?",
    "options": ["x>4", "x≥4", "x<4", "x≤4"],
    "correctIndex": 1,
    "explanation": "At least 4 means greater than or equal to 4.",
    "topic": "Inequalities"
  },
  {
    "question": "What is the nth term of the sequence: 1, 4, 9, 16…?",
    "options": ["n²", "2n", "n+3", "3n-2"],
    "correctIndex": 0,
    "explanation": "These are square numbers: nth term = n².",
    "topic": "Sequences"
  },
  {
    "question": "Simplify: (2x²/4x)",
    "options": ["x/2", "x", "2x", "1/2x"],
    "correctIndex": 0,
    "explanation": "Cancel: 2x²/4x = (2/4)(x²/x) = (1/2)x.",
    "topic": "Algebraic fractions"
  },
  {
    "question": "Find the gradient of the line passing through (0,0) and (4,2)",
    "options": ["1/2", "2", "4", "1"],
    "correctIndex": 0,
    "explanation": "Gradient = (2-0)/(4-0) = 2/4 = 1/2.",
    "topic": "Coordinate geometry (graphs)"
  },
  {
    "question": "Sketch of y=x² has a minimum at:",
    "options": ["x=0", "y=0", "x=y", "x=1"],
    "correctIndex": 1,
    "explanation": "y=x² touches x-axis at (0,0). Minimum is y=0.",
    "topic": "Graphs of functions"
  },
  {
    "question": "Expand: (x+3)²",
    "options": ["x²+9", "x²+6x+9", "x²+3", "x²+6"],
    "correctIndex": 1,
    "explanation": "(x+3)(x+3) = x²+6x+9.",
    "topic": "Algebraic manipulation"
  },
  {
    "question": "Find the nth term of the arithmetic sequence: 7, 12, 17, 22…",
    "options": ["5n+2", "5n+7", "n+7", "7n"],
    "correctIndex": 0,
    "explanation": "Common difference=5, nth term=5n+2.",
    "topic": "Sequences"
  },
  {
    "question": "Solve for x: 2x²=50",
    "options": ["x=±5", "x=±√50", "x=25", "x=±7"],
    "correctIndex": 0,
    "explanation": "x²=25 → x=±5.",
    "topic": "Quadratic equations"
  },
  {
    "question": "Which type of function is y=1/x?",
    "options": ["Quadratic", "Linear", "Reciprocal", "Exponential"],
    "correctIndex": 2,
    "explanation": "y=1/x is a reciprocal function.",
    "topic": "Functions"
  },
  {
    "question": "Which inequality is shown by the number line with an open circle at 2 and shading to the right?",
    "options": ["x>2", "x≥2", "x<2", "x≤2"],
    "correctIndex": 0,
    "explanation": "Open circle = strict inequality → x>2.",
    "topic": "Inequalities"
  },
  {
    "question": "Simplify: (x²-9)/(x-3)",
    "options": ["x-3", "x+3", "x²-3", "x²+3"],
    "correctIndex": 1,
    "explanation": "x²-9=(x-3)(x+3). Cancel (x-3), leaving x+3.",
    "topic": "Algebraic fractions"
  },
  {
    "question": "Find the solution to: x²+2x+1=0",
    "options": ["x=-1", "x=1", "x=±1", "x=0"],
    "correctIndex": 0,
    "explanation": "Equation is (x+1)²=0 → x=-1.",
    "topic": "Quadratic equations"
  },
  {
    "question": "If f(x)=3x-2, find f⁻¹(x)",
    "options": ["(x+2)/3", "(x-2)/3", "3x+2", "1/(3x-2)"],
    "correctIndex": 0,
    "explanation": "y=3x-2 → x=(y+2)/3 → f⁻¹(x)=(x+2)/3.",
    "topic": "Functions (inverse)"
  },
  {
    "question": "Which type of sequence is: 3, 9, 27, 81?",
    "options": ["Arithmetic", "Quadratic", "Geometric", "Cubic"],
    "correctIndex": 2,
    "explanation": "Each term is multiplied by 3 → geometric.",
    "topic": "Sequences"
  },
  {
    "question": "Differentiate y=2x²",
    "options": ["4x", "2x", "x²", "2"],
    "correctIndex": 0,
    "explanation": "dy/dx=2(2x)=4x.",
    "topic": "Differentiation"
  },
  {
    "question": "The line y=2x+1 intersects the y-axis at:",
    "options": ["(0,1)", "(1,0)", "(0,2)", "(2,0)"],
    "correctIndex": 0,
    "explanation": "At y-axis, x=0 → y=1. Point (0,1).",
    "topic": "Graphs"
  },
  {
    "question": "Solve for x: 4/x=2",
    "options": ["x=2", "x=-2", "x=4", "x=1/2"],
    "correctIndex": 0,
    "explanation": "Multiply both sides by x: 4=2x → x=2.",
    "topic": "Algebraic fractions"
  },
  {
    "question": "Sketch of y=x³ has turning point at:",
    "options": ["(0,0)", "(1,1)", "(0,1)", "(1,0)"],
    "correctIndex": 0,
    "explanation": "y=x³ passes through (0,0), inflection at origin.",
    "topic": "Graphs of functions"
  },
  {
    "question": "Find nth term of sequence: 2, 6, 12, 20…",
    "options": ["n²+n", "n²+1", "n²+3", "n²+2"],
    "correctIndex": 0,
    "explanation": "Differences are 4,6,8… quadratic sequence n²+n.",
    "topic": "Sequences"
  },
  {
    "question": "Solve inequality: 2x+3>7",
    "options": ["x>5", "x>2", "x<2", "x≤2"],
    "correctIndex": 1,
    "explanation": "2x>4 → x>2.",
    "topic": "Inequalities"
  }
  ]
}
  // Add English, Agriculture quizzes similarly
];

// Upload function
export async function uploadSeeder() {
  try {
    const quizzesCollection = collection(db, "quizzes");

    for (const quiz of quizzes) {
      // Use quiz title slug or generate a unique id for the doc
      const docRef = doc(quizzesCollection, quiz.title.toLowerCase().replace(/\s+/g, "-"));
      await setDoc(docRef, quiz);
      console.log(`Uploaded quiz: ${quiz.title}`);
    }

    console.log("All quizzes uploaded successfully!");
  } catch (error) {
    console.error("Error uploading quizzes:", error);
  }
}
