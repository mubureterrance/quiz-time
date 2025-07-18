import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { Question } from "./types";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (index: number, field: keyof Question, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const QuestionEditor = ({
  question,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: QuestionEditorProps) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">Question {index + 1}</h3>
      <Button
        type="button"
        className="bg-red-400 text-white px-3 py-1 text-sm rounded hover:bg-red-500 disabled:opacity-50"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        Remove
      </Button>
    </div>

    <div className="space-y-4">
      <Input
        placeholder="Enter your question..."
        value={question.question}
        onChange={(e) => onUpdate(index, "question", e.target.value)}
        className="w-full"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {question.options.map((option, optIndex) => (
          <Input
            key={optIndex}
            placeholder={`Option ${optIndex + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...question.options];
              newOptions[optIndex] = e.target.value;
              onUpdate(index, "options", newOptions);
            }}
            className="w-full"
            required
          />
        ))}
      </div>

      <Select
        value={question.correctIndex}
        onChange={(e) =>
          onUpdate(index, "correctIndex", Number(e.target.value))
        }
        className="w-full"
      >
        {question.options.map((option, optIndex) => (
          <option key={optIndex} value={optIndex}>
            Correct Answer: Option {optIndex + 1}{" "}
            {option &&
              `(${option.slice(0, 30)}${option.length > 30 ? "..." : ""})`}
          </option>
        ))}
      </Select>

      <Input
        placeholder="Explanation (optional)"
        value={question.explanation}
        onChange={(e) => onUpdate(index, "explanation", e.target.value)}
        className="w-full"
      />

      <Input
        placeholder="Topic (optional)"
        value={question.topic}
        onChange={(e) => onUpdate(index, "topic", e.target.value)}
        className="w-full"
      />
    </div>
  </div>
);

export default QuestionEditor;
