import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[130px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md p-4">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Join the community and start tracking your growth.
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl shadow-slate-200/60 border border-slate-100 rounded-2xl bg-white",
              formButtonPrimary: 
                "bg-indigo-600 hover:bg-indigo-700 text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 normal-case",
              headerTitle: "text-slate-900 font-bold text-xl",
              headerSubtitle: "text-slate-500 font-medium",
              socialButtonsBlockButton: 
                "border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-600 font-bold py-2",
              formFieldLabel: "text-slate-700 font-bold text-xs uppercase tracking-wider",
              formFieldInput: 
                "rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all bg-slate-50/50",
              footerActionLink: "text-indigo-600 hover:text-indigo-700 font-bold",
              identityPreviewText: "text-slate-600 font-medium",
              formResendCodeLink: "text-indigo-600 font-bold"
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