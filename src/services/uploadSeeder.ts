import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Paste your seeded quiz data here or import it if in a separate file
const quizzes = [
  {
  "title": "Religious and Moral Education 5 Quiz A",
  "badge": "stage-5",
  "questions": [
    {
    "question": "What is the Golden Rule found in many religions?",
    "options": ["Pray five times a day", "Give to charity regularly", "Treat others as you would like to be treated", "Love your enemies"],
    "correctIndex": 2,
    "explanation": "The Golden Rule, 'Treat others as you would like to be treated,' is a fundamental moral principle found across many world religions and ethical systems.",
    "topic": "Universal Moral Principles"
  },
  {
    "question": "Which of the following is a characteristic of a moral dilemma?",
    "options": ["It involves a conflict between values", "It has a clear right answer", "It only affects one person", "It has no consequences"],
    "correctIndex": 0,
    "explanation": "A moral dilemma involves a conflict between different values or principles, making it difficult to determine the right course of action.",
    "topic": "Moral Reasoning"
  },
  {
    "question": "What is conscience?",
    "options": ["A religious text", "A type of prayer", "A religious ceremony", "An inner sense of right and wrong"],
    "correctIndex": 3,
    "explanation": "Conscience is an inner sense or voice that helps people distinguish between right and wrong, guiding moral decision-making.",
    "topic": "Moral Development"
  },
  {
    "question": "Which of the following best describes empathy?",
    "options": ["Feeling sorry for someone", "Understanding and sharing another's feelings", "Agreeing with everyone", "Avoiding conflict"],
    "correctIndex": 1,
    "explanation": "Empathy is the ability to understand and share the feelings of another person, putting yourself in their position.",
    "topic": "Character Development"
  },
  {
    "question": "What is the main purpose of prayer in religious traditions?",
    "options": ["To ask for material things", "To show off to others", "To communicate with the divine", "To avoid responsibility"],
    "correctIndex": 2,
    "explanation": "Prayer serves as a means of communication with the divine, allowing believers to express gratitude, seek guidance, or find spiritual connection.",
    "topic": "Religious Practices"
  },
  {
    "question": "Which virtue involves telling the truth?",
    "options": ["Courage", "Patience", "Generosity", "Honesty"],
    "correctIndex": 3,
    "explanation": "Honesty is the virtue that involves telling the truth and being sincere in one's words and actions.",
    "topic": "Virtues and Values"
  },
  {
    "question": "What does it mean to be tolerant?",
    "options": ["To respect different opinions and beliefs", "To accept only similar beliefs", "To avoid making decisions", "To change your beliefs constantly"],
    "correctIndex": 0,
    "explanation": "Tolerance means respecting and accepting different opinions, beliefs, and practices, even when they differ from your own.",
    "topic": "Social Values"
  },
  {
    "question": "Which of the following is an example of showing respect?",
    "options": ["Interrupting when someone speaks", "Making fun of differences", "Listening carefully to others", "Ignoring people's feelings"],
    "correctIndex": 2,
    "explanation": "Listening carefully to others demonstrates respect by showing that you value their thoughts and opinions.",
    "topic": "Interpersonal Values"
  },
  {
    "question": "What is forgiveness?",
    "options": ["Forgetting what happened", "Letting go of anger and resentment", "Pretending nothing happened", "Getting revenge"],
    "correctIndex": 1,
    "explanation": "Forgiveness involves letting go of anger and resentment toward someone who has wronged you, though it doesn't mean forgetting or excusing the action.",
    "topic": "Moral Values"
  },
  {
    "question": "Which of the following best describes justice?",
    "options": ["Getting what you want", "Punishing everyone equally", "Avoiding difficult decisions", "Fairness and equality for all"],
    "correctIndex": 3,
    "explanation": "Justice involves fairness and equality, ensuring that people are treated fairly and receive what they deserve.",
    "topic": "Social Justice"
  },
  {
    "question": "What is the importance of having moral values?",
    "options": ["To guide behavior and decision-making", "To impress others", "To avoid thinking", "To control others"],
    "correctIndex": 0,
    "explanation": "Moral values serve as guidelines that help people make good decisions and behave in ways that benefit themselves and society.",
    "topic": "Moral Foundation"
  },
  {
    "question": "Which of the following is a way to show compassion?",
    "options": ["Ignoring someone's pain", "Judging others harshly", "Helping someone in need", "Focusing only on yourself"],
    "correctIndex": 2,
    "explanation": "Compassion is shown by helping someone in need and caring about their suffering or difficulties.",
    "topic": "Character Values"
  },
  {
    "question": "What does it mean to be responsible?",
    "options": ["To blame others for problems", "To accept accountability for your actions", "To avoid making decisions", "To do whatever you want"],
    "correctIndex": 1,
    "explanation": "Being responsible means accepting accountability for your actions and their consequences, and fulfilling your duties and obligations.",
    "topic": "Personal Responsibility"
  },
  {
    "question": "Which of the following is an example of peer pressure?",
    "options": ["Making your own decisions", "Asking for help with homework", "Talking to your parents", "Friends encouraging you to try smoking"],
    "correctIndex": 3,
    "explanation": "Peer pressure occurs when friends or peers influence you to do something you might not normally do, such as trying smoking.",
    "topic": "Social Influences"
  },
  {
    "question": "What is the purpose of having rules in society?",
    "options": ["To maintain order and protect people", "To make life difficult", "To limit freedom completely", "To show authority"],
    "correctIndex": 0,
    "explanation": "Rules in society exist to maintain order, protect people's rights and safety, and help communities function peacefully.",
    "topic": "Social Order"
  },
  {
    "question": "Which of the following demonstrates good citizenship?",
    "options": ["Breaking laws when convenient", "Only caring about yourself", "Participating in community service", "Avoiding civic duties"],
    "correctIndex": 2,
    "explanation": "Good citizenship is demonstrated through participating in community service and contributing positively to society.",
    "topic": "Civic Responsibility"
  },
  {
    "question": "What is the difference between wants and needs?",
    "options": ["There is no difference", "Wants are essential, needs are optional", "Both are equally important", "Needs are essential, wants are desires"],
    "correctIndex": 3,
    "explanation": "Needs are essential things required for survival and well-being, while wants are desires that would be nice to have but aren't necessary.",
    "topic": "Value Priorities"
  },
  {
    "question": "Which of the following is a characteristic of a good friend?",
    "options": ["Someone who encourages bad behavior", "Someone who is trustworthy and supportive", "Someone who is always competitive", "Someone who never disagrees with you"],
    "correctIndex": 1,
    "explanation": "A good friend is trustworthy and supportive, someone you can rely on and who cares about your well-being.",
    "topic": "Friendship Values"
  },
  {
    "question": "What does it mean to have integrity?",
    "options": ["To be honest and have strong moral principles", "To be popular", "To be wealthy", "To be famous"],
    "correctIndex": 0,
    "explanation": "Integrity means being honest and having strong moral principles that guide your behavior consistently.",
    "topic": "Character Traits"
  },
  {
    "question": "Which of the following is a way to resolve conflicts peacefully?",
    "options": ["Fighting", "Ignoring the problem", "Getting revenge", "Talking and listening to each other"],
    "correctIndex": 3,
    "explanation": "Peaceful conflict resolution involves talking and listening to understand different perspectives and find mutually acceptable solutions.",
    "topic": "Conflict Resolution"
  },
  {
    "question": "What is the importance of saying 'sorry' when you've done something wrong?",
    "options": ["It's just a polite word", "It shows you recognize your mistake and feel remorse", "It's required by law", "It makes you look weak"],
    "correctIndex": 1,
    "explanation": "Saying 'sorry' demonstrates that you recognize your mistake, feel remorse, and are willing to take responsibility for your actions.",
    "topic": "Moral Accountability"
  },
  {
    "question": "Which of the following is an example of being grateful?",
    "options": ["Complaining about what you don't have", "Expecting more from others", "Taking things for granted", "Appreciating what others do for you"],
    "correctIndex": 3,
    "explanation": "Being grateful means appreciating what others do for you and recognizing the good things in your life.",
    "topic": "Gratitude"
  },
  {
    "question": "What does it mean to be humble?",
    "options": ["To think you're better than others", "To have a modest view of your importance", "To be weak and powerless", "To never try to succeed"],
    "correctIndex": 1,
    "explanation": "Humility means having a modest view of your own importance and not thinking you're better than others.",
    "topic": "Personal Virtues"
  },
  {
    "question": "Which of the following is a way to show love for your family?",
    "options": ["Ignoring them", "Always arguing", "Being selfish", "Spending quality time together"],
    "correctIndex": 3,
    "explanation": "Showing love for family can be demonstrated through spending quality time together and caring about their well-being.",
    "topic": "Family Values"
  },
  {
    "question": "What is the purpose of meditation or quiet reflection?",
    "options": ["To fall asleep", "To find inner peace and clarity", "To avoid responsibilities", "To show off to others"],
    "correctIndex": 1,
    "explanation": "Meditation and quiet reflection help people find inner peace, clarity, and connection with their spiritual or moral center.",
    "topic": "Spiritual Practices"
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
