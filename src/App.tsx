import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  FilePlus, 
  Database, 
  Menu, 
  X, 
  ChevronRight, 
  History, 
  Target, 
  Flag, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Download, 
  Search,
  TrendingUp,
  Calendar,
  Hash,
  Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, startOfDay, startOfMonth, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

// --- Types ---
interface Surat {
  id: string;
  perihal: string;
  kode_surat: string;
  tanggal: string;
  tujuan: string;
  pembuat: string;
  created_at: string;
}

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'pengambilan', label: 'Pengambilan Nomor Surat', icon: FilePlus },
    { id: 'rekap', label: 'Data / Rekap Surat', icon: Database },
  ];

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Logo_Kemenkumham_Baru.png" alt="Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">RUTAN SABANG</h1>
              <p className="text-[10px] text-silver uppercase tracking-widest">Sistem Nomor Surat</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === item.id 
                      ? 'bg-gold text-navy shadow-lg scale-105' 
                      : 'hover:bg-white/10 text-silver hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-silver hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy/95 backdrop-blur-sm border-t border-white/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${
                    activeTab === item.id 
                      ? 'bg-gold text-navy' 
                      : 'text-silver hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Beranda = () => {
  const steps = [
    { title: 'Mengisi Data Surat', desc: 'Lengkapi formulir dengan perihal, kode, tanggal, tujuan, dan nama pembuat.', icon: FilePlus },
    { title: 'Menyimpan Data', desc: 'Klik tombol simpan untuk mendaftarkan surat ke dalam sistem database.', icon: CheckCircle2 },
    { title: 'Nomor Tersimpan', desc: 'Sistem akan memberikan konfirmasi bahwa nomor surat telah berhasil dialokasikan.', icon: Hash },
    { title: 'Data Masuk Sistem', desc: 'Data surat dapat dilihat dan direkap pada halaman Data / Rekap Surat.', icon: Database },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white p-8 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Sistem Pengambilan <span className="text-gold">Nomor Surat</span>
            </h2>
            <p className="text-xl text-silver mt-4 font-light">
              Rumah Tahanan Negara Kelas IIB Sabang
            </p>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-slate-300 leading-relaxed"
          >
            Selamat datang di portal resmi administrasi persuratan Rutan Sabang. 
            Kami berkomitmen untuk menyediakan layanan yang transparan, akuntabel, 
            dan profesional dalam setiap proses administrasi negara.
          </motion.p>
        </div>
      </section>

      {/* Profil Instansi */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-navy/5 w-12 h-12 rounded-xl flex items-center justify-center text-navy mb-6">
            <History size={24} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-navy">Sejarah Singkat</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Rumah Tahanan Negara Kelas IIB Sabang merupakan Unit Pelaksana Teknis 
            di bawah Kantor Wilayah Kementerian Hukum dan HAM Aceh yang berlokasi 
            di ujung barat Indonesia, melayani penegakan hukum dan pembinaan warga binaan.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-gold/10 w-12 h-12 rounded-xl flex items-center justify-center text-gold mb-6">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-navy">Visi</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Mewujudkan sistem pemasyarakatan yang profesional, akuntabel, sinergi, 
            transparan, dan inovatif (PASTI) demi terciptanya keamanan dan ketertiban 
            serta pembinaan yang unggul.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="bg-navy/5 w-12 h-12 rounded-xl flex items-center justify-center text-navy mb-6">
            <Flag size={24} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-navy">Misi</h3>
          <ul className="text-slate-600 leading-relaxed text-sm space-y-2">
            <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /> Melaksanakan pembinaan kepribadian dan kemandirian.</li>
            <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /> Menjamin penegakan hukum dan hak asasi manusia.</li>
          </ul>
        </div>
      </section>

      {/* Prosedur */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-navy">Prosedur Pengambilan Nomor</h3>
          <p className="text-slate-500 mt-2">Ikuti langkah-langkah berikut untuk mendapatkan nomor surat resmi</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 h-full flex flex-col items-center text-center group-hover:border-gold/50 transition-all duration-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-white transition-colors duration-300">
                  <step.icon size={28} />
                </div>
                <span className="absolute top-4 left-4 text-4xl font-black text-slate-100 -z-0 group-hover:text-gold/10 transition-colors">0{idx + 1}</span>
                <h4 className="font-bold text-navy mb-2 relative z-10">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed relative z-10">{step.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-slate-300">
                  <ChevronRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const PengambilanNomor = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    perihal: '',
    kode_surat: '',
    tanggal: format(new Date(), 'yyyy-MM-dd'),
    tujuan: '',
    pembuat: ''
  });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const resetForm = () => {
    setFormData({
      perihal: '',
      kode_surat: '',
      tanggal: format(new Date(), 'yyyy-MM-dd'),
      tujuan: '',
      pembuat: ''
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('surat')
        .insert([formData]);

      if (error) throw error;

      showToast('Nomor surat berhasil disimpan!', 'success');
      resetForm();
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Gagal menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-navy p-8 text-white">
          <h2 className="text-2xl font-bold">Form Pengambilan Nomor</h2>
          <p className="text-silver text-sm mt-1">Lengkapi data di bawah ini dengan benar.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-navy">Perihal Surat</label>
              <input
                required
                type="text"
                value={formData.perihal}
                onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                placeholder="Contoh: Undangan Rapat Koordinasi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy">Kode Surat</label>
              <input
                required
                type="text"
                value={formData.kode_surat}
                onChange={(e) => setFormData({ ...formData, kode_surat: e.target.value })}
                placeholder="Contoh: W1.PAS.PAS.10"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy">Tanggal Surat</label>
              <input
                required
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy">Tujuan Surat</label>
              <input
                required
                type="text"
                value={formData.tujuan}
                onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                placeholder="Contoh: Kepala Kantor Wilayah"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy">Nama Pembuat</label>
              <input
                required
                type="text"
                value={formData.pembuat}
                onChange={(e) => setFormData({ ...formData, pembuat: e.target.value })}
                placeholder="Nama Lengkap"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Reset
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-[2] bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-navy/90 shadow-lg shadow-navy/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : (
                <>
                  <Download size={20} />
                  Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-3 z-[100] ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={24} /> : <X size={24} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RekapSurat = () => {
  const [data, setData] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    today: 0,
    month: 0,
    lastNum: '-'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: suratData, error } = await supabase
        .from('surat')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(suratData || []);
      
      // Calculate Stats
      const today = new Date();
      const todayCount = (suratData || []).filter(s => isSameDay(new Date(s.tanggal), today)).length;
      const monthCount = (suratData || []).filter(s => new Date(s.tanggal).getMonth() === today.getMonth()).length;
      const last = suratData && suratData.length > 0 ? suratData[0].kode_surat : '-';
      
      setStats({ today: todayCount, month: monthCount, lastNum: last });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase.from('surat').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Berhasil disalin!');
  };

  const exportToCSV = () => {
    const headers = ['Nomor', 'Perihal', 'Kode Surat', 'Tanggal', 'Tujuan', 'Pembuat'];
    const rows = data.map((s, idx) => [
      idx + 1,
      s.perihal,
      s.kode_surat,
      s.tanggal,
      s.tujuan,
      s.pembuat
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_surat_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredData = data.filter(s => 
    s.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.kode_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pembuat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tujuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart Data Preparation
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  }).map(day => ({
    date: format(day, 'dd MMM'),
    count: data.filter(s => isSameDay(new Date(s.tanggal), day)).length
  }));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyData = months.map((m, idx) => ({
    month: m,
    count: data.filter(s => new Date(s.tanggal).getMonth() === idx && new Date(s.tanggal).getFullYear() === new Date().getFullYear()).length
  }));

  return (
    <div className="space-y-10 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-navy/5 p-4 rounded-xl text-navy">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Surat Hari Ini</p>
            <h4 className="text-2xl font-bold text-navy">{stats.today}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-gold/10 p-4 rounded-xl text-gold">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Surat Bulan Ini</p>
            <h4 className="text-2xl font-bold text-navy">{stats.month}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-navy/5 p-4 rounded-xl text-navy">
            <Hash size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Nomor Terakhir</p>
            <h4 className="text-sm font-bold text-navy truncate max-w-[150px]">{stats.lastNum}</h4>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h5 className="font-bold text-navy mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-gold" />
            Grafik Harian (7 Hari Terakhir)
          </h5>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#001f3f" strokeWidth={3} dot={{ r: 4, fill: '#c5a059', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h5 className="font-bold text-navy mb-6 flex items-center gap-2">
            <Database size={18} className="text-gold" />
            Grafik Bulanan ({new Date().getFullYear()})
          </h5>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === new Date().getMonth() ? '#c5a059' : '#001f3f'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h5 className="font-bold text-navy text-xl">Daftar Rekap Surat</h5>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold outline-none text-sm w-full md:w-64"
              />
            </div>
            <button 
              onClick={exportToCSV}
              className="bg-navy text-white p-2.5 rounded-xl hover:bg-navy/90 transition-colors"
              title="Export CSV"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-navy uppercase text-[10px] font-black tracking-widest">
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Perihal</th>
                <th className="px-6 py-4">Kode Surat</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Tujuan</th>
                <th className="px-6 py-4">Pembuat</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">Memuat data...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">Tidak ada data ditemukan.</td>
                </tr>
              ) : filteredData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-navy">{item.perihal}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{item.kode_surat}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(item.tanggal), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.tujuan}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.pembuat}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => copyToClipboard(item.kode_surat)}
                        className="p-2 text-slate-400 hover:text-navy hover:bg-navy/5 rounded-lg transition-all"
                        title="Salin Kode"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Guide = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-3">
          <Info className="text-gold" />
          Panduan Penggunaan Sistem
        </h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-navy flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">1</div>
              Persiapan Supabase
            </h3>
            <ul className="list-disc ml-10 text-sm text-slate-600 space-y-2">
              <li>Buat akun dan project baru di <a href="https://supabase.com" target="_blank" className="text-gold hover:underline">Supabase</a>.</li>
              <li>Buka <b>SQL Editor</b> dan jalankan query berikut untuk membuat tabel:
                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl mt-2 overflow-x-auto text-xs">
{`CREATE TABLE surat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perihal TEXT NOT NULL,
  kode_surat TEXT NOT NULL,
  tanggal DATE NOT NULL,
  tujuan TEXT NOT NULL,
  pembuat TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </pre>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-navy flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">2</div>
              Konfigurasi API
            </h3>
            <ul className="list-disc ml-10 text-sm text-slate-600 space-y-2">
              <li>Buka <b>Project Settings</b> {'>'} <b>API</b>.</li>
              <li>Salin <b>Project URL</b> dan <b>anon public key</b>.</li>
              <li>Masukkan ke dalam file <code className="bg-slate-100 px-1 rounded">.env</code> atau langsung di <code className="bg-slate-100 px-1 rounded">src/lib/supabase.ts</code>.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-navy flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">3</div>
              Menjalankan Aplikasi
            </h3>
            <p className="ml-10 text-sm text-slate-600">
              Aplikasi ini menggunakan React + Vite. Cukup jalankan <code className="bg-slate-100 px-1 rounded">npm run dev</code> untuk memulai pengembangan lokal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigMissing = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-slate-100">
      <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center text-gold mx-auto">
        <Info size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-navy">Konfigurasi Diperlukan</h2>
        <p className="text-slate-500">
          Aplikasi belum terhubung ke Supabase. Silakan atur URL dan API Key di panel Secrets.
        </p>
      </div>
      <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs font-mono text-slate-600 space-y-2">
        <p>1. Buka menu Settings {'>'} Secrets</p>
        <p>2. Tambahkan VITE_SUPABASE_URL</p>
        <p>3. Tambahkan VITE_SUPABASE_ANON_KEY</p>
      </div>
      <p className="text-xs text-slate-400 italic">
        Lihat "Panduan Penggunaan" di bagian bawah untuk instruksi lengkap.
      </p>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [showGuide, setShowGuide] = useState(false);

  if (!isSupabaseConfigured && !showGuide) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <ConfigMissing />
        </main>
        <footer className="bg-white border-t border-slate-100 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <button 
              onClick={() => setShowGuide(true)}
              className="text-gold text-xs font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <Info size={14} />
              Lihat Panduan Penggunaan
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setShowGuide(false); }} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          {showGuide ? (
            <motion.div
              key="guide"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Guide />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'beranda' && <Beranda />}
              {activeTab === 'pengambilan' && <PengambilanNomor onSuccess={() => {}} />}
              {activeTab === 'rekap' && <RekapSurat />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-navy font-bold">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Logo_Kemenkumham_Baru.png" alt="Logo" className="h-6 w-auto" referrerPolicy="no-referrer" />
            <span>RUTAN KELAS IIB SABANG</span>
          </div>
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Hak Cipta Dilindungi. Sistem Administrasi Persuratan Digital.
          </p>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="text-gold text-xs font-medium hover:underline flex items-center gap-1 mx-auto"
          >
            <Info size={14} />
            {showGuide ? 'Kembali ke Aplikasi' : 'Panduan Penggunaan'}
          </button>
        </div>
      </footer>
    </div>
  );
}
