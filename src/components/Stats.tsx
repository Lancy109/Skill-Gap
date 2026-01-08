"use client";
import { motion } from "framer-motion";

const stats = [
  ["10K+", "Active Users"],
  ["500+", "Skills Analyzed"],
  ["95%", "Success Rate"],
  ["1M+", "Learning Hours"],
];

export default function Stats() {
  return (
    <section className="bg-slate-900 py-14 text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(([value, label]) => (
          <motion.div
            key={label}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
