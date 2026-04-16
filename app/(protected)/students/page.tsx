'use client';

import { useState, useEffect, useRef } from 'react';
import { getStudents, addStudent, generateId } from '../../lib/storage';
import { Student, Subject, Package, PACKAGE_PRICES } from '../../lib/types';
import { Camera, AlertCircle, CheckCircle2, UserPlus, Phone, MapPin, Cake, GraduationCap } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
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
      parentName, parentPhone, parentAddress,
      childName, childAge: parseInt(childAge, 10), childDob,
      schoolName, subjects: selectedSubjects, package: selectedPackage,
      imageDataUrl: imagePreview,
      createdAt: new Date().toISOString()
    };

    addStudent(newStudent);
    setStudents(getStudents());
    setSuccess('Student successfully onboarded!');

    setParentName(''); setParentPhone(''); setParentAddress('');
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
                  <div key={s.id} className="neu-flat rounded-2xl p-4 flex gap-4 items-center">
                    <img src={s.imageDataUrl} alt={s.childName} className="w-14 h-14 rounded-full object-cover neu-inset" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] truncate text-[#1F2A2E]">{s.childName} <span className="font-normal text-xs text-[#9AA5A9]">({s.childAge}y)</span></h4>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {s.subjects.map(sub => (
                          <span key={sub} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#6EC1C3] text-white opacity-90 tracking-wide uppercase">{sub}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-xs text-[#D9A441] neu-inset px-2.5 py-1 rounded-lg border border-[#EBC67A]/50 whitespace-nowrap">{s.package}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
