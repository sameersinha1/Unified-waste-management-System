import React, { useState, useEffect } from 'react';

// Main CSS file for create-react-app, can be used for global styles
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- Helper Function ---
const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hoursInt = parseInt(hours, 10);
    const ampm = hoursInt >= 12 ? 'PM' : 'AM';
    const formattedHours = hoursInt % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
};

// --- SVG Icons ---
const Icons = {
    Logo: () => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
    User: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
    Routes: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    Scan: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6.586 4.414l-1.414-1.414M4 12H2m13.586-6.414l1.414-1.414M12 20v-1m6-1a6 6 0 01-12 0 6 6 0 0112 0z"></path></svg>,
    Report: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
    Schedule: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    Camera: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Location: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

// --- Reusable UI Components ---
const BottomNav = ({ userType, activePage, setActivePage }) => {
    const navItems = userType === 'staff'
        ? [{ icon: Icons.Routes, label: 'Routes' }, { icon: Icons.Scan, label: 'Scan' }, { icon: Icons.Report, label: 'Report' }, { icon: Icons.User, label: 'Profile' }]
        : [{ icon: Icons.Home, label: 'Home' }, { icon: Icons.Schedule, label: 'Schedule' }, { icon: Icons.Scan, label: 'Scan' }, { icon: Icons.Report, label: 'Report' }, { icon: Icons.User, label: 'Profile' }];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around max-w-md mx-auto">
            {navItems.map(item => (
                <button key={item.label} onClick={() => setActivePage(item.label.toLowerCase())} className={`flex flex-col items-center justify-center p-3 w-full text-sm ${activePage === item.label.toLowerCase() ? 'text-green-600' : 'text-gray-500'}`}>
                    <item.icon />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};

const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-end">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

const ReportIssueForm = ({ onClose, reporterId }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const reportData = {
            reporter: reporterId,
            issue_type: e.target.issueType.value,
            description: e.target.description.value,
            location: e.target.location.value,
            status: 'New'
        };

        try {
            const response = await fetch(`${API_BASE_URL}/issue-reports/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData)
            });
            if (!response.ok) throw new Error('Failed to submit report');
            
            alert("Issue reported successfully!");
            onClose();
        } catch (error) {
            console.error("Report submission error:", error);
            alert("Error: Could not submit report.");
        }
    };

    return (
         <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Report an Issue</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">Issue Type</label>
                    <select id="issueType" name="issueType" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border">
                        <option>Overflowing Bin</option>
                        <option>Damaged Bin</option>
                        <option>Missed Collection</option>
                        <option>Illegal Dumping</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows="3" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" placeholder="Please describe the issue in detail..."></textarea>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icons.Location />
                        </div>
                        <input type="text" name="location" id="location" className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2" placeholder="Enter location or address" />
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Submit Report</button>
            </div>
        </form>
    );
};

const ScanModal = ({ onClose, title }) => (
    <div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="bg-gray-900 aspect-square w-full max-w-sm mx-auto rounded-lg flex items-center justify-center relative p-4">
            <div className="w-3/4 h-3/4 border-4 border-dashed border-green-400 rounded-lg flex items-center justify-center">
                 <Icons.Camera />
            </div>
        </div>
        <p className="text-center text-gray-600 mt-4">Position the QR code within the frame above</p>
        <div className="mt-6 text-center">
            <button onClick={onClose} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 w-full">Simulate Scan (Demo)</button>
        </div>
    </div>
);

// --- Page/Dashboard Components ---

const StaffDashboard = ({ userData, onLogout, openModal }) => {
    const [activePage, setActivePage] = useState('routes');
    const { user, dashboardData } = userData;

    if (!dashboardData) return <div className="p-8 text-center">Loading dashboard...</div>;
    
    const { shift, progress, tasks } = dashboardData;

    const priorityStyles = { high: 'bg-red-100 text-red-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-blue-100 text-blue-800' };
    const statusStyles = { pending: 'bg-gray-100 text-gray-800', 'in progress': 'bg-orange-100 text-orange-800' };

    const quickActions = [
        { label: 'Log Collection', color: 'bg-green-500', action: () => openModal(<ScanModal onClose={() => openModal(null)} title="Scan Collection Bin"/>) },
        { label: 'View Route', color: 'bg-blue-500', action: () => alert("Opening today's collection route...") },
        { label: 'Report Issue', color: 'bg-orange-500', action: () => openModal(<ReportIssueForm onClose={() => openModal(null)} reporterId={user.user_id} />) },
        { label: 'Team Chat', color: 'bg-red-500', action: () => alert("Opening team chat channel...") },
    ];

    return (
        <div className="w-full h-full bg-gray-100 pb-20 fade-in">
             <div className="bg-green-600 p-4 text-white shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Hello, {user.full_name.split(' ')[0]}!</h1>
                        <p className="text-sm opacity-90">Welcome back to your dashboard</p>
                    </div>
                    <div className="bg-white/20 text-xs px-3 py-1 rounded-full">{user.role}</div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="bg-green-500 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium">Current Shift</p>
                            <p className="text-xs">{user.username}</p>
                        </div>
                        <span className="bg-white/90 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-sm">Shift Time</p>
                            <p className="font-bold text-lg">{formatTime(shift?.start)} - {formatTime(shift?.end)}</p>
                        </div>
                        {shift?.remaining && (
                            <div>
                                <p className="text-sm text-right">Remaining</p>
                                <p className="font-bold text-lg">{shift.remaining}</p>
                            </div>
                        )}
                    </div>
                </div>

                {progress && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <p className="text-2xl font-bold">{progress.routes}/{progress.totalRoutes}</p>
                            <p className="text-sm text-gray-600">Routes</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <p className="text-2xl font-bold">{progress.binsCollected}</p>
                            <p className="text-sm text-gray-600">Bins Collected</p>
                        </div>
                    </div>
                )}
                
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Priority Tasks</h2>
                    <div className="space-y-3">
                        {tasks && tasks.length > 0 ? tasks.map(task => (
                            <div key={task.task_id} className="bg-white p-3 rounded-lg shadow flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{task.location_name}</p>
                                    <div className="flex items-center space-x-2 text-xs mt-1">
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}>{task.priority}</span>
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${statusStyles[task.status]}`}>{task.status}</span>
                                    </div>
                                </div>
                                <button className="text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">View</button>
                            </div>
                        )) : <p className="text-sm text-gray-500 p-4 bg-white rounded-lg text-center">No tasks assigned.</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map(action => (
                            <button key={action.label} onClick={action.action} className={`${action.color} text-white font-bold py-4 rounded-lg shadow-md hover:opacity-90`}>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <button onClick={onLogout} className="w-full text-center p-4 text-red-500 font-medium">Logout</button>
            <BottomNav userType="staff" activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
};

const CitizenDashboard = ({ userData, onLogout, openModal }) => {
    const [activePage, setActivePage] = useState('home');
    const { user, dashboardData } = userData;

    if (!dashboardData) return <div className="p-8 text-center">Loading dashboard...</div>;

    const { rewards, pickup, tips } = dashboardData;

    const quickActions = [
        { label: 'Scan Waste to Earn', color: 'bg-green-500', action: () => openModal(<ScanModal onClose={() => openModal(null)} title="Scan Waste Kiosk"/>) },
        { label: 'Report an Issue', color: 'bg-orange-500', action: () => openModal(<ReportIssueForm onClose={() => openModal(null)} reporterId={user.user_id} />) },
        { label: 'Find Kiosks', color: 'bg-blue-500', action: () => alert("Opening map to show nearby waste stations...") },
        { label: 'Redeem Rewards', color: 'bg-red-500', action: () => alert("Opening rewards catalog...") },
    ];

    return (
        <div className="w-full h-full bg-gray-100 pb-20 fade-in">
            <div className="bg-green-600 p-4 text-white shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Hello, {user.full_name.split(' ')[0]}!</h1>
                        <p className="text-sm opacity-90">Welcome to your dashboard</p>
                    </div>
                     <div className="bg-white/20 text-xs px-3 py-1 rounded-full">{user.role}</div>
                </div>
            </div>
            
            <div className="p-4 space-y-4">
                {rewards && (
                    <div className="bg-white rounded-lg p-4 shadow-lg text-center">
                        <p className="text-sm text-gray-600">Your Reward Points</p>
                        <p className="text-4xl font-bold text-green-600">{rewards.points}</p>
                    </div>
                )}
                
                {pickup && (
                    <div className="bg-white rounded-lg p-4 shadow">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Next Pickup</p>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{pickup.status}</span>
                        </div>
                        <p className="text-lg text-gray-800 mt-1">{pickup.next_pickup_date}, {formatTime(pickup.next_pickup_time)}</p>
                        <p className="text-sm text-gray-500">{pickup.waste_type}</p>
                    </div>
                )}
                
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map(action => (
                            <button key={action.label} onClick={action.action} className={`${action.color} text-white text-sm font-bold p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-24 hover:opacity-90`}>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {tips && tips.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Tips & Updates</h2>
                        <div className="space-y-3">
                            {tips.map(tip => (
                                <div key={tip.id} className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{tip.title}</p>
                                        {tip.isNew && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">New</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{tip.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <button onClick={onLogout} className="w-full text-center p-4 text-red-500 font-medium">Logout</button>
            <BottomNav userType="citizen" activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
};

const LoginPage = ({ onLogin, error, loading }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="bg-gray-900 text-white w-full max-w-md mx-auto rounded-lg shadow-2xl p-8 space-y-6 fade-in">
            <div className="text-center space-y-2">
                <div className="mx-auto bg-green-600 w-16 h-16 rounded-full flex items-center justify-center"> <Icons.Logo /> </div>
                <h1 className="text-2xl font-bold">Cyber City</h1>
                <p className="text-gray-400">Waste Management System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">Mobile Number / Employee ID</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., EMP001" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter your password" />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition duration-300 disabled:bg-gray-500">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

// --- Main App Component ---
function App() {
    const [userData, setUserData] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');

    const handleLogin = async (username, password) => {
        setLoginError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            setUserData(data);
            setShowSuccess(`Welcome back! Successfully logged in as ${data.user.role}`);
            setTimeout(() => setShowSuccess(''), 3000);

        } catch (error) {
            console.error("Login error:", error);
            setLoginError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUserData(null);
    };
    
    const renderDashboard = () => {
        if (!userData) {
            return <LoginPage onLogin={handleLogin} error={loginError} loading={loading} />;
        }
        switch (userData.user.role) {
            case 'staff':
                return <StaffDashboard userData={userData} onLogout={handleLogout} openModal={setModalContent} />;
            case 'citizen':
                return <CitizenDashboard userData={userData} onLogout={handleLogout} openModal={setModalContent} />;
            default:
                return <LoginPage onLogin={handleLogin} error={loginError} loading={loading} />;
        }
    };

    return (
        <div className="relative w-full max-w-md h-screen overflow-y-auto bg-gray-100 shadow-2xl mx-auto">
            {showSuccess && <div className="bg-green-500 text-white p-3 text-center text-sm sticky top-0 z-50">{showSuccess}</div>}
            {renderDashboard()}
            {modalContent && <Modal onClose={() => setModalContent(null)}>{modalContent}</Modal>}
        </div>
    );
};

export default App;
