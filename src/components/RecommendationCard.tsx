// src/components/RecommendationCard.tsx
interface Props {
  skill: string;
  priority: "High" | "Medium" | "Low";
}

export default function RecommendationCard({ skill, priority }: Props) {
  const color =
    priority === "High"
      ? "text-red-500"
      : priority === "Medium"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">{skill}</h3>
      <p className={`text-sm ${color}`}>{priority} Priority</p>
      <p className="text-sm mt-2">
        Recommended to strengthen your job readiness.
      </p>
    </div>
  );
}
