"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';

export default function SetupProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    degree: '',
    subjects: '',
    goal: '',
    dailyTime: '60'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In actual implementation, we would send this data to IPC:
    // window.electronAPI.createProfile(formData)
    router.push('/system-check');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="glass-card max-w-2xl w-full p-8 rounded-2xl animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2">Configure Your Profile</h2>
        <p className="text-slate-400 mb-6">This helps the AI personalize your study plans and assessments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g., Alex"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Daily Study Goal (min)</label>
              <input 
                required
                type="number"
                name="dailyTime"
                value={formData.dailyTime}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                min="10"
                max="600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Education Level</label>
              <select 
                name="education" 
                value={formData.education} 
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
              >
                <option value="">Select Level</option>
                <option value="High School">High School</option>
                <option value="B.Tech">B.Tech / Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="Self-Taught">Self-Taught</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Degree / Major</label>
              <input 
                required
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Key Subjects (comma separated)</label>
            <input 
              required
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., Data Structures, Physics, Calculus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Primary Goal</label>
            <textarea 
              required
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="e.g., Prepare for final exams and improve my focus..."
            ></textarea>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="glow" className="w-full">
              Continue to System Check
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
