import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Paste your seeded quiz data here or import it if in a separate file
const quizzes = [
  {
  "title": "Mathematics Quiz",
  "badge": "stage-5",
  "questions": [
    {
      "question": "What is 247 + 156?",
      "options": ["393", "403", "413", "423"],
      "correctIndex": 1,
      "explanation": "247 + 156 = 403. Add units: 7+6=13 (write 3, carry 1), tens: 4+5+1=10 (write 0, carry 1), hundreds: 2+1+1=4.",
      "topic": "Addition"
    },
    {
      "question": "What is 8 × 7?",
      "options": ["54", "56", "58", "64"],
      "correctIndex": 1,
      "explanation": "8 × 7 = 56. This is a multiplication table fact to memorize.",
      "topic": "Multiplication"
    },
    {
      "question": "What is 144 ÷ 12?",
      "options": ["10", "11", "12", "13"],
      "correctIndex": 2,
      "explanation": "144 ÷ 12 = 12. Think: 12 × 12 = 144.",
      "topic": "Division"
    },
    {
      "question": "What is the value of 3 in the number 3,456?",
      "options": ["3", "30", "300", "3000"],
      "correctIndex": 3,
      "explanation": "The 3 is in the thousands place, so its value is 3000.",
      "topic": "Place Value"
    },
    {
      "question": "What fraction of this shape is shaded if 3 out of 8 parts are colored?",
      "options": ["3/5", "3/8", "5/8", "8/3"],
      "correctIndex": 1,
      "explanation": "3 out of 8 parts shaded = 3/8. The numerator shows parts shaded, denominator shows total parts.",
      "topic": "Fractions"
    },
    {
      "question": "What is 0.7 + 0.3?",
      "options": ["0.10", "1.0", "1.10", "10"],
      "correctIndex": 1,
      "explanation": "0.7 + 0.3 = 1.0. Adding tenths: 7 tenths + 3 tenths = 10 tenths = 1 whole.",
      "topic": "Decimals"
    },
    {
      "question": "How many millimeters are in 4.5 centimeters?",
      "options": ["450", "45", "4.5", "0.45"],
      "correctIndex": 1,
      "explanation": "4.5 cm = 45 mm. Multiply by 10 to convert cm to mm.",
      "topic": "Measurement"
    },
    {
      "question": "What is the perimeter of a rectangle with length 12 cm and width 8 cm?",
      "options": ["20 cm", "40 cm", "96 cm", "160 cm"],
      "correctIndex": 1,
      "explanation": "Perimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40 cm.",
      "topic": "Perimeter"
    },
    {
      "question": "What is the area of a rectangle with length 6 cm and width 4 cm?",
      "options": ["10 cm²", "20 cm²", "24 cm²", "28 cm²"],
      "correctIndex": 2,
      "explanation": "Area = length × width = 6 × 4 = 24 cm².",
      "topic": "Area"
    },
    {
      "question": "What type of angle is 90 degrees?",
      "options": ["Acute", "Right", "Obtuse", "Straight"],
      "correctIndex": 1,
      "explanation": "A 90-degree angle is called a right angle. It forms a perfect corner.",
      "topic": "Angles"
    },
    {
      "question": "Which number is a factor of 24?",
      "options": ["5", "7", "8", "9"],
      "correctIndex": 2,
      "explanation": "8 is a factor of 24 because 24 ÷ 8 = 3 with no remainder.",
      "topic": "Factors"
    },
    {
      "question": "What is the next number in the pattern: 5, 10, 15, 20, ___?",
      "options": ["22", "24", "25", "30"],
      "correctIndex": 2,
      "explanation": "The pattern increases by 5 each time. 20 + 5 = 25.",
      "topic": "Patterns"
    },
    {
      "question": "What is 2/5 of 20?",
      "options": ["4", "8", "10", "12"],
      "correctIndex": 1,
      "explanation": "2/5 of 20 = (2/5) × 20 = 40/5 = 8.",
      "topic": "Fractions"
    },
    {
      "question": "How many vertices does a triangular prism have?",
      "options": ["6", "8", "9", "12"],
      "correctIndex": 0,
      "explanation": "A triangular prism has 6 vertices (3 on top triangle, 3 on bottom triangle).",
      "topic": "3D Shapes"
    },
    {
      "question": "What is 500 - 237?",
      "options": ["263", "273", "363", "373"],
      "correctIndex": 0,
      "explanation": "500 - 237 = 263. Subtract column by column, borrowing when needed.",
      "topic": "Subtraction"
    },
    {
      "question": "What is 15 × 4?",
      "options": ["50", "55", "60", "65"],
      "correctIndex": 2,
      "explanation": "15 × 4 = 60. You can think of it as (10 × 4) + (5 × 4) = 40 + 20 = 60.",
      "topic": "Multiplication"
    },
    {
      "question": "What is 0.25 as a fraction?",
      "options": ["1/2", "1/4", "2/5", "3/4"],
      "correctIndex": 1,
      "explanation": "0.25 = 25/100 = 1/4 when simplified.",
      "topic": "Decimals and Fractions"
    },
    {
      "question": "How many grams are in 2.5 kilograms?",
      "options": ["250", "2500", "25000", "0.25"],
      "correctIndex": 1,
      "explanation": "2.5 kg = 2500 g. Multiply by 1000 to convert kg to g.",
      "topic": "Measurement"
    },
    {
      "question": "What is the mode of these numbers: 3, 7, 3, 9, 5, 3, 8?",
      "options": ["3", "5", "7", "9"],
      "correctIndex": 0,
      "explanation": "The mode is 3 because it appears most frequently (3 times).",
      "topic": "Statistics"
    },
    {
      "question": "What is 3² (3 squared)?",
      "options": ["6", "9", "12", "15"],
      "correctIndex": 1,
      "explanation": "3² = 3 × 3 = 9. The small 2 means multiply 3 by itself.",
      "topic": "Powers"
    },
    {
      "question": "What is the LCD (Least Common Denominator) of 1/4 and 1/6?",
      "options": ["10", "12", "24", "4"],
      "correctIndex": 1,
      "explanation": "LCD of 4 and 6 is 12. It's the smallest number both 4 and 6 can divide into.",
      "topic": "Fractions"
    },
    {
      "question": "How many faces does a cube have?",
      "options": ["4", "6", "8", "12"],
      "correctIndex": 1,
      "explanation": "A cube has 6 faces - top, bottom, front, back, left, and right.",
      "topic": "3D Shapes"
    },
    {
      "question": "What is 7.5 + 2.8?",
      "options": ["9.3", "10.3", "9.13", "10.13"],
      "correctIndex": 1,
      "explanation": "7.5 + 2.8 = 10.3. Add whole numbers: 7+2=9, add decimals: 0.5+0.8=1.3, so 9+1.3=10.3.",
      "topic": "Decimals"
    },
    {
      "question": "What is 84 ÷ 7?",
      "options": ["11", "12", "13", "14"],
      "correctIndex": 1,
      "explanation": "84 ÷ 7 = 12. Think: 7 × 12 = 84.",
      "topic": "Division"
    },
    {
      "question": "What is the volume of a cube with side length 3 cm?",
      "options": ["9 cm³", "18 cm³", "27 cm³", "36 cm³"],
      "correctIndex": 2,
      "explanation": "Volume of cube = side³ = 3³ = 3 × 3 × 3 = 27 cm³.",
      "topic": "Volume"
    }
  ]
},
  {
  "title": "Science Quiz",
  "badge": "stage-5",
  "questions": [
    {
      "question": "What are the three states of matter?",
      "options": ["Hot, cold, warm", "Solid, liquid, gas", "Big, medium, small", "Fast, slow, stopped"],
      "correctIndex": 1,
      "explanation": "The three states of matter are solid, liquid, and gas. Matter can change between these states.",
      "topic": "States of Matter"
    },
    {
      "question": "What do plants need to make their own food?",
      "options": ["Soil and water only", "Air and water only", "Sunlight, water, and carbon dioxide", "Fertilizer and sunlight"],
      "correctIndex": 2,
      "explanation": "Plants need sunlight, water, and carbon dioxide to make food through photosynthesis.",
      "topic": "Photosynthesis"
    },
    {
      "question": "Which part of the plant absorbs water from the soil?",
      "options": ["Leaves", "Stem", "Roots", "Flowers"],
      "correctIndex": 2,
      "explanation": "Roots absorb water and nutrients from the soil and anchor the plant.",
      "topic": "Plant Parts"
    },
    {
      "question": "What is the center of our solar system?",
      "options": ["Earth", "Moon", "Sun", "Mars"],
      "correctIndex": 2,
      "explanation": "The Sun is at the center of our solar system. All planets orbit around it.",
      "topic": "Solar System"
    },
    {
      "question": "What happens to water when it freezes?",
      "options": ["It becomes gas", "It becomes solid", "It disappears", "It becomes lighter"],
      "correctIndex": 1,
      "explanation": "When water freezes, it becomes solid ice. This happens at 0°C (32°F).",
      "topic": "Changes of State"
    },
    {
      "question": "Which organ pumps blood around the body?",
      "options": ["Brain", "Lungs", "Heart", "Stomach"],
      "correctIndex": 2,
      "explanation": "The heart is a muscle that pumps blood throughout the body, delivering oxygen and nutrients.",
      "topic": "Human Body"
    },
    {
      "question": "What do we call animals that eat only plants?",
      "options": ["Carnivores", "Herbivores", "Omnivores", "Predators"],
      "correctIndex": 1,
      "explanation": "Herbivores are animals that eat only plants. Examples include rabbits, cows, and deer.",
      "topic": "Animal Diets"
    },
    {
      "question": "What is the process by which plants lose water through their leaves?",
      "options": ["Photosynthesis", "Respiration", "Transpiration", "Germination"],
      "correctIndex": 2,
      "explanation": "Transpiration is when plants lose water vapor through tiny pores in their leaves.",
      "topic": "Plant Processes"
    },
    {
      "question": "Which force pulls objects toward Earth?",
      "options": ["Magnetism", "Gravity", "Friction", "Electricity"],
      "correctIndex": 1,
      "explanation": "Gravity is the force that pulls all objects toward Earth's center.",
      "topic": "Forces"
    },
    {
      "question": "What do we call the path that Earth takes around the Sun?",
      "options": ["Rotation", "Revolution", "Orbit", "Axis"],
      "correctIndex": 2,
      "explanation": "Earth's orbit is the path it takes around the Sun, completing one orbit in about 365 days.",
      "topic": "Earth's Movement"
    },
    {
      "question": "Which part of the eye controls how much light enters?",
      "options": ["Retina", "Lens", "Pupil", "Cornea"],
      "correctIndex": 2,
      "explanation": "The pupil is the opening in the eye that gets bigger or smaller to control light.",
      "topic": "Human Senses"
    },
    {
      "question": "What is the hardest natural substance on Earth?",
      "options": ["Gold", "Iron", "Diamond", "Quartz"],
      "correctIndex": 2,
      "explanation": "Diamond is the hardest natural substance, made of carbon atoms arranged in a crystal structure.",
      "topic": "Materials"
    },
    {
      "question": "What do we call the process where caterpillars change into butterflies?",
      "options": ["Evolution", "Metamorphosis", "Adaptation", "Migration"],
      "correctIndex": 1,
      "explanation": "Metamorphosis is the process where insects like butterflies completely change form during their life cycle.",
      "topic": "Life Cycles"
    },
    {
      "question": "Which gas do plants give off during photosynthesis?",
      "options": ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
      "correctIndex": 2,
      "explanation": "During photosynthesis, plants release oxygen as a waste product, which we breathe.",
      "topic": "Photosynthesis"
    },
    {
      "question": "What is the main source of energy for Earth?",
      "options": ["Wind", "Sun", "Water", "Coal"],
      "correctIndex": 1,
      "explanation": "The Sun provides almost all energy on Earth through light and heat.",
      "topic": "Energy"
    },
    {
      "question": "Which system in the human body helps us breathe?",
      "options": ["Digestive system", "Circulatory system", "Respiratory system", "Nervous system"],
      "correctIndex": 2,
      "explanation": "The respiratory system includes the lungs and helps us breathe in oxygen and breathe out carbon dioxide.",
      "topic": "Human Body Systems"
    },
    {
      "question": "What happens to most materials when they are heated?",
      "options": ["They shrink", "They expand", "They change color", "They become lighter"],
      "correctIndex": 1,
      "explanation": "Most materials expand (get bigger) when heated because particles move faster and take up more space.",
      "topic": "Heat and Temperature"
    },
    {
      "question": "Which planet is closest to the Sun?",
      "options": ["Venus", "Earth", "Mercury", "Mars"],
      "correctIndex": 2,
      "explanation": "Mercury is the closest planet to the Sun in our solar system.",
      "topic": "Solar System"
    },
    {
      "question": "What do we call animals that are active during the night?",
      "options": ["Diurnal", "Nocturnal", "Seasonal", "Migratory"],
      "correctIndex": 1,
      "explanation": "Nocturnal animals are active at night, like owls, bats, and many cats.",
      "topic": "Animal Behavior"
    },
    {
      "question": "What is the name for baby frogs?",
      "options": ["Froglets", "Tadpoles", "Larvae", "Pupae"],
      "correctIndex": 1,
      "explanation": "Tadpoles are baby frogs that live in water and have tails but no legs initially.",
      "topic": "Life Cycles"
    },
    {
      "question": "Which part of a plant makes seeds?",
      "options": ["Roots", "Stems", "Leaves", "Flowers"],
      "correctIndex": 3,
      "explanation": "Flowers are the reproductive parts of plants where seeds are made after pollination.",
      "topic": "Plant Reproduction"
    },
    {
      "question": "What do we call the mixture of gases that surrounds Earth?",
      "options": ["Atmosphere", "Hydrosphere", "Lithosphere", "Biosphere"],
      "correctIndex": 0,
      "explanation": "The atmosphere is the layer of gases surrounding Earth, containing the air we breathe.",
      "topic": "Earth's Structure"
    },
    {
      "question": "Which type of rock is formed from cooled lava?",
      "options": ["Sedimentary", "Metamorphic", "Igneous", "Fossil"],
      "correctIndex": 2,
      "explanation": "Igneous rocks form when molten rock (magma or lava) cools and hardens.",
      "topic": "Rock Types"
    },
    {
      "question": "What is the process called when water vapor turns back into liquid water?",
      "options": ["Evaporation", "Condensation", "Precipitation", "Sublimation"],
      "correctIndex": 1,
      "explanation": "Condensation occurs when water vapor cools and turns back into liquid water, like dew forming.",
      "topic": "Water Cycle"
    },
    {
      "question": "Which vitamin does our body make when exposed to sunlight?",
      "options": ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
      "correctIndex": 3,
      "explanation": "Our skin makes Vitamin D when exposed to sunlight, which helps keep our bones strong.",
      "topic": "Human Health"
    }
  ]
},
{
  "title": "English Quiz",
  "badge": "stage-5",
  "questions": [
    {
      "question": "What is the plural of 'child'?",
      "options": ["childs", "children", "childes", "child's"],
      "correctIndex": 1,
      "explanation": "'Children' is the irregular plural form of 'child'. Not all plurals are formed by adding -s.",
      "topic": "Grammar - Plurals"
    },
    {
      "question": "Which word is a synonym for 'happy'?",
      "options": ["sad", "joyful", "angry", "tired"],
      "correctIndex": 1,
      "explanation": "'Joyful' means the same as 'happy'. Synonyms are words with similar meanings.",
      "topic": "Vocabulary - Synonyms"
    },
    {
      "question": "What type of word is 'quickly' in the sentence: 'She ran quickly to school'?",
      "options": ["Noun", "Verb", "Adjective", "Adverb"],
      "correctIndex": 3,
      "explanation": "'Quickly' is an adverb because it describes how the action (ran) was performed. Many adverbs end in -ly.",
      "topic": "Grammar - Parts of Speech"
    },
    {
      "question": "Which sentence is written correctly?",
      "options": ["I went to the store yesterday", "i went to the store yesterday", "I went to the Store yesterday", "I went to the store Yesterday"],
      "correctIndex": 0,
      "explanation": "Sentences begin with capital letters and end with punctuation. Common nouns like 'store' are not capitalized.",
      "topic": "Grammar - Capitalization"
    },
    {
      "question": "What is the past tense of 'write'?",
      "options": ["writed", "wrote", "written", "writes"],
      "correctIndex": 1,
      "explanation": "'Wrote' is the past tense of 'write'. This is an irregular verb that doesn't follow the -ed pattern.",
      "topic": "Grammar - Verb Tenses"
    },
    {
      "question": "Which word is an antonym for 'big'?",
      "options": ["large", "huge", "small", "giant"],
      "correctIndex": 2,
      "explanation": "'Small' is the opposite of 'big'. Antonyms are words with opposite meanings.",
      "topic": "Vocabulary - Antonyms"
    },
    {
      "question": "What is the correct way to show possession for 'the book that belongs to Sarah'?",
      "options": ["Sarahs book", "Sarah's book", "Sarahs' book", "Sarah book"],
      "correctIndex": 1,
      "explanation": "Sarah's book uses an apostrophe + s to show that the book belongs to Sarah.",
      "topic": "Grammar - Apostrophes"
    },
    {
      "question": "Which word completes this sentence correctly: 'There are ___ apples on the table'?",
      "options": ["to", "too", "two", "tue"],
      "correctIndex": 2,
      "explanation": "'Two' is the number. 'To' is a preposition, 'too' means also or very much.",
      "topic": "Spelling - Homophones"
    },
    {
      "question": "What is the main idea of a story called?",
      "options": ["Setting", "Character", "Theme", "Plot"],
      "correctIndex": 2,
      "explanation": "The theme is the main idea or message of a story. It's what the story is really about.",
      "topic": "Reading - Literary Elements"
    },
    {
      "question": "Which sentence uses a simile?",
      "options": ["The sun is bright", "She is as brave as a lion", "The dog barked loudly", "We played all day"],
      "correctIndex": 1,
      "explanation": "A simile compares two things using 'like' or 'as'. 'As brave as a lion' compares bravery to a lion.",
      "topic": "Language - Figurative Language"
    },
    {
      "question": "What punctuation mark goes at the end of a question?",
      "options": ["Period (.)", "Exclamation mark (!)", "Question mark (?)", "Comma (,)"],
      "correctIndex": 2,
      "explanation": "Questions always end with a question mark (?) to show that something is being asked.",
      "topic": "Grammar - Punctuation"
    },
    {
      "question": "Which word is spelled correctly?",
      "options": ["recieve", "receive", "recieve", "recive"],
      "correctIndex": 1,
      "explanation": "'Receive' follows the rule 'i before e except after c'. The c comes before ei in this word.",
      "topic": "Spelling"
    },
    {
      "question": "What is the subject in this sentence: 'The tall boy kicked the ball'?",
      "options": ["tall", "boy", "kicked", "ball"],
      "correctIndex": 1,
      "explanation": "The subject is 'boy' - the person doing the action. 'Tall' describes the boy but isn't the subject.",
      "topic": "Grammar - Sentence Structure"
    },
    {
      "question": "Which word is a compound word?",
      "options": ["running", "sunshine", "quickly", "beautiful"],
      "correctIndex": 1,
      "explanation": "'Sunshine' is made of two words: 'sun' + 'shine'. Compound words combine two complete words.",
      "topic": "Vocabulary - Word Formation"
    },
    {
      "question": "What does the prefix 'un-' mean in the word 'unhappy'?",
      "options": ["very", "not", "before", "again"],
      "correctIndex": 1,
      "explanation": "The prefix 'un-' means 'not'. So 'unhappy' means 'not happy'.",
      "topic": "Vocabulary - Prefixes"
    },
    {
      "question": "Which sentence is a command?",
      "options": ["What time is it?", "Please close the door", "I am going home", "The cat is sleeping"],
      "correctIndex": 1,
      "explanation": "Commands tell someone to do something. 'Please close the door' is asking someone to perform an action.",
      "topic": "Grammar - Sentence Types"
    },
    {
      "question": "What is the correct plural of 'mouse'?",
      "options": ["mouses", "mice", "mouse's", "mooses"],
      "correctIndex": 1,
      "explanation": "'Mice' is the irregular plural of 'mouse'. Some words change completely in their plural form.",
      "topic": "Grammar - Irregular Plurals"
    },
    {
      "question": "Which word best completes: 'She ___ to the store every day'?",
      "options": ["go", "goes", "going", "gone"],
      "correctIndex": 1,
      "explanation": "'Goes' is correct because 'she' is singular and needs the -s form in present tense.",
      "topic": "Grammar - Subject-Verb Agreement"
    },
    {
      "question": "What is an adjective?",
      "options": ["A word that shows action", "A word that describes a noun", "A word that connects ideas", "A word that shows location"],
      "correctIndex": 1,
      "explanation": "An adjective describes or gives more information about a noun (like 'big house' or 'red car').",
      "topic": "Grammar - Parts of Speech"
    },
    {
      "question": "Which sentence uses the correct form of 'there/their/they're'?",
      "options": ["There going to the park", "Their going to the park", "They're going to the park", "Theyre going to the park"],
      "correctIndex": 2,
      "explanation": "'They're' is the contraction for 'they are'. 'There' shows location, 'their' shows possession.",
      "topic": "Grammar - Contractions"
    },
    {
      "question": "What is the past tense of 'run'?",
      "options": ["runned", "ran", "runed", "running"],
      "correctIndex": 1,
      "explanation": "'Ran' is the past tense of 'run'. This is an irregular verb that doesn't follow the -ed pattern.",
      "topic": "Grammar - Irregular Verbs"
    },
    {
      "question": "Which word rhymes with 'light'?",
      "options": ["let", "right", "lot", "late"],
      "correctIndex": 1,
      "explanation": "'Right' rhymes with 'light' because they both end with the same sound (-ight).",
      "topic": "Phonics - Rhyming"
    },
    {
      "question": "What does the suffix '-ful' mean in 'helpful'?",
      "options": ["without", "full of", "before", "small"],
      "correctIndex": 1,
      "explanation": "The suffix '-ful' means 'full of'. So 'helpful' means 'full of help'.",
      "topic": "Vocabulary - Suffixes"
    },
    {
      "question": "Which is the correct way to write a book title?",
      "options": ["harry potter", "Harry Potter", "\"Harry Potter\"", "Harry potter"],
      "correctIndex": 1,
      "explanation": "Book titles should have the first letter of each important word capitalized. Titles can be italicized or underlined.",
      "topic": "Grammar - Capitalization"
    },
    {
      "question": "What is the comparative form of 'good'?",
      "options": ["gooder", "more good", "better", "best"],
      "correctIndex": 2,
      "explanation": "'Better' is the comparative form of 'good'. This is irregular - we don't say 'more good' or 'gooder'.",
      "topic": "Grammar - Comparatives"
    }
  ]
},
{
  "title": "Agriculture Quiz",
  "badge": "stage-5",
  "questions": [
    {
      "question": "What are the three main things plants need to grow?",
      "options": ["Air, water, soil", "Sunlight, water, nutrients", "Seeds, soil, tools", "Rain, sun, wind"],
      "correctIndex": 1,
      "explanation": "Plants need sunlight for energy, water for transport, and nutrients from soil to grow healthy.",
      "topic": "Plant Growth"
    },
    {
      "question": "Which season is best for planting most crops?",
      "options": ["Winter", "Spring", "Summer", "Autumn"],
      "correctIndex": 1,
      "explanation": "Spring is the best time for planting because temperatures are warming up and there's usually good rainfall for seed germination.",
      "topic": "Seasons and Planting"
    },
    {
      "question": "What is the process of preparing soil for planting called?",
      "options": ["Harvesting", "Weeding", "Tilling", "Watering"],
      "correctIndex": 2,
      "explanation": "Tilling breaks up and loosens the soil so plant roots can grow easily and water can penetrate.",
      "topic": "Soil Preparation"
    },
    {
      "question": "Which part of the plant takes in water and nutrients from the soil?",
      "options": ["Leaves", "Stem", "Roots", "Flowers"],
      "correctIndex": 2,
      "explanation": "Roots absorb water and nutrients from the soil and transport them to the rest of the plant.",
      "topic": "Plant Parts"
    },
    {
      "question": "What do we call the practice of growing different crops in the same field in different seasons?",
      "options": ["Crop rotation", "Mixed farming", "Irrigation", "Fertilization"],
      "correctIndex": 0,
      "explanation": "Crop rotation helps maintain soil fertility and reduces pest and disease problems.",
      "topic": "Farming Practices"
    },
    {
      "question": "Which tool is used to make furrows in the soil for planting seeds?",
      "options": ["Hoe", "Rake", "Plow", "Spade"],
      "correctIndex": 2,
      "explanation": "A plow cuts through soil and turns it over, creating furrows for planting seeds.",
      "topic": "Farm Tools"
    },
    {
      "question": "What is compost made from?",
      "options": ["Only leaves", "Chemical fertilizers", "Decomposed organic matter", "Sand and stones"],
      "correctIndex": 2,
      "explanation": "Compost is made from decomposed organic materials like kitchen scraps, leaves, and grass clippings.",
      "topic": "Organic Farming"
    },
    {
      "question": "Which animals are commonly raised on dairy farms?",
      "options": ["Pigs", "Chickens", "Cows", "Sheep"],
      "correctIndex": 2,
      "explanation": "Dairy farms primarily raise cows for milk production, which is then processed into various dairy products.",
      "topic": "Animal Husbandry"
    },
    {
      "question": "What is the main purpose of irrigation?",
      "options": ["To add nutrients", "To provide water", "To remove weeds", "To protect from pests"],
      "correctIndex": 1,
      "explanation": "Irrigation systems provide water to crops when natural rainfall is insufficient.",
      "topic": "Water Management"
    },
    {
      "question": "Which crop is known as a 'cash crop'?",
      "options": ["Vegetables for home use", "Crops grown to sell for money", "Wild plants", "Decorative flowers"],
      "correctIndex": 1,
      "explanation": "Cash crops are grown specifically to be sold for profit, not for the farmer's own consumption.",
      "topic": "Types of Crops"
    },
    {
      "question": "What does organic farming avoid using?",
      "options": ["Water", "Sunlight", "Chemical pesticides", "Seeds"],
      "correctIndex": 2,
      "explanation": "Organic farming avoids synthetic chemicals, pesticides, and fertilizers, using natural methods instead.",
      "topic": "Organic Farming"
    },
    {
      "question": "Which nutrient makes plant leaves green and healthy?",
      "options": ["Phosphorus", "Nitrogen", "Potassium", "Calcium"],
      "correctIndex": 1,
      "explanation": "Nitrogen is essential for chlorophyll production, which makes leaves green and helps with photosynthesis.",
      "topic": "Plant Nutrition"
    },
    {
      "question": "What is the term for removing weeds from a crop field?",
      "options": ["Harvesting", "Pruning", "Weeding", "Thinning"],
      "correctIndex": 2,
      "explanation": "Weeding removes unwanted plants that compete with crops for water, nutrients, and sunlight.",
      "topic": "Crop Maintenance"
    },
    {
      "question": "Which farm animal is raised primarily for eggs?",
      "options": ["Cows", "Pigs", "Chickens", "Goats"],
      "correctIndex": 2,
      "explanation": "Chickens are the primary source of eggs in farming, with hens laying eggs regularly.",
      "topic": "Poultry Farming"
    },
    {
      "question": "What is the process of collecting ripe crops called?",
      "options": ["Planting", "Weeding", "Harvesting", "Fertilizing"],
      "correctIndex": 2,
      "explanation": "Harvesting is the process of gathering mature crops from the field when they're ready to eat or sell.",
      "topic": "Crop Production"
    },
    {
      "question": "Which type of soil is best for most crops?",
      "options": ["Sandy soil", "Clay soil", "Loamy soil", "Rocky soil"],
      "correctIndex": 2,
      "explanation": "Loamy soil is ideal because it drains well but holds nutrients and water that plants need.",
      "topic": "Soil Types"
    },
    {
      "question": "What is a greenhouse used for?",
      "options": ["Storing tools", "Protecting plants from weather", "Housing animals", "Storing harvested crops"],
      "correctIndex": 1,
      "explanation": "Greenhouses provide controlled environments, protecting plants from harsh weather and extending growing seasons.",
      "topic": "Protected Cultivation"
    },
    {
      "question": "Which farming method uses water instead of soil to grow plants?",
      "options": ["Organic farming", "Hydroponics", "Crop rotation", "Companion planting"],
      "correctIndex": 1,
      "explanation": "Hydroponics grows plants in nutrient-rich water solutions instead of soil.",
      "topic": "Modern Farming"
    },
    {
      "question": "What is the main benefit of crop rotation?",
      "options": ["Uses less water", "Maintains soil fertility", "Requires fewer tools", "Grows plants faster"],
      "correctIndex": 1,
      "explanation": "Crop rotation helps maintain soil fertility by allowing different crops to use and replenish different nutrients.",
      "topic": "Sustainable Farming"
    },
    {
      "question": "Which insects are beneficial to farmers?",
      "options": ["Locusts", "Aphids", "Bees", "Caterpillars"],
      "correctIndex": 2,
      "explanation": "Bees pollinate flowers, helping plants reproduce and produce fruits and seeds.",
      "topic": "Beneficial Insects"
    },
    {
      "question": "What is mulching?",
      "options": ["Planting seeds", "Covering soil with organic material", "Removing weeds", "Watering plants"],
      "correctIndex": 1,
      "explanation": "Mulching covers soil with materials like straw or leaves to retain moisture and suppress weeds.",
      "topic": "Soil Management"
    },
    {
      "question": "Which farm animal produces wool?",
      "options": ["Cows", "Pigs", "Sheep", "Chickens"],
      "correctIndex": 2,
      "explanation": "Sheep produce wool, which is sheared and processed into fabric for clothing.",
      "topic": "Animal Products"
    },
    {
      "question": "What does NPK stand for in fertilizers?",
      "options": ["Natural Plant Killer", "Nitrogen, Phosphorus, Potassium", "New Plant Knowledge", "Nutrient Plant Kit"],
      "correctIndex": 1,
      "explanation": "NPK represents the three main nutrients plants need: Nitrogen, Phosphorus, and Potassium.",
      "topic": "Plant Nutrition"
    },
    {
      "question": "Which method helps conserve water in farming?",
      "options": ["Flood irrigation", "Drip irrigation", "Sprinkler systems", "All of the above"],
      "correctIndex": 1,
      "explanation": "Drip irrigation delivers water directly to plant roots, reducing waste and conserving water.",
      "topic": "Water Conservation"
    },
    {
      "question": "What is the main purpose of a scarecrow?",
      "options": ["To water plants", "To scare away birds", "To provide shade", "To support climbing plants"],
      "correctIndex": 1,
      "explanation": "Scarecrows are used to frighten birds away from crops to prevent them from eating seeds and fruits.",
      "topic": "Pest Control"
    },
    {
      "question": "Which vegetable is grown underground?",
      "options": ["Tomatoes", "Carrots", "Lettuce", "Beans"],
      "correctIndex": 1,
      "explanation": "Carrots are root vegetables that grow underground. We eat the root part of the plant.",
      "topic": "Types of Vegetables"
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
