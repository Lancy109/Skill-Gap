import React from 'react';

export default function SkillGapChart() {
  const skills = [
    { name: 'Frontend', current: 70, target: 90 },
    { name: 'Backend', current: 40, target: 85 },
    { name: 'DevOps', current: 20, target: 60 },
    { name: 'UI Design', current: 55, target: 80 },
  ];

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
      <h3 className="font-bold text-xl mb-8">Skill Analysis Radar</h3>
      <div className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">{skill.name}</span>
              <span className="text-slate-400">{skill.current}% / {skill.target}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className="absolute h-full bg-indigo-200 rounded-full transition-all duration-1000" 
                style={{ width: `${skill.target}%` }}
              ></div>
              <div 
                className="absolute h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                style={{ width: `${skill.current}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4 text-xs font-medium">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-600 rounded-full"></div> Current Level</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-200 rounded-full"></div> Target Level</div>
      </div>
    </div>
  );
}