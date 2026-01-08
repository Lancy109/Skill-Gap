import "./globals.css";

export const metadata = {
  title: "Skill Gap",
  description: "Identify and close your skill gaps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
