import React from 'react';
    import { Brain, TrendingUp, Award, Calendar } from 'lucide-react';
    import { analyzeActivityPatterns } from '../utils/aiAnalytics';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';

    interface AIInsightsProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function AIInsights({ activities, weekSelection }: AIInsightsProps) {
      const filteredActivities = activities.filter(activity =>
        activity.weekNumber === weekSelection.weekNumber &&
        activity.year === weekSelection.year
      );
      const analysis = analyzeActivityPatterns(filteredActivities);

      return (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-purple-400" size={24} />
              <h2 className="text-xl font-medium text-purple-400">تحليلات الأداء</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-purple-400" size={20} />
                  <h3 className="text-purple-400">معدل الإنجاز</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {analysis.completionRate.toFixed(1)}%
                </p>
                {/* Placeholder for a progress chart */}
                <div className="h-16 bg-black/10 rounded-md mt-2">
                  {/* Chart will be rendered here */}
                </div>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-purple-400" size={20} />
                  <h3 className="text-purple-400">سلسلة الإنجاز الحالية</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {analysis.streakDays} أيام
                </p>
                {/* Placeholder for a streak chart */}
                <div className="h-16 bg-black/10 rounded-md mt-2">
                  {/* Chart will be rendered here */}
                </div>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-400" size={20} />
                  <h3 className="text-purple-400">أفضل أداء</h3>
                </div>
                <p className="text-purple-400">
                  {analysis.mostProductiveDay}s في {analysis.mostProductiveTime}
                </p>
                {/* Placeholder for a time-based chart */}
                <div className="h-16 bg-black/10 rounded-md mt-2">
                  {/* Chart will be rendered here */}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-pink-400 mb-4">اقتراحات ذكية</h3>
            <div className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-black/20 p-4 rounded-lg text-pink-400"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>

          {/* Domain Focus */}
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-amber-400 mb-4">مجالات التركيز</h3>
            <div className="flex flex-wrap gap-3">
              {analysis.focusedDomains.map((domain, index) => (
                <div
                  key={index}
                  className="bg-black/20 px-4 py-2 rounded-full text-amber-400"
                >
                  {domain}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
