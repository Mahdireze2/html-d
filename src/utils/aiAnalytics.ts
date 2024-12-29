import { Activity } from '../types/activity';
import { LIFE_DOMAINS } from '../types/domains';

export interface ActivityPattern {
  mostProductiveDay: string;
  mostProductiveTime: string;
  completionRate: number;
  streakDays: number;
  focusedDomains: string[];
  suggestions: string[];
}

export function analyzeActivityPatterns(activities: Activity[]): ActivityPattern {
  const completedActivities = activities.filter(a => a.completed);
  const completionRate = activities.length > 0 
    ? (completedActivities.length / activities.length) * 100 
    : 0;

  // Analyze domain focus
  const domainCounts = activities.reduce((acc, activity) => {
    acc[activity.domainId] = (acc[activity.domainId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const focusedDomains = Object.entries(domainCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([domainId]) => {
      const domain = LIFE_DOMAINS.find(d => d.id === domainId);
      return domain?.name || domainId;
    });

  // Generate personalized suggestions
  const suggestions = generateSmartSuggestions(activities, completionRate, focusedDomains);

  return {
    mostProductiveDay: calculateMostProductiveDay(activities),
    mostProductiveTime: calculateMostProductiveTime(activities),
    completionRate,
    streakDays: calculateCurrentStreak(activities),
    focusedDomains,
    suggestions
  };
}

function calculateMostProductiveDay(activities: Activity[]): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCompletions = new Array(7).fill(0);
  
  activities.forEach(activity => {
    if (activity.completed) {
      const date = new Date(activity.createdAt);
      dayCompletions[date.getDay()]++;
    }
  });

  const maxDay = dayCompletions.indexOf(Math.max(...dayCompletions));
  return days[maxDay];
}

function calculateMostProductiveTime(activities: Activity[]): string {
  const completedActivities = activities.filter(a => a.completed);
  const timeSlots = {
    morning: 0,
    afternoon: 0,
    evening: 0
  };

  completedActivities.forEach(activity => {
    const date = new Date(activity.createdAt);
    const hour = date.getHours();
    
    if (hour < 12) timeSlots.morning++;
    else if (hour < 17) timeSlots.afternoon++;
    else timeSlots.evening++;
  });

  const maxTime = Object.entries(timeSlots).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];

  return maxTime.charAt(0).toUpperCase() + maxTime.slice(1);
}

function calculateCurrentStreak(activities: Activity[]): number {
  let streak = 0;
  const today = new Date();
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasCompletedActivity = activities.some(activity => 
      activity.completed && 
      activity.createdAt.startsWith(dateStr)
    );

    if (!hasCompletedActivity) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

function generateSmartSuggestions(
  activities: Activity[], 
  completionRate: number,
  focusedDomains: string[]
): string[] {
  const suggestions: string[] = [];

  // Completion rate based suggestions
  if (completionRate < 50) {
    suggestions.push('Consider breaking down tasks into smaller, more manageable steps');
    suggestions.push('Try setting specific times for your activities');
  } else if (completionRate > 80) {
    suggestions.push('Great work! Consider increasing the challenge level');
    suggestions.push('Share your success strategies with others');
  }

  // Domain balance suggestions
  const allDomains = LIFE_DOMAINS.map(d => d.name);
  const neglectedDomains = allDomains.filter(d => !focusedDomains.includes(d));
  
  if (neglectedDomains.length > 0) {
    suggestions.push(`Consider adding activities in: ${neglectedDomains.join(', ')}`);
  }

  return suggestions;
}
