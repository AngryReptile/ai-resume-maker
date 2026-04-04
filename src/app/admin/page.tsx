'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, FileText, Activity, ShieldCheck, 
  ExternalLink, Search, Loader2, Zap, BarChart3,
  AlertCircle, ChevronRight, Fingerprint
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'activity'>('stats');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/dashboard');
      return;
    }
    if (isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin, authLoading]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: resumeCount } = await supabase.from('resumes').select('*', { count: 'exact', head: true });
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: allResumes } = await supabase
        .from('resumes')
        .select('user_id');

      const { data: resumesData, error: resumeJoinError } = await supabase
        .from('resumes')
        .select('*, profiles(email, full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);

      let finalRecentResumes = resumesData || [];

      if (resumeJoinError) {
        const { data: basicResumes } = await supabase
          .from('resumes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (basicResumes) {
          const userIds = basicResumes.map(r => r.user_id);
          const { data: profileDetails } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url')
            .in('id', userIds);
          
          finalRecentResumes = basicResumes.map(r => ({
            ...r,
            profiles: profileDetails?.find(p => p.id === r.user_id) || null
          }));
        }
      }

      const usersWithCounts = profilesData?.map(profile => ({
        ...profile,
        resumes: [{ count: allResumes?.filter(r => r.user_id === profile.id).length || 0 }]
      })) || [];

      setStats({
        totalUsers: userCount || 0,
        totalResumes: resumeCount || 0,
        activeUsers: usersWithCounts.filter(u => u.resumes?.[0]?.count > 0).length || 0
      });
      setUsers(usersWithCounts);
      setRecentResumes(finalRecentResumes);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="relative flex flex-col items-center gap-6">
            <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full animate-pulse" />
            <Loader2 className="relative h-12 w-12 animate-spin text-indigo-500" />
            <p className="relative text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400">Mission Control Syncing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] pt-24 pb-20 overflow-hidden selection:bg-indigo-500/30">
      {/* High-Fidelity Background Architecture */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none animate-warp" />
      <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none animate-warp-reverse" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 py-2 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
            >
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Admin Dashboard Active</span>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Status</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.8] uppercase font-display">
                Command<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-white/20">Center</span>
              </h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[9px] ml-1">
                Manage Users and Platform Statistics
              </p>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-3xl">
              {(['stats', 'users', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 font-display
                    ${activeTab === tab 
                      ? 'bg-white text-black shadow-2xl scale-105' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard 
                  label="Total Users" 
                  value={stats?.totalUsers || 0} 
                  icon={<Users size={20} />} 
                  color="indigo"
                  delay={0.1}
                />
                <AdminStatCard 
                  label="Total Resumes" 
                  value={stats?.totalResumes || 0} 
                  icon={<FileText size={20} />} 
                  color="emerald"
                  delay={0.2}
                />
                <AdminStatCard 
                  label="Active Users" 
                  value={stats?.activeUsers || 0} 
                  icon={<Activity size={20} />} 
                  color="amber"
                  delay={0.3}
                />
              </div>

              <div className="liquid-glass rounded-3xl p-8 relative overflow-hidden group border-white/5">
                <div className="flex items-center justify-between mb-8 px-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase font-display">
                        <Zap size={20} className="text-indigo-400" /> Recent Activity
                    </h3>
                    <div className="h-px flex-1 bg-white/5 mx-8" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Last 10 Events</span>
                </div>

                <div className="space-y-4">
                  {recentResumes.map((res, i) => (
                    <motion.div 
                      key={res.id} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-8 p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl transition-all duration-500 group/item"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-indigo-400 group-hover/item:rotate-6 transition-all duration-500 border border-white/10 shadow-xl">
                        {res.profiles?.full_name?.[0] || res.profiles?.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-white truncate tracking-tight font-display">{res.title || 'Untitled Archive'}</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2 opacity-60">
                           <span className="text-zinc-300">{res.profiles?.email}</span> • {new Date(res.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="h-12 w-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 text-zinc-500 hover:text-white hover:bg-indigo-500 transition-all duration-500">
                        <ExternalLink size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="liquid-glass rounded-3xl overflow-hidden border-white/5"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="px-6 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">User Name</th>
                      <th className="px-6 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Email Address</th>
                      <th className="px-6 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] text-center">Resumes</th>
                      <th className="px-6 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-all group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl relative overflow-hidden">
                                {u.full_name?.[0] || u.email[0].toUpperCase()}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="space-y-1">
                               <span className="text-lg font-black text-white block tracking-tighter leading-none font-display">{u.full_name || 'Anonymous User'}</span>
                               <div className="flex items-center gap-2">
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${u.role === 'admin' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-zinc-600 bg-white/5 border-white/5'}`}>{u.role}</span>
                                    <Fingerprint size={10} className="text-zinc-700" />
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                            <span className="text-xs font-bold text-zinc-500 tracking-tight group-hover:text-zinc-300 transition-colors uppercase italic">{u.email}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-indigo-400 font-black text-sm shadow-inner group-hover:border-indigo-500/20 transition-all font-display">
                              <FileText size={14} />
                              {u.resumes?.[0]?.count || 0}
                            </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 text-[9px] font-black text-emerald-500 uppercase tracking-widest italic translate-x-2 group-hover:translate-x-0 transition-transform">
                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" /> 
                            Synchronized
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              key="activity" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="flex flex-col items-center justify-center py-32 liquid-glass rounded-3xl border-white/5"
            >
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 relative">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full animate-pulse" />
                  <BarChart3 className="relative w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 font-display">Activity Stream</h3>
                <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px]">Architecting real-time intelligence feed</p>
                <div className="mt-12 flex gap-2">
                    {[1, 2, 3].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="h-1 w-8 rounded-full bg-indigo-500/20" />)}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminStatCard({ label, value, icon, color, delay }: { label: string, value: number, icon: React.ReactNode, color: string, delay: number }) {
  const colors: any = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group relative p-8 rounded-3xl liquid-glass border-white/5 overflow-hidden transition-all duration-700 hover:border-white/10 shadow-2xl`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`p-4 rounded-2xl ${colors[color]} border transition-all duration-700 group-hover:scale-110 group-hover:rotate-6`}>
            {icon}
          </div>
          <div className="flex gap-1.5 translate-y-[-10px]">
             {[1, 2].map(i => <div key={i} className={`h-1 w-1 rounded-full ${color === 'indigo' ? 'bg-indigo-500/40' : color === 'emerald' ? 'bg-emerald-500/40' : 'bg-amber-500/40'}`} />)}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2 group-hover:text-zinc-300 transition-colors italic">{label}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white tracking-tighter leading-[0.8] font-display">
              {value.toLocaleString()}
            </span>
            <div className={`h-2 w-2 rounded-full ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.2)]`} />
          </div>
        </div>
      </div>
      
      {/* Decorative Scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-[20%] w-full animate-[scan_4s_linear_infinite] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-white/[0.01] blur-[100px] rounded-full group-hover:bg-white/[0.03] transition-all duration-1000" />
    </motion.div>
  );
}
