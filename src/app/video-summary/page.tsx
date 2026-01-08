import Sidebar from "@/components/Sidebar";

export default function VideoSummaryPage() {
  return (
    <div className="flex min-h-screen bg-[#fbfcfe]">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <h1 className="text-3xl font-bold mb-8">AI Video Summary</h1>
        <div className="max-w-4xl bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Paste YouTube URL</label>
            <div className="flex gap-4">
              <input type="text" placeholder="https://youtube.com/..." className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold">Summarize</button>
            </div>
          </div>
          
          <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-dashed text-center">
            <p className="text-indigo-600 font-medium">Your summary will appear here after processing.</p>
          </div>
        </div>
      </main>
    </div>
  );
}