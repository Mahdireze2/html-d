import React, { useState } from 'react';
    import { Activity } from '../types/activity';
    import { Brain, Lightbulb, Target } from 'lucide-react';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { LIFE_DOMAINS } from '../types/domains';

    interface AIAssistantProps {
      activities: Activity[];
      onSuggestion: (suggestion: Partial<Activity>) => void;
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function AIAssistant({ activities, onSuggestion, weekSelection }: AIAssistantProps) {
      const [selectedDomain, setSelectedDomain] = useState('');

      const generateSuggestions = () => {
        const suggestions = [
          {
            title: 'قراءة كتاب جديد',
            domainId: 'educational',
            description: 'قراءة كتاب في مجال التطوير الذاتي',
            targetCount: 1
          },
          {
            title: 'ممارسة الرياضة',
            domainId: 'health',
            description: 'تمارين رياضية لمدة 30 دقيقة',
            targetCount: 3
          }
        ];

        return suggestions.filter(s => !selectedDomain || s.domainId === selectedDomain);
      };

      const analyzeProgress = () => {
        const filteredActivities = activities.filter(activity =>
          activity.weekNumber === weekSelection.weekNumber &&
          activity.year === weekSelection.year
        );
        const completedActivities = filteredActivities.filter(a => a.completed);
        const totalActivities = filteredActivities.length;
        const completionRate = totalActivities > 0
          ? (completedActivities.length / totalActivities) * 100
          : 0;

        const allDomains = LIFE_DOMAINS.map(d => d.name);
        const domainCounts = filteredActivities.reduce((acc, activity) => {
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

        const neglectedDomains = allDomains.filter(d => !focusedDomains.includes(d));

        const suggestions = [];
        if (completionRate < 50) {
          suggestions.push('حاول تقسيم المهام الكبيرة إلى مهام أصغر');
          suggestions.push('حاول تحديد أوقات محددة لأنشطتك');
        } else if (completionRate > 80) {
          suggestions.push('عمل رائع! حاول زيادة مستوى التحدي');
          suggestions.push('شارك استراتيجيات نجاحك مع الآخرين');
        }
        if (neglectedDomains.length > 0) {
          suggestions.push(`حاول إضافة أنشطة في: ${neglectedDomains.join(', ')}`);
        }

        return {
          completionRate,
          suggestions,
          focusedDomains
        };
      };

      const suggestions = generateSuggestions();
      const analysis = analyzeProgress();

      return (
        <div className="space-y-6">
          <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-amber-400" size={24} />
              <h2 className="text-xl font-medium text-amber-400">المساعد الذكي</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="text-amber-400" />
                <span className="text-amber-400">معدل الإنجاز: {analysis.completionRate.toFixed(1)}%</span>
              </div>
              <p className="text-amber-400/70">{analysis.suggestions.join('، ')}</p>
            </div>
          </div>

          <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-amber-400" size={24} />
              <h2 className="text-xl font-medium text-amber-400">اقتراحات ذكية</h2>
            </div>

            <div className="space-y-3">
              {analysis.focusedDomains.length > 0 && (
                <div className="bg-black/20 p-4 rounded-lg text-amber-400">
                  مجالات التركيز: {analysis.focusedDomains.join(', ')}
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 bg-black/30 rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors cursor-pointer"
                  onClick={() => onSuggestion(suggestion)}
                >
                  <h3 className="text-amber-400 font-medium mb-2">{suggestion.title}</h3>
                  <p className="text-amber-400/70 text-sm">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
