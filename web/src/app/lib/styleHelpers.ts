// Helper function for button styles
export function getButtonClass(isActive: boolean): string {
  return `px-4 py-2 rounded transition-all duration-150 ${
    isActive 
      ? "bg-[#e2b714] text-[#323437] font-medium" 
      : "bg-transparent text-[#a1a3a4] opacity-60 hover:opacity-80"
  }`;
}
