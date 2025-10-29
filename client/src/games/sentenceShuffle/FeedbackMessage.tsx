interface FeedbackMessageProps {
  feedback: string | null;
  status: "idle" | "success" | "error";
}

export default function FeedbackMessage({
  feedback,
  status,
}: FeedbackMessageProps) {
  if (!feedback) return null;
  return (
    <p
      className={`mb-3 text-lg font-medium ${
        status === "error" ? "text-red-600" : "text-green-600"
      }`}
    >
      {feedback}
    </p>
  );
}
