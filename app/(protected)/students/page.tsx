'use client';

import { useState, useEffect, useRef } from 'react';
import { getStudents, addStudent, generateId, getBookings } from '../../lib/storage';
import { Student, Subject, Package, PACKAGE_PRICES, Booking } from '../../lib/types';
import { Camera, AlertCircle, CheckCircle2, UserPlus, Phone, MapPin, Cake, GraduationCap, Mail, X, BookOpen, Star, Clock, CalendarCheck, CalendarX, CalendarClock } from 'lucide-react';

function statusIcon(status: string) {
  if (status === 'Completed') return <CalendarCheck size={14} className="text-emerald-500" />;
  if (status === 'Missed') return <CalendarX size={14} className="text-rose-400" />;
  return <CalendarClock size={14} className="text-[#6EC1C3]" />;
}

function statusColor(status: string) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  if (status === 'Missed') return 'bg-rose-50 text-rose-500 border-rose-200';
  return 'bg-[#6EC1C3]/10 text-[#5AB0B2] border-[#6EC1C3]/30';
}

// Mock history entries for demonstration (supplements real bookings)
function getMockHistory(student: Student): Array<{ date: string; subject: string; status: 'Completed' | 'Missed' | 'Upcoming' }> {
  const base: Array<{ date: string; subject: string; status: 'Completed' | 'Missed' | 'Upcoming' }> = [];
  const today = new Date();
  student.subjects.forEach((sub, idx) => {
    // Past completed
    const past = new Date(today);
    past.setDate(today.getDate() - (7 + idx * 7));
    base.push({ date: past.toISOString().split('T')[0], subject: sub, status: 'Completed' });
    // A missed entry
    const missed = new Date(today);
    missed.setDate(today.getDate() - (3 + idx * 5));
    base.push({ date: missed.toISOString().split('T')[0], subject: sub, status: 'Missed' });
    // Upcoming
    const upcoming = new Date(today);
    upcoming.setDate(today.getDate() + (2 + idx * 3));
    base.push({ date: upcoming.toISOString().split('T')[0], subject: sub, status: 'Upcoming' });
  });
  return base.sort((a, b) => a.date.localeCompare(b.date));
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childDob, setChildDob] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package>('1 Week');
  const [imagePreview, setImagePreview] = useState<string>('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setStudents(getStudents());
    setBookings(getBookings());
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectToggle = (subject: Subject) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) return prev.filter(s => s !== subject);
      if (prev.length >= 3) return prev; 
      return [...prev, subject];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedSubjects.length !== 3) {
      setError('Exactly 3 subjects must be selected.');
      return;
    }
    if (!imagePreview) {
      setError('Please upload a child photo.');
      return;
    }

    const newStudent: Student = {
      id: generateId(),
      parentName, parentPhone, parentEmail, parentAddress,
      childName, childAge: parseInt(childAge, 10), childDob,
      schoolName, subjects: selectedSubjects, package: selectedPackage,
      imageDataUrl: imagePreview,
      createdAt: new Date().toISOString()
    };

    addStudent(newStudent);
    setStudents(getStudents());

    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: parentEmail,
          subject: 'Student Registration Confirmation – Golden Goals',
          text: `Dear ${parentName},\n\nYour child ${childName} has been successfully registered at Golden Goals.\n\nPackage: ${selectedPackage}\nSubjects: ${selectedSubjects.join(', ')}\n\nThank you for choosing Golden Goals!`,
          html: `<p>Dear <strong>${parentName}</strong>,</p><p>Your child <strong>${childName}</strong> has been successfully registered at Golden Goals.</p><ul><li><strong>Package:</strong> ${selectedPackage}</li><li><strong>Subjects:</strong> ${selectedSubjects.join(', ')}</li></ul><p>Thank you for choosing Golden Goals!</p>`,
        }),
      });
    } catch {
      // email failure is non-blocking
    }

    setBookings(getBookings());
    setSuccess('Student successfully onboarded!');

    setParentName(''); setParentPhone(''); setParentEmail(''); setParentAddress('');
    setChildName(''); setChildAge(''); setChildDob(''); setSchoolName('');
    setSelectedSubjects([]); setSelectedPackage('1 Week'); setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="flex flex-col gap-10 py-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1F2A2E] tracking-tight">Student Management</h1>
          <p className="mt-2 text-[#5F6B6F] font-medium">Add new students and view existing profiles.</p>
        </div>
        <div className="hidden md:flex opacity-20"><UserPlus size={64} color="#6EC1C3" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM PANEL */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-[#5AB0B2] flex items-center gap-2">
            <UserPlus size={20} /> Create Profile
          </h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-2">
              <AlertCircle size={20} /> <span className="font-medium text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center gap-2">
              <CheckCircle2 size={20} /> <span className="font-medium text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#1F2A2E]">Parent Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Full Name" value={parentName} onChange={e => setParentName(e.target.value)} className="neu-inset w-full p-3.5 text-sm outline-none" />
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5A9]" />
                  <input required placeholder="Phone Number" value={parentPhone} onChange={e => setParentPhone(e.target.value)} className="neu-inset w-full pl-10 pr-3.5 py-3.5 text-sm outline-none" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5A9]" />
                  <input required type="email" placeholder="Email Address" value={parentEmail} onChange={e => setParentEmail(e.target.value)} className="neu-inset w-full pl-10 pr-3.5 py-3.5 text-sm outline-none" />
                </div>
                <div className="relative sm:col-span-2">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5A9]" />
                  <input required placeholder="Full Address" value={parentAddress} onChange={e => setParentAddress(e.target.value)} className="neu-inset w-full pl-10 pr-3.5 py-3.5 text-sm outline-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#1F2A2E]">Child Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Child's Full Name" value={childName} onChange={e => setChildName(e.target.value)} className="neu-inset w-full p-3.5 text-sm outline-none" />
                <input required type="number" placeholder="Age" value={childAge} onChange={e => setChildAge(e.target.value)} className="neu-inset w-full p-3.5 text-sm outline-none" />
                <div className="relative">
                  <Cake size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA5A9] pointer-events-none" />
                  <input required type="date" value={childDob} onChange={e => setChildDob(e.target.value)} className="neu-inset w-full p-3.5 text-sm outline-none text-[#5F6B6F]" />
                </div>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5A9]" />
                  <input required placeholder="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="neu-inset w-full pl-10 pr-3.5 py-3.5 text-sm outline-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#1F2A2E]">Curriculum (Pick 3)</h3>
              <div className="flex flex-wrap gap-4">
                {(['Math', 'Arabic', 'English'] as Subject[]).map(sub => {
                  const check = selectedSubjects.includes(sub);
                  return (
                    <label key={sub} className={`flex-1 min-w-[100px] cursor-pointer text-center py-3.5 px-4 font-semibold text-sm transition-all ${check ? 'neu-inset border-[#6EC1C3] text-[#5AB0B2]' : 'neu-flat text-[#5F6B6F]'}`}>
                      <input type="checkbox" className="hidden" checked={check} onChange={() => handleSubjectToggle(sub)} />
                      {sub}
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#1F2A2E]">Duration Package</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(PACKAGE_PRICES) as Package[]).map(pkg => {
                   const check = selectedPackage === pkg;
                   return (
                    <label key={pkg} className={`cursor-pointer flex flex-col items-center justify-center py-4 px-2 transition-all ${check ? 'neu-inset border-[#D9A441] text-[#D9A441]' : 'neu-flat text-[#5F6B6F]'}`}>
                      <input type="radio" value={pkg} checked={check} onChange={() => setSelectedPackage(pkg)} className="hidden" />
                      <span className="font-bold text-sm">{pkg}</span>
                      <span className="text-xs mt-1 opacity-80">{PACKAGE_PRICES[pkg]} AED</span>
                    </label>
                   )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#1F2A2E]">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full neu-inset flex items-center justify-center overflow-hidden border-2 border-dashed border-[#6EC1C3]">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={32} className="opacity-40 text-[#5F6B6F]" />}
                </div>
                <input required type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="file:cursor-pointer text-sm text-[#5F6B6F] file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#6EC1C3] file:text-white hover:file:bg-[#5AB0B2] transition-all cursor-pointer" />
              </div>
            </div>

            <button type="submit" className="neu-btn-primary w-full mt-4 py-4 font-bold text-base tracking-wide flex items-center justify-center gap-2">
              <UserPlus size={20} /> Register Student
            </button>
          </form>
        </div>

        {/* LIST PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 h-full border-t-8 border-t-[#D9A441]">
            <h2 className="text-xl font-bold text-[#1F2A2E] mb-6 flex items-center gap-2">
              Directory <span className="neu-inset px-2 py-0.5 text-xs rounded-full text-[#D9A441]">{students.length}</span>
            </h2>
            
            {students.length === 0 ? (
              <div className="text-center p-8 neu-inset rounded-2xl flex flex-col items-center gap-3">
                <UserPlus size={32} className="text-[#9AA5A9]" />
                <span className="font-medium text-[#9AA5A9]">No students logged yet.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {students.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="neu-flat rounded-2xl p-4 flex gap-4 items-center text-left w-full hover:border-[#6EC1C3] hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={s.imageDataUrl} alt={s.childName} className="w-14 h-14 rounded-full object-cover neu-inset ring-2 ring-[#6EC1C3]/20 group-hover:ring-[#6EC1C3]/50 transition-all" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D9A441] rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow">
                        {s.childAge}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] truncate text-[#1F2A2E] group-hover:text-[#5AB0B2] transition-colors">{s.childName}</h4>
                      <p className="text-xs text-[#9AA5A9] truncate">{s.parentName}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {s.subjects.map(sub => (
                          <span key={sub} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#6EC1C3]/15 text-[#5AB0B2] border border-[#6EC1C3]/30 tracking-wide uppercase">{sub}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-black text-xs text-[#D9A441] neu-inset px-2.5 py-1 rounded-lg border border-[#EBC67A]/50 whitespace-nowrap block">{s.package}</span>
                      <span className="text-[10px] text-[#9AA5A9] mt-1 block">tap to view</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (() => {
        const history = getMockHistory(selectedStudent);
        const realBookings = bookings.filter(b => b.studentId === selectedStudent.id);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#6EC1C3] to-[#5AB0B2] p-6 text-white relative flex-shrink-0">
                <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer">
                  <X size={16} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={selectedStudent.imageDataUrl} alt={selectedStudent.childName} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/50 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#D9A441] rounded-full flex items-center justify-center text-white text-xs font-bold shadow border-2 border-white">
                      {selectedStudent.childAge}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight">{selectedStudent.childName}</h3>
                    <p className="opacity-80 text-sm mt-0.5 flex items-center gap-1.5">
                      <GraduationCap size={13} /> {selectedStudent.schoolName}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedStudent.subjects.map(sub => (
                        <span key={sub} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 border border-white/30 tracking-wide uppercase">{sub}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
                {/* Parent Info */}
                <div className="neu-flat rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[11px] font-black tracking-widest text-[#9AA5A9] uppercase flex items-center gap-1.5"><Star size={11} /> Parent Info</span>
                  <p className="font-bold text-[#1F2A2E]">{selectedStudent.parentName}</p>
                  <p className="text-sm text-[#5F6B6F] flex items-center gap-1.5"><Phone size={13} /> {selectedStudent.parentPhone}</p>
                  <p className="text-sm text-[#5F6B6F] flex items-center gap-1.5"><MapPin size={13} /> {selectedStudent.parentAddress}</p>
                </div>

                {/* Package */}
                <div className="flex items-center justify-between neu-inset rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[#5F6B6F] font-semibold text-sm">
                    <BookOpen size={15} /> Package
                  </div>
                  <span className="font-black text-[#D9A441] text-sm border border-[#EBC67A]/50 bg-[#D9A441]/5 rounded-xl px-3 py-1">{selectedStudent.package} — {PACKAGE_PRICES[selectedStudent.package]} AED</span>
                </div>

                {/* Real bookings */}
                {realBookings.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black tracking-widest text-[#9AA5A9] uppercase flex items-center gap-1.5"><Clock size={11} /> Scheduled Sessions</span>
                    {realBookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between neu-flat rounded-xl px-4 py-2.5">
                        <span className="text-sm font-semibold text-[#1F2A2E]">{b.date}</span>
                        <span className="text-sm text-[#5F6B6F]">{b.timeSlot}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusColor('Upcoming')}`}>Upcoming</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* History */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-black tracking-widest text-[#9AA5A9] uppercase flex items-center gap-1.5"><CalendarCheck size={11} /> Session History</span>
                  <div className="flex flex-col gap-2">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 neu-flat rounded-xl px-4 py-2.5">
                        {statusIcon(h.status)}
                        <span className="text-sm text-[#5F6B6F] w-24 flex-shrink-0">{h.date}</span>
                        <span className="text-sm font-semibold text-[#1F2A2E] flex-1">{h.subject}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusColor(h.status)}`}>{h.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
