import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userApi } from '../api/userApi';
import { getStoredUser } from '../utils/auth';
import { User } from '../api/types';
import { User as UserIcon, Save, Mail, Phone, Calendar, Briefcase, Activity } from 'lucide-react';

export default function Profile() {
  const [userStr] = useState(localStorage.getItem('user'));
  const storedUser = userStr ? JSON.parse(userStr) : getStoredUser();
  const [user, setUser] = useState<User | null>(storedUser);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [profession, setProfession] = useState(user?.profession || 'Student (School/College)');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      if (!name || !phone || !dob || !profession) {
        throw new Error("Name, Phone, DOB, and Profession are strictly required.");
      }
      const updatedData: Partial<User> = {
        name,
        phone,
        dob,
        age: parseInt(age) || undefined,
        profession
      };
      
      const response = await userApi.updateUser(updatedData);
      setUser(response);
      localStorage.setItem('user', JSON.stringify({ ...user, ...response }));
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated securely.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit uppercase">
            Personal Profile
          </h1>
          <p className="text-slate-400 font-medium tracking-tight mt-2">
            Manage your secure identification details and account preferences.
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`px-6 py-4 rounded-xl text-sm font-bold tracking-wide border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identity Group */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <UserIcon size={14} /> Global Identity
              </h3>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="email" value={user?.email || ''} disabled className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl font-medium cursor-not-allowed" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                 <div className="relative">
                   <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing}
                     className={`w-full pl-11 pr-4 py-3 border rounded-xl font-medium transition-all ${isEditing ? 'bg-white border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                   />
                 </div>
              </div>
            </div>

            {/* Demographics Group */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={14} /> Demographics
              </h3>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing}
                     className={`w-full pl-11 pr-4 py-3 border rounded-xl font-medium transition-all ${isEditing ? 'bg-white border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                   />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">DOB *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date" required value={dob} onChange={(e) => setDob(e.target.value)} disabled={!isEditing}
                        className={`w-full pl-11 pr-3 py-3 border rounded-xl font-medium transition-all ${isEditing ? 'bg-white border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                    <input 
                      type="number" value={age} onChange={(e) => setAge(e.target.value)} disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl font-medium transition-all ${isEditing ? 'bg-white border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Profession *</label>
                 <div className="relative">
                   <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <select 
                     required value={profession} onChange={(e) => setProfession(e.target.value)} disabled={!isEditing}
                     className={`w-full pl-11 pr-4 py-3 border rounded-xl font-medium transition-all ${isEditing ? 'bg-white border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                   >
                     <option value="Student (School/College)">Student (School/College)</option>
                     <option value="Working Professional">Working Professional</option>
                     <option value="Self Employed">Self Employed</option>
                     <option value="Business">Business</option>
                   </select>
                 </div>
              </div>

            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100 mt-8">
               <button 
                 type="button" 
                 onClick={() => { setIsEditing(false); setMessage(null); }}
                 className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
               >
                 <Save size={18} />
                 <span>{isLoading ? 'Encrypting...' : 'Save Profile Details'}</span>
               </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
