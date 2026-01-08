// src/components/FeatureCard.tsx
interface Props {
  title: string;
}

export default function FeatureCard({ title }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">
        AI-powered insights to boost your career growth.
      </p>
    </div>
  );
}
