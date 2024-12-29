import React from 'react';
import { Activity } from '../types/activity';
import { LIFE_DOMAINS } from '../types/domains';
import { BarChart, Target, CheckCircle } from 'lucide-react';

interface ProgressViewProps {
  activities: Activity[];
}

export function ProgressView({ activities }: ProgressViewProps) {
  const calculateDomainProgress = (domainId: string) => {
    const domainActivities = activities.filter(a => a.domainId === domainId);
    if (domainActivities.length === 0) return 0;
    
    const completed = domainActivities.filter(a => a.completed).length;
    return Math.round((completed / domainActivities.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LIFE_DOMAINS.map(domain => {
          const progress = calculateDomainProgress(domain.id);
          const DomainIcon = domain.icon;
          return (
            <div
              key={domain.id}
              className={`p-4 rounded-lg bg-${domain.color}-100/10 border border-${domain.color}-400/20`}
            >
              <div className="flex items-center gap-2 mb-3">
                <DomainIcon size={20} className={`text-${domain.color}-400`} />
                <h3 className={`text-${domain.color}-400 font-medium`}>{domain.name}</h3>
              </div>
              <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-${domain.color}-400 transition-all`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-white/70">
                {progress}% مكتمل
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-white mb-4">الإحصائيات العامة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-white" />
              <span className="text-white">إجمالي الأنشطة</span>
            </div>
            <div className="text-2xl font-bold text-white">{activities.length}</div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-white" />
              <span className="text-white">الأنشطة المكتملة</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {activities.filter(a => a.completed).length}
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <BarChart size={20} className="text-white" />
              <span className="text-white">نسبة الإنجاز الكلية</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {activities.length > 0
                ? Math.round((activities.filter(a => a.completed).length / activities.length) * 100)
                : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
