import RecommendationCard from "@/components/RecommendationCard";

export default function RecommendationsPage() {
  return (
    <div className="max-w-6xl mx-auto py-20">
      <h1 className="text-3xl font-bold mb-8">Learning Recommendations</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <RecommendationCard />
        <RecommendationCard />
        <RecommendationCard />
      </div>
    </div>
  );
}