import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Paste your seeded quiz data here or import it if in a separate file
const quizzes = [
  {
  "title": "Biology 9 Quiz A",
  "badge": "stage-9",
  "questions": [
    {
    "question": "What is the main function of mitochondria in a cell?",
    "options": ["Protein synthesis", "Energy production", "DNA storage", "Waste removal"],
    "correctIndex": 1,
    "explanation": "Mitochondria are the powerhouses of the cell, responsible for cellular respiration and ATP (energy) production.",
    "topic": "Cell Structure and Function"
  },
  {
    "question": "Which process allows plants to make their own food using sunlight?",
    "options": ["Respiration", "Photosynthesis", "Transpiration", "Fermentation"],
    "correctIndex": 1,
    "explanation": "Photosynthesis is the process by which plants convert light energy, carbon dioxide, and water into glucose and oxygen.",
    "topic": "Plant Biology"
  },
  {
    "question": "What type of blood vessel carries blood away from the heart?",
    "options": ["Veins", "Arteries", "Capillaries", "Venules"],
    "correctIndex": 1,
    "explanation": "Arteries carry oxygenated blood away from the heart to the body tissues, except for the pulmonary artery which carries deoxygenated blood to the lungs.",
    "topic": "Circulatory System"
  },
  {
    "question": "Which organelle controls what enters and exits the cell?",
    "options": ["Nucleus", "Cell membrane", "Cytoplasm", "Ribosome"],
    "correctIndex": 1,
    "explanation": "The cell membrane is selectively permeable and controls the movement of substances in and out of the cell.",
    "topic": "Cell Structure and Function"
  },
  {
    "question": "What is the process by which water moves through a plant from roots to leaves?",
    "options": ["Transpiration", "Osmosis", "Diffusion", "Active transport"],
    "correctIndex": 0,
    "explanation": "Transpiration is the process where water is absorbed by roots, moves through the plant, and evaporates from the leaves.",
    "topic": "Plant Biology"
  },
  {
    "question": "Which gas is produced as a waste product during cellular respiration?",
    "options": ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    "correctIndex": 1,
    "explanation": "Cellular respiration breaks down glucose using oxygen to produce energy, with carbon dioxide and water as waste products.",
    "topic": "Respiration"
  },
  {
    "question": "What is the basic unit of heredity?",
    "options": ["Chromosome", "Gene", "DNA", "Protein"],
    "correctIndex": 1,
    "explanation": "A gene is a specific sequence of DNA that codes for a particular trait and is the basic unit of heredity.",
    "topic": "Genetics"
  },
  {
    "question": "Which enzyme breaks down starch into simple sugars in the mouth?",
    "options": ["Pepsin", "Amylase", "Lipase", "Trypsin"],
    "correctIndex": 1,
    "explanation": "Amylase is found in saliva and begins the digestion of starch by breaking it down into maltose.",
    "topic": "Digestive System"
  },
  {
    "question": "What is the role of the stomata in plant leaves?",
    "options": ["Water storage", "Gas exchange", "Nutrient absorption", "Light capture"],
    "correctIndex": 1,
    "explanation": "Stomata are tiny pores on leaf surfaces that allow gas exchange (CO2 in, O2 out) and water vapor release.",
    "topic": "Plant Biology"
  },
  {
    "question": "Which structure in the eye focuses light onto the retina?",
    "options": ["Iris", "Pupil", "Lens", "Cornea"],
    "correctIndex": 2,
    "explanation": "The lens changes shape to focus light rays onto the retina, allowing us to see objects clearly at different distances.",
    "topic": "Nervous System"
  },
  {
    "question": "What type of reproduction produces genetically identical offspring?",
    "options": ["Sexual reproduction", "Asexual reproduction", "Binary fission", "Budding"],
    "correctIndex": 1,
    "explanation": "Asexual reproduction involves only one parent and produces genetically identical offspring (clones).",
    "topic": "Reproduction"
  },
  {
    "question": "Which part of the flower contains the male reproductive organs?",
    "options": ["Pistil", "Stamen", "Petal", "Sepal"],
    "correctIndex": 1,
    "explanation": "The stamen consists of the anther and filament, and produces pollen containing male gametes.",
    "topic": "Plant Reproduction"
  },
  {
    "question": "What is the primary function of red blood cells?",
    "options": ["Fighting infection", "Clotting blood", "Transporting oxygen", "Producing antibodies"],
    "correctIndex": 2,
    "explanation": "Red blood cells contain hemoglobin, which binds to oxygen and transports it throughout the body.",
    "topic": "Circulatory System"
  },
  {
    "question": "Which process moves substances from high to low concentration without energy?",
    "options": ["Active transport", "Diffusion", "Endocytosis", "Exocytosis"],
    "correctIndex": 1,
    "explanation": "Diffusion is the passive movement of substances from an area of high concentration to low concentration.",
    "topic": "Transport in Cells"
  },
  {
    "question": "What is the function of the nephron in the kidney?",
    "options": ["Hormone production", "Blood filtration", "Enzyme secretion", "Glucose storage"],
    "correctIndex": 1,
    "explanation": "Nephrons are the functional units of the kidney that filter blood and produce urine.",
    "topic": "Excretory System"
  },
  {
    "question": "Which factor is NOT required for photosynthesis?",
    "options": ["Carbon dioxide", "Water", "Sunlight", "Oxygen"],
    "correctIndex": 3,
    "explanation": "Photosynthesis requires carbon dioxide, water, and sunlight. Oxygen is a product, not a requirement.",
    "topic": "Plant Biology"
  },
  {
    "question": "What happens to chromosomes during meiosis?",
    "options": ["They are reduced by half", "They double in number", "They remain the same", "They disappear"],
    "correctIndex": 0,
    "explanation": "Meiosis reduces chromosome number by half, producing gametes with half the chromosomes of the parent cell.",
    "topic": "Genetics"
  },
  {
    "question": "Which hormone regulates blood sugar levels?",
    "options": ["Adrenaline", "Insulin", "Thyroxine", "Growth hormone"],
    "correctIndex": 1,
    "explanation": "Insulin is produced by the pancreas and lowers blood glucose levels by promoting glucose uptake by cells.",
    "topic": "Endocrine System"
  },
  {
    "question": "What is the correct sequence of airflow during breathing in?",
    "options": ["Nose → Trachea → Bronchi → Alveoli", "Nose → Bronchi → Trachea → Alveoli", "Nose → Alveoli → Bronchi → Trachea", "Trachea → Nose → Bronchi → Alveoli"],
    "correctIndex": 0,
    "explanation": "Air flows from the nose/mouth through the trachea, into the bronchi, and finally to the alveoli in the lungs.",
    "topic": "Respiratory System"
  },
  {
    "question": "Which type of joint allows the greatest range of movement?",
    "options": ["Hinge joint", "Ball and socket joint", "Pivot joint", "Fixed joint"],
    "correctIndex": 1,
    "explanation": "Ball and socket joints (like the shoulder and hip) allow movement in all directions and rotation.",
    "topic": "Skeletal System"
  },
  {
    "question": "What is the role of decomposers in an ecosystem?",
    "options": ["Produce oxygen", "Make food from sunlight", "Break down dead organisms", "Hunt other animals"],
    "correctIndex": 2,
    "explanation": "Decomposers break down dead organisms and waste products, recycling nutrients back into the ecosystem.",
    "topic": "Ecology"
  },
  {
    "question": "Which structure protects the genetic material in prokaryotic cells?",
    "options": ["Nuclear membrane", "Cell wall", "Cell membrane", "Cytoplasm"],
    "correctIndex": 1,
    "explanation": "Prokaryotic cells lack a nucleus, so the cell wall provides structural protection for the genetic material in the cytoplasm.",
    "topic": "Cell Structure and Function"
  },
  {
    "question": "What is the primary source of energy for most food chains?",
    "options": ["Decomposers", "Primary consumers", "The sun", "Secondary consumers"],
    "correctIndex": 2,
    "explanation": "The sun provides energy for photosynthesis in plants, which form the base of most food chains.",
    "topic": "Ecology"
  },
  {
    "question": "Which process allows genetic variation in sexually reproducing organisms?",
    "options": ["Mitosis", "Binary fission", "Crossing over", "Budding"],
    "correctIndex": 2,
    "explanation": "Crossing over during meiosis creates new combinations of genes, increasing genetic variation in offspring.",
    "topic": "Genetics"
  },
  {
    "question": "What is the main function of the small intestine?",
    "options": ["Water absorption", "Nutrient absorption", "Protein breakdown", "Bile production"],
    "correctIndex": 1,
    "explanation": "The small intestine is the primary site for nutrient absorption, with specialized structures like villi to increase surface area.",
    "topic": "Digestive System"
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
