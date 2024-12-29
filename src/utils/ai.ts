// AI utility functions for task enhancement
export function generateTaskSuggestions(existingTasks: string[]): string[] {
  const suggestions = [
    'مراجعة البريد الإلكتروني اليومي 📧',
    'تحضير تقرير الأداء الأسبوعي 📊',
    'تنظيم اجتماع فريق العمل 👥',
    'تحديث قائمة المهام الأسبوعية 📝',
    'متابعة المشاريع المعلقة ⏳',
  ];
  
  return suggestions.filter(suggestion => 
    !existingTasks.some(task => 
      task.toLowerCase().includes(suggestion.toLowerCase())
    )
  );
}

export function predictPriority(title: string, description: string): 'high' | 'medium' | 'low' {
  const urgentKeywords = ['عاجل', 'مهم', 'ضروري', 'اليوم', 'حالاً'];
  const mediumKeywords = ['أسبوع', 'قريباً', 'متابعة'];
  
  const text = `${title} ${description}`.toLowerCase();
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  }
  if (mediumKeywords.some(keyword => text.includes(keyword))) {
    return 'medium';
  }
  return 'low';
}

export function estimateTaskDuration(title: string, description: string): string {
  const shortTasks = ['مراجعة', 'اتصال', 'رد', 'تحديث'];
  const mediumTasks = ['اجتماع', 'تقرير', 'تحضير'];
  const longTasks = ['مشروع', 'تطوير', 'دراسة'];
  
  const text = `${title} ${description}`.toLowerCase();
  
  if (shortTasks.some(keyword => text.includes(keyword))) {
    return '30 دقيقة';
  }
  if (mediumTasks.some(keyword => text.includes(keyword))) {
    return 'ساعة واحدة';
  }
  if (longTasks.some(keyword => text.includes(keyword))) {
    return 'عدة ساعات';
  }
  return 'ساعة واحدة';
}
