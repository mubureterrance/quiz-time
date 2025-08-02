import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Paste your seeded quiz data here or import it if in a separate file
const quizzes = [
  {
  "title": "Animals Quiz",
  "badge": "general-knowledge",
  "questions": [
    {
    "question": "What is the fastest land animal?",
    "options": ["Cheetah", "Lion", "Horse", "Greyhound"],
    "correctIndex": 0,
    "explanation": "The cheetah is the fastest land animal, capable of reaching speeds up to 112 km/h (70 mph) in short bursts.",
    "topic": "Mammals"
  },
  {
    "question": "Which bird is known for its ability to mimic human speech?",
    "options": ["Crow", "Parrot", "Raven", "Magpie"],
    "correctIndex": 1,
    "explanation": "Parrots are known for their ability to mimic human speech due to their advanced vocal organs and social intelligence.",
    "topic": "Birds"
  },
  {
    "question": "What is the largest species of shark?",
    "options": ["Great White Shark", "Whale Shark", "Hammerhead Shark", "Tiger Shark"],
    "correctIndex": 1,
    "explanation": "The whale shark is the largest shark species, growing up to 12 meters long, but it is a gentle filter feeder.",
    "topic": "Marine Animals"
  },
  {
    "question": "Which animal is known as the 'Ship of the Desert'?",
    "options": ["Camel", "Horse", "Donkey", "Llama"],
    "correctIndex": 0,
    "explanation": "The camel is called the 'Ship of the Desert' because it can travel long distances in hot, dry desert conditions without water.",
    "topic": "Mammals"
  },
  {
    "question": "What type of animal is a Komodo dragon?",
    "options": ["Mammal", "Bird", "Reptile", "Amphibian"],
    "correctIndex": 2,
    "explanation": "The Komodo dragon is a reptile and the largest living lizard species, native to Indonesian islands.",
    "topic": "Reptiles"
  },
  {
    "question": "Which mammal is capable of true flight?",
    "options": ["Flying squirrel", "Bat", "Colugo", "Gliding possum"],
    "correctIndex": 1,
    "explanation": "Bats are the only mammals capable of sustained true flight, using their webbed wings.",
    "topic": "Mammals"
  },
  {
    "question": "What is the largest living land animal?",
    "options": ["White Rhinoceros", "Asian Elephant", "African Elephant", "Giraffe"],
    "correctIndex": 2,
    "explanation": "The African elephant is the largest living land animal, with males weighing up to 6,800 kg (15,000 lbs).",
    "topic": "Mammals"
  },
  {
    "question": "Which sea creature has three hearts?",
    "options": ["Octopus", "Shark", "Sea turtle", "Squid"],
    "correctIndex": 0,
    "explanation": "An octopus has three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
    "topic": "Marine Animals"
  },
  {
    "question": "What is the only continent without native reptiles or snakes?",
    "options": ["Europe", "Antarctica", "Asia", "North America"],
    "correctIndex": 1,
    "explanation": "Antarctica is the only continent without native reptiles or snakes due to its extreme cold climate.",
    "topic": "Reptiles"
  },
  {
    "question": "Which animal is known to have the longest migration of any mammal?",
    "options": ["Humpback Whale", "Caribou", "Gray Whale", "Elephant Seal"],
    "correctIndex": 2,
    "explanation": "The gray whale has the longest migration of any mammal, traveling up to 20,000 km annually between feeding and breeding grounds.",
    "topic": "Mammals"
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
