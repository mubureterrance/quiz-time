import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Paste your seeded quiz data here or import it if in a separate file
const quizzes = [
  {
  "title": "Tourisim And Hospitality 8 Quiz A",
  "badge": "stage-8",
  "questions": [
    {
    "question": "What is the term for tourism that focuses on experiencing local culture and traditions?",
    "options": ["Mass tourism", "Cultural tourism", "Adventure tourism", "Business tourism"],
    "correctIndex": 0,
    "explanation": "Cultural tourism involves traveling to experience the arts, heritage, and special character of a place, allowing visitors to learn about local traditions and customs.",
    "topic": "Types of Tourism"
  },
  {
    "question": "Which hospitality department is responsible for maintaining guest rooms and public areas?",
    "options": ["Front Office", "Housekeeping", "Food & Beverage", "Concierge"],
    "correctIndex": 3,
    "explanation": "The Housekeeping department is responsible for cleaning and maintaining guest rooms, bathrooms, and public areas to ensure they meet quality standards.",
    "topic": "Hotel Operations"
  },
  {
    "question": "What does 'GDP' stand for in tourism economics?",
    "options": ["General Development Plan", "Gross Domestic Product", "Global Distribution Program", "Guest Demographic Profile"],
    "correctIndex": 2,
    "explanation": "GDP stands for Gross Domestic Product, which measures the total value of goods and services produced in a country and is used to assess tourism's economic impact.",
    "topic": "Tourism Economics"
  },
  {
    "question": "Which type of accommodation typically offers cooking facilities and is suitable for longer stays?",
    "options": ["Hotel", "Hostel", "Serviced apartment", "Bed & Breakfast"],
    "correctIndex": 3,
    "explanation": "Serviced apartments combine hotel-like services with residential amenities including kitchens, making them ideal for extended stays and business travelers.",
    "topic": "Accommodation Types"
  },
  {
    "question": "What is the main purpose of a tourism marketing mix?",
    "options": ["To reduce costs", "To attract and satisfy customers", "To eliminate competition", "To increase staff numbers"],
    "correctIndex": 2,
    "explanation": "The tourism marketing mix (4Ps: Product, Price, Place, Promotion) is designed to attract tourists and satisfy their needs while achieving business objectives.",
    "topic": "Tourism Marketing"
  },
  {
    "question": "Which organization is responsible for promoting international tourism globally?",
    "options": ["UNESCO", "UNWTO", "IATA", "WTTC"],
    "correctIndex": 0,
    "explanation": "The United Nations World Tourism Organization (UNWTO) is the leading international organization responsible for promoting sustainable and accessible tourism worldwide.",
    "topic": "Tourism Organizations"
  },
  {
    "question": "What is 'yield management' in the hospitality industry?",
    "options": ["Managing crop production", "Optimizing revenue through pricing strategies", "Training staff efficiency", "Controlling food waste"],
    "correctIndex": 3,
    "explanation": "Yield management involves adjusting prices based on demand, seasonality, and booking patterns to maximize revenue from available rooms or services.",
    "topic": "Revenue Management"
  },
  {
    "question": "Which factor is most important for sustainable tourism development?",
    "options": ["Maximum profit generation", "Environmental protection", "Unlimited growth", "Cost reduction"],
    "correctIndex": 2,
    "explanation": "Sustainable tourism prioritizes environmental protection while ensuring economic benefits and cultural preservation for future generations.",
    "topic": "Sustainable Tourism"
  },
  {
    "question": "What does 'ADR' stand for in hotel performance metrics?",
    "options": ["Average Daily Rate", "Advanced Dining Reservation", "Automated Data Recording", "Annual Development Report"],
    "correctIndex": 3,
    "explanation": "Average Daily Rate (ADR) is calculated by dividing room revenue by the number of rooms sold, indicating the average price paid per room.",
    "topic": "Hotel Performance Metrics"
  },
  {
    "question": "Which service is typically provided by a hotel concierge?",
    "options": ["Room cleaning", "Restaurant reservations", "Accounting", "Laundry services"],
    "correctIndex": 0,
    "explanation": "Concierge services include making restaurant reservations, arranging transportation, providing local information, and assisting with various guest requests.",
    "topic": "Guest Services"
  },
  {
    "question": "What is the primary characteristic of ecotourism?",
    "options": ["Low-cost travel", "Environmental responsibility", "Luxury accommodations", "Urban exploration"],
    "correctIndex": 3,
    "explanation": "Ecotourism focuses on responsible travel to natural areas that conserves the environment and improves the well-being of local communities.",
    "topic": "Ecotourism"
  },
  {
    "question": "Which document is essential for international travel?",
    "options": ["Driver's license", "Passport", "Student ID", "Library card"],
    "correctIndex": 2,
    "explanation": "A passport is the official document required for international travel, serving as proof of identity and nationality.",
    "topic": "Travel Documentation"
  },
  {
    "question": "What is the term for the time between tourist seasons?",
    "options": ["Peak season", "Shoulder season", "Off-season", "Holiday season"],
    "correctIndex": 0,
    "explanation": "Off-season refers to periods when tourist demand is lowest, typically characterized by reduced prices and fewer visitors.",
    "topic": "Tourism Seasonality"
  },
  {
    "question": "Which hospitality role involves greeting guests and managing check-in/check-out?",
    "options": ["Housekeeper", "Chef", "Front desk clerk", "Maintenance worker"],
    "correctIndex": 3,
    "explanation": "Front desk clerks are responsible for guest registration, check-in/check-out processes, and serving as the primary point of contact for guest inquiries.",
    "topic": "Hotel Staffing"
  },
  {
    "question": "What does 'all-inclusive' mean in resort terminology?",
    "options": ["Room only", "Room and breakfast", "All meals and activities included", "Transportation only"],
    "correctIndex": 0,
    "explanation": "All-inclusive resorts include accommodation, meals, drinks, and most activities in one package price, providing convenience for guests.",
    "topic": "Resort Operations"
  },
  {
    "question": "Which factor most influences tourist destination choice?",
    "options": ["Weather conditions", "Personal interests and preferences", "Hotel star rating", "Currency exchange rates"],
    "correctIndex": 3,
    "explanation": "Personal interests, preferences, and motivations are the primary factors that influence where tourists choose to travel.",
    "topic": "Tourist Behavior"
  },
  {
    "question": "What is the main benefit of tourism for local communities?",
    "options": ["Environmental degradation", "Job creation and economic income", "Population decrease", "Cultural isolation"],
    "correctIndex": 0,
    "explanation": "Tourism creates employment opportunities and generates economic income for local communities through various tourism-related businesses and services.",
    "topic": "Tourism Impact"
  },
  {
    "question": "Which technology has most transformed modern travel booking?",
    "options": ["Fax machines", "Internet and mobile apps", "Telegrams", "Postal services"],
    "correctIndex": 2,
    "explanation": "Internet and mobile applications have revolutionized travel booking by providing instant access to information, prices, and reservation systems.",
    "topic": "Tourism Technology"
  },
  {
    "question": "What is 'dark tourism'?",
    "options": ["Nighttime activities", "Tourism to sites of tragedy or disaster", "Underground cave exploration", "Photography tours"],
    "correctIndex": 3,
    "explanation": "Dark tourism involves visiting places associated with death, tragedy, or disaster, such as battlefields, memorials, or sites of historical significance.",
    "topic": "Specialized Tourism"
  },
  {
    "question": "Which meal service style involves guests serving themselves from a buffet?",
    "options": ["À la carte", "Table d'hôte", "Self-service", "Room service"],
    "correctIndex": 0,
    "explanation": "Self-service or buffet style allows guests to select and serve their own food from a variety of dishes displayed on a buffet table.",
    "topic": "Food Service"
  },
  {
    "question": "What is the purpose of a tourism impact assessment?",
    "options": ["To increase tourist numbers", "To evaluate effects on environment and community", "To reduce accommodation prices", "To eliminate local culture"],
    "correctIndex": 3,
    "explanation": "Tourism impact assessments evaluate the positive and negative effects of tourism development on the environment, economy, and local communities.",
    "topic": "Tourism Planning"
  },
  {
    "question": "Which accommodation rating system uses stars to indicate quality levels?",
    "options": ["Alphabetical system", "Star classification", "Numerical scoring", "Color coding"],
    "correctIndex": 0,
    "explanation": "The star classification system (typically 1-5 stars) is widely used internationally to indicate the quality and service level of hotels and accommodations.",
    "topic": "Quality Standards"
  },
  {
    "question": "What is the main purpose of travel insurance?",
    "options": ["To guarantee good weather", "To provide financial protection during travel", "To ensure luxury accommodations", "To eliminate language barriers"],
    "correctIndex": 2,
    "explanation": "Travel insurance provides financial protection against unexpected events such as trip cancellations, medical emergencies, or lost luggage during travel.",
    "topic": "Travel Safety"
  },
  {
    "question": "Which tourism sector includes airlines, railways, and cruise ships?",
    "options": ["Accommodation", "Transportation", "Attractions", "Food service"],
    "correctIndex": 0,
    "explanation": "The transportation sector encompasses all modes of travel including airlines, railways, buses, cruise ships, and car rentals that move tourists between destinations.",
    "topic": "Tourism Sectors"
  },
  {
    "question": "What is the primary goal of hospitality service?",
    "options": ["Maximum profit", "Guest satisfaction", "Staff efficiency", "Cost reduction"],
    "correctIndex": 2,
    "explanation": "The primary goal of hospitality service is to ensure guest satisfaction by meeting and exceeding customer expectations through quality service delivery.",
    "topic": "Service Excellence"
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
