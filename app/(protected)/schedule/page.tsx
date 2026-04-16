'use client';

import { useState, useEffect } from 'react';
import { getStudents, getBookings, addBooking, getBookingForSlot, todayISO, generateId, TIME_SLOTS } from '../../lib/storage';
import { Student, Booking } from '../../lib/types';
import { CalendarClock, BellRing, AlertTriangle, Phone, Mail, Calendar as CalendarIcon, Clock, Send, CheckCircle2, UserCheck } from 'lucide-react';

export default function SchedulePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeSlot, setActiveSlot] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [error, setError] = useState('');
  
  // Email Notification State
  const [emailStatus, setEmailStatus] = useState<string>('');

  useEffect(() => {
    setStudents(getStudents());
    setBookings(getBookings());
    setSelectedDate(todayISO());
  }, []);

  const handleOpenSlot = (slot: string) => {
    if (students.length === 0) {
      alert("Cannot schedule: No students exist. Please add a student first.");
      return;
    }
    setActiveSlot(slot);
    setSelectedStudentId('');
    setError('');
    setShowModal(true);
  };

  const handleAssign = () => {
    if (!selectedStudentId) {
      setError('Please select a student.');
      return;
    }
    
    const studentExists = bookings.find(b => b.date === selectedDate && b.timeSlot === activeSlot && b.studentId === selectedStudentId);
    if (studentExists) {
      setError('Student already assigned contextually.');
      return;
    }

    const newBooking: Booking = {
      id: generateId(),
      date: selectedDate,
      timeSlot: activeSlot,
      studentId: selectedStudentId,
      createdAt: new Date().toISOString()
    };
    
    addBooking(newBooking);
    setBookings(getBookings());
    setShowModal(false);
  };

  const sendReminder = async (booking: Booking, student: Student) => {
    setEmailStatus(`Sending to parent of ${student.childName}...`);
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'test@example.com', // Normally student.parentEmail
          subject: `Golden Goals Reminder - ${student.childName}`,
          text: `Dear ${student.parentName},\n\nThis is a gentle reminder that your child, ${student.childName}, has a class scheduled on ${booking.date} at ${booking.timeSlot}.\n\nPlease contact us 24 hours in advance if you need to cancel.\n\nBest regards,\nGolden Goals Team`
        })
      });
      if (res.ok) {
         setEmailStatus(`Sent successfully!`);
      } else {
         setEmailStatus(`Error sending email.`);
      }
    } catch (e) {
      setEmailStatus('Failed to send.');
    }
    setTimeout(() => setEmailStatus(''), 3000);
  };

  if (!selectedDate) return null;

  return (
    <div className="flex flex-col gap-8 py-4">
      {emailStatus && (
         <div className="fixed top-24 right-6 z-50 glass-card px-4 py-3 rounded-xl border border-[#6EC1C3] text-[#1F2A2E] font-medium flex items-center gap-2 shadow-lg animate-in slide-in-from-right-4">
           <CheckCircle2 className="text-[#6EC1C3]" size={18} /> {emailStatus}
         </div>
      )}

      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1F2A2E] tracking-tight flex items-center gap-3">
            <CalendarClock size={28} className="text-[#6EC1C3]" /> Scheduler Grid
          </h1>
          <p className="mt-2 text-[#5F6B6F] font-medium">Manage class timetables and assign student slots.</p>
        </div>
        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.6)] p-2 rounded-2xl border border-[rgba(255,255,255,0.8)] shadow-sm">
          <label className="pl-3 font-semibold text-[#5F6B6F] flex items-center gap-2"><CalendarIcon size={16} /> Date:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            className="neu-inset p-3 border-none outline-none text-[#1F2A2E] font-bold tracking-wide"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Scheduler Board */}
        <div className="xl:col-span-8 glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-[#5AB0B2] flex items-center gap-2">
             <Clock size={20} /> Slots for {selectedDate}
          </h2>
          
          <div className="flex flex-col gap-4">
            {TIME_SLOTS.map(slot => {
              const booking = getBookingForSlot(selectedDate, slot);
              const student = booking ? students.find(s => s.id === booking.studentId) : null;
              const isOccupied = !!booking;

              return (
                <div key={slot} className="flex flex-col md:flex-row items-stretch md:items-center rounded-2xl neu-flat overflow-hidden">
                  <div className="px-6 py-4 bg-[rgba(255,255,255,0.4)] text-[#1F2A2E] font-black w-full md:w-36 flex-shrink-0 text-center tracking-tight border-b md:border-b-0 md:border-r border-[rgba(31,42,46,0.1)] flex items-center justify-center gap-2">
                    {slot}
                  </div>
                  <div className="p-4 flex-1">
                    {isOccupied && student && booking ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <img src={student.imageDataUrl} alt={student.childName} className="w-12 h-12 rounded-xl object-cover neu-inset p-1 bg-white border border-[#E0E6E8]" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[15px] truncate text-[#1F2A2E] leading-tight">{student.childName}</h4>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {student.subjects.map(sub => (
                                <span key={sub} className="text-[9px] px-1.5 py-0.5 bg-[#1F2A2E] text-white uppercase font-bold tracking-widest rounded">{sub}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                           <span className="font-bold text-[11px] uppercase tracking-wider text-[#D9A441] neu-inset px-3 py-1.5 rounded-lg border border-[#EBC67A]/50 bg-white/50 whitespace-nowrap">
                            {student.package}
                           </span>
                           <button onClick={() => sendReminder(booking, student)} title="Send Reminder" className="neu-flat p-2 text-[#6EC1C3] hover:text-[#5AB0B2] cursor-pointer">
                             <Send size={16} />
                           </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleOpenSlot(slot)}
                        className="cursor-pointer w-full py-3.5 border-2 border-dashed border-[#6EC1C3]/40 text-[#6EC1C3] font-bold rounded-xl hover:bg-[#6EC1C3]/10 hover:border-[#6EC1C3] transition-all duration-200 flex items-center justify-center gap-2 tracking-wide"
                      >
                        <UserCheck size={18} /> Assign Student
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Policies / Reminders Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-8 border-t-8 border-t-[#D9A441]">
            <h3 className="text-xl font-bold text-[#D9A441] mb-3 flex items-center gap-2">
              <BellRing size={20} /> Reminder Policy
            </h3>
            <p className="text-[15px] text-[#5F6B6F] mb-6 leading-relaxed">
              Reminders are automatically sent to parents <strong className="text-[#1F2A2E]">48 hours</strong> before the scheduled class using our integrated email system.
            </p>
            
            <div className="h-px bg-gradient-to-r from-transparent via-[#EBC67A]/50 to-transparent w-full mb-6"></div>
            
            <h3 className="text-xl font-bold text-[#D9A441] mb-3 flex items-center gap-2">
              <AlertTriangle size={20} /> Cancellation
            </h3>
            <p className="text-[15px] text-[#5F6B6F] mb-6 leading-relaxed">
              If cancelled less than <strong className="text-[#1F2A2E]">24 hours</strong> before class, full cancellation charge applies.
            </p>
            
            <div className="neu-inset p-5 flex flex-col gap-3">
              <span className="text-[11px] text-[#9AA5A9] uppercase font-black tracking-widest flex items-center gap-1.5"><Phone size={12}/> Emergency Contact</span>
              <span className="font-mono text-xl text-[#1F2A2E] font-bold tracking-tight bg-white/50 px-3 py-2 rounded-lg text-center">+971 000 0000</span>
              <span className="text-xs text-[#5F6B6F] text-center font-medium mt-1 flex items-center justify-center gap-1.5">
                <Mail size={12} /> Email/Phone accepted
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="neu-flat bg-[#EAF0F2]/95 border border-white/50 rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl scale-100">
            <div className="bg-gradient-to-r from-[#6EC1C3] to-[#5AB0B2] p-6 text-white text-center rounded-b-3xl shadow-md border-b border-white/20">
              <h3 className="font-black text-2xl tracking-tight">Assign Slot</h3>
              <p className="font-medium opacity-90 mt-1 flex justify-center items-center gap-1.5">
                <CalendarIcon size={14}/> {selectedDate} <Clock size={14} className="ml-1"/> {activeSlot}
              </p>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              {error && (
                <div className="p-3 text-sm bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center gap-2 font-medium">
                  <AlertTriangle size={16} /> {error}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#1F2A2E] pl-1">Select Student</label>
                <select 
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full neu-inset p-4 font-medium text-[#5F6B6F]"
                >
                  <option value="" disabled>Choose a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id} className="font-medium text-[#1F2A2E]">
                      {s.childName} ({s.package})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 text-[#5F6B6F] font-bold hover:text-[#1F2A2E] hover:bg-white/40 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAssign} 
                  className="px-8 py-3 neu-btn-primary font-black cursor-pointer shadow-[0_4px_14px_rgba(217,164,65,0.4)]"
                  style={{ background: 'linear-gradient(135deg, #D9A441, #C89232)' }} // Override to secondary color for assign action
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
