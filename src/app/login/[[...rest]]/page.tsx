import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Decorative Background Elements to match your "Browse" UI */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md p-4">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Continue your journey to master new skills.
          </p>
        </div>

        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-indigo-600 hover:bg-indigo-700 text-sm font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-100",
              card: "shadow-2xl shadow-slate-200/50 border border-slate-100 rounded-2xl",
              headerTitle: "text-slate-900 font-bold",
              headerSubtitle: "text-slate-500 font-medium",
              socialButtonsBlockButton: 
                "border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-600 font-bold",
              formFieldInput: 
                "rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all",
              footerActionLink: "text-indigo-600 hover:text-indigo-700 font-bold",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              shimmer: true,
            }
          }}
        />
      </div>
    </div>
  );
}