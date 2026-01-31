import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const mockSummaryData = {
    totalVisitors: 12500,
    nusantara: 11000,
    mancanegara: 1500,
    avgStay: 2.5,
    occupancy: 78,
    avgSpending: 750000
};

const mockChartData = [
    { month: 'Jan', visitors: 1000 },
    { month: 'Feb', visitors: 1200 },
    { month: 'Mar', visitors: 1100 },
    { month: 'Apr', visitors: 1300 },
    { month: 'May', visitors: 1400 },
    { month: 'Jun', visitors: 1500 }
];

// Components
function Navbar({ user, isAdmin }) {
    return (
        <nav className="bg-green-600 text-white p-4 shadow-lg">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">SAMPURASUN</h1>
                <div className="flex items-center space-x-4">
                    <span>Halo, {user?.name || 'Admin'}</span>
                    <button className="bg-white text-green-600 px-3 py-1 rounded-lg" onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

function SummaryCard({ title, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="mr-4 text-2xl">{icon}</div>
            <div>
                <h3 className="text-gray-600">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function Dashboard() {
    const [status, setStatus] = useState('green');
    const statusColors = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500'
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Stakeholder</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Wisatawan Nusantara" value={mockSummaryData.nusantara} icon="👥" />
                <SummaryCard title="Wisatawan Mancanegara" value={mockSummaryData.mancanegara} icon="✈️" />
                <SummaryCard title="Okupansi Rata-rata" value={`${mockSummaryData.occupancy}%`} icon="🏨" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold mb-4">Tren Kunjungan Bulanan</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visitors" fill="#4ade80" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold mb-4">Status Pelaporan</h3>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${statusColors[status]} mr-2`}></div>
                        <span className="capitalize">
                            {status === 'green' && 'Sudah Lapor'}
                            {status === 'yellow' && 'Belum Lapor'}
                            {status === 'red' && 'Suspend'}
                        </span>
                    </div>
                    <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
                        Lapor Data Bulan Ini
                    </button>
                </div>
            </div>
        </div>
    );
}

function Report() {
    const [formData, setFormData] = useState({
        nusantara: '',
        mancanegara: '',
        origin: '',
        stayDuration: '',
        occupancy: '',
        avgSpending: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Data berhasil disimpan!');
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Lapor Data Bulan Ini</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Wisatawan Nusantara</label>
                    <input
                        type="number"
                        name="nusantara"
                        value={formData.nusantara}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label>Wisatawan Mancanegara</label>
                    <input
                        type="number"
                        name="mancanegara"
                        value={formData.mancanegara}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label>Negara Asal Wisman Terbanyak</label>
                    <select
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Pilih...</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapura">Singapura</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div>
                    <label>Rata-rata Lama Menginap (hari)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="stayDuration"
                        value={formData.stayDuration}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label>Tingkat Okupansi (%)</label>
                    <input
                        type="number"
                        max="100"
                        name="occupancy"
                        value={formData.occupancy}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label>Estimasi Pengeluaran Rata-rata (Rp)</label>
                    <input
                        type="number"
                        name="avgSpending"
                        value={formData.avgSpending}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    Simpan Data
                </button>
            </form>
        </div>
    );
}

function AdminDashboard() {
    const [data, setData] = useState({
        totalVisitors: 0,
        avgOccupancy: 0,
        stakeholders: []
    });

    useEffect(() => {
        fetch('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(setData);
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3>Total Kunjungan</h3>
                    <p className="text-3xl font-bold text-green-600">{data.totalVisitors.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3>Okupansi Rata-rata</h3>
                    <p className="text-3xl font-bold text-blue-600">{data.avgOccupancy}%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3>Stakeholder Aktif</h3>
                    <p className="text-3xl font-bold text-purple-600">{data.stakeholders.length}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h3 className="font-bold mb-4">Status Stakeholder</h3>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Jenis</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.stakeholders.map(s => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.type}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-white ${
                                        s.status === 'green' ? 'bg-green-500' :
                                        s.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                        {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold mb-4">Ekspor Laporan</h3>
                <a href="/api/admin/export/monthly" download className="bg-blue-600 text-white px-4 py-2 rounded">
                    Ekspor Bulanan (CSV)
                </a>
            </div>
        </div>
    );
}

function AdminLogin({ onLogin }) {
    const [creds, setCreds] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            onLogin();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6">Login Admin</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setCreds({...creds, username: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setCreds({...creds, password: e.target.value})}
                />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg">
                    Login
                </button>
            </form>
        </div>
    );
}

function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(true);
        }
    }, []);

    if (!isLoggedIn) {
        return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar user={{ name: 'Admin' }} isAdmin={true} />
                <div className="flex flex-1">
                    <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block">
                        <nav>
                            <ul className="space-y-2">
                                <li><a href="/admin" className="block py-2">Dashboard Admin</a></li>
                                <li><a href="/reports" className="block py-2">Laporan Data</a></li>
                                <li><a href="/stakeholders" className="block py-2">Manajemen Stakeholder</a></li>
                                <li><a href="/content" className="block py-2">Pusat Unduhan</a></li>
                            </ul>
                        </nav>
                    </aside>

                    <main className="flex-1 bg-gray-100">
                        <Routes>
                            <Route path="/" element={<Navigate to="/admin" />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/report" element={<Report />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
