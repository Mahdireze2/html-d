import React, { useState, useRef, useContext } from 'react';
    import { Activity } from '../types/activity';
    import { AIInsights } from './AIInsights';
    import { AIAssistant } from './AIAssistant';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { WeekDisplay } from './WeekDisplay';
    import { Download, Upload, Brain } from 'lucide-react';
    import { ActivityContext } from '../context/ActivityContext';
    import { PositiveNotesTable } from './PositiveNotesTable';

    interface CombinedViewProps {
      activities: Activity[];
      onSuggestion: (suggestion: Partial<Activity>) => void;
    }

    export function CombinedView({ onSuggestion }: CombinedViewProps) {
      const weekSelection = useWeekSelection();
      const fileInputRef = useRef<HTMLInputElement>(null);
      const { activities } = useContext(ActivityContext);

      const handleExport = () => {
        const dataStr = JSON.stringify(activities, null, 2);
        const blob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'activities.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      const handleImport = () => {
        fileInputRef.current?.click();
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const fileContent = event.target?.result as string;
            const importedData = JSON.parse(fileContent);
            console.log('Imported data:', importedData);
            // Here you would implement the logic to update the app's state with the imported data
            alert('Data imported successfully! Check the console for the imported data.');
          } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing file. Please ensure it is a valid text file.');
          }
        };
        reader.readAsText(file);
      };

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <WeekDisplay weekNumber={weekSelection.weekNumber} year={weekSelection.year} />
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center gap-2"
              >
                <Download size={16} />
                تصدير
              </button>
              <button
                onClick={handleImport}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2"
              >
                <Upload size={16} />
                استيراد
              </button>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="text/plain"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AIInsights activities={activities} weekSelection={weekSelection} />
              <div className="bg-gradient-to-br from-teal-500/20 to-teal-700/20 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="text-teal-400" size={24} />
                  <h2 className="text-xl font-medium text-teal-400">ملخص النقاط الإيجابية</h2>
                </div>
                <PositiveNotesTable activities={activities} weekSelection={weekSelection} />
              </div>
            </div>
            <div className="space-y-6">
              <AIAssistant
                activities={activities}
                onSuggestion={onSuggestion}
                weekSelection={weekSelection}
              />
            </div>
          </div>
        </div>
      );
    }

    // Placeholder functions for export and import
    function exportData(activities: Activity[]) {
      // This function will be replaced with actual export logic
      console.log('Exporting data:', activities);
    }

    function importData() {
      // This function will be replaced with actual import logic
      console.log('Importing data');
    }
