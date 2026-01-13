export const trackSkillProgress = (skillName: string, increment: number = 0.5) => {
  // Get existing progress object or create new one
  const allProgress = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
  
  // Initialize or increment the specific skill
  const currentProgress = allProgress[skillName] || 0;
  const newProgress = Math.min(currentProgress + increment, 100);
  
  allProgress[skillName] = newProgress;
  
  // Save back to storage
  localStorage.setItem("skill-gap-progress", JSON.stringify(allProgress));
  
  // Notify other components
  window.dispatchEvent(new Event("storageProgressUpdate"));
};