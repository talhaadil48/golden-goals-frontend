'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudents, getBookings, todayISO } from '../../lib/storage';
import { Users, CalendarDays, Plus, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [todayClasses, setTodayClasses] = useState<number | null>(null);

  useEffect(() => {
    setTotalStudents(getStudents().length);
    const today = todayISO();
    const todayBookings = getBookings().filter(b => b.date === today);
    setTodayClasses(todayBookings.length);
  }, []);

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="glass-card rounded-3xl p-8 mb-4 border-l-4 border-l-[#6EC1C3]">
        <h1 className="text-3xl font-black text-[#1F2A2E] tracking-tight">Dashboard Overview</h1>
        <p className="mt-2 text-[#5F6B6F] font-medium">Manage Golden Goals school activities from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Students Card */}
        <div className="glass-card rounded-3xl p-8 transition-transform hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={120} strokeWidth={1} color="#6EC1C3" />
          </div>
          <h2 className="text-xl font-bold text-[#5F6B6F] flex items-center gap-2">
            <Users size={24} className="text-[#6EC1C3]" /> Total Students
          </h2>
          <p className="text-6xl font-black mt-6 text-[#1F2A2E]">
            {totalStudents !== null ? totalStudents : '-'}
          </p>
        </div>

        {/* Today's Classes Card */}
        <div className="glass-card rounded-3xl p-8 transition-transform hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <CalendarDays size={120} strokeWidth={1} color="#D9A441" />
          </div>
          <h2 className="text-xl font-bold text-[#5F6B6F] flex items-center gap-2">
            <CalendarDays size={24} className="text-[#D9A441]" /> Today's Classes
          </h2>
          <p className="text-6xl font-black mt-6 text-[#1F2A2E]">
            {todayClasses !== null ? todayClasses : '-'}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-6 text-[#1F2A2E]">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/students"
            className="flex items-center gap-3 px-8 py-4 text-[15px] font-bold neu-btn-primary"
          >
            <Plus size={20} /> Add Student
          </Link>
          <Link
            href="/schedule"
            className="flex items-center gap-3 px-8 py-4 text-[15px] font-bold neu-flat text-[#5AB0B2]"
          >
            <Calendar size={20} /> Open Scheduler
          </Link>
        </div>
      </div>
    </div>
  );
}
