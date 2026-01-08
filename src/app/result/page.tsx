import Sidebar from "@/components/Sidebar";
import SkillGapChart from "@/components/SkillGapChart";
import RecommendationCard from "@/components/RecommendationCard";

export default function ResultPage() {
  return (
    <div className="flex min-h-screen bg-[#fbfcfe]">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <h1 className="text-3xl font-bold mb-2">Your Analysis Result</h1>
        <p className="text-slate-500 mb-10">We found 3 major gaps in your Backend profile.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkillGapChart />
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Recommended Path</h3>
            <RecommendationCard />
            <RecommendationCard />
          </div>
        </div>
      </main>
    </div>
  );
}