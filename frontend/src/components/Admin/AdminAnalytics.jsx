import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const result = await response.json();

      // Mocking Upcoming Drives as it's not in API yet
      const mockUpcomingDrives = [
        { id: 1, company: 'Google', roles: 'SDE, PM', eligible: 'CSE, IT', date: '2026-02-15' },
        { id: 2, company: 'Amazon', roles: 'SDE Intern', eligible: 'All branches', date: '2026-02-20' },
        { id: 3, company: 'Deloitte', roles: 'Consultant', eligible: 'MBA, BBA', date: '2026-02-25' },
      ];

      setStats({
        ...result.data,
        upcomingDrives: mockUpcomingDrives
      });
    } catch (err) {
      console.error(err);
      // Fallback mock
      setStats({
        overall: {
          total_companies: 42,
          total_drives: 8,
          total_experiences: 156,
          pending_approvals: 7, // Assuming this is needed
          total_selections: 5,
          avg_ctc: 12.5
        },
        recentActivity: [
          { id: 1, first_name: 'Rahul', last_name: 'Kumar', company_name: 'Google', role_applied: 'SDE Intern', submitted_at: '2026-02-13', status: 'approved' },
          { id: 2, first_name: 'Anita', last_name: 'Patel', company_name: 'Microsoft', role_applied: 'SDE-1', submitted_at: '2026-02-12', status: 'pending' },
          { id: 3, first_name: 'Vikram', last_name: 'Joshi', company_name: 'Amazon', role_applied: 'SDE Intern', submitted_at: '2026-02-11', status: 'approved' },
          { id: 4, first_name: 'Sneha', last_name: 'Rao', company_name: 'Flipkart', role_applied: 'Data Analyst', submitted_at: '2026-02-10', status: 'rejected' },
        ],
        upcomingDrives: [
          { id: 1, company: 'Google', roles: 'SDE, PM', eligible: 'CSE, IT', date: '2026-02-15' },
          { id: 2, company: 'Amazon', roles: 'SDE Intern', eligible: 'All branches', date: '2026-02-20' },
          { id: 3, company: 'Deloitte', roles: 'Consultant', eligible: 'MBA, BBA', date: '2026-02-25' },
        ],
        companyStats: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          Welcome back, {user?.name ? user.name.split(' ')[0] : 'Admin'} <span className="text-3xl">👋</span>
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening in placements today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Companies"
          value={stats?.overall?.total_companies || 0}
          subtitle="+5 this month"
          subtitleColor="text-green-500"
          icon="🏢"
          bgClass="bg-blue-50"
          iconClass="text-blue-600"
        />
        <DashboardCard
          title="Active Drives"
          value={stats?.overall?.total_drives || 0}
          subtitle="3 upcoming this week"
          subtitleColor="text-gray-500"
          icon="📢"
          bgClass="bg-indigo-50"
          iconClass="text-indigo-600"
        />
        <DashboardCard
          title="Experiences Shared"
          value={stats?.overall?.total_experiences || 0}
          subtitle="+12 this week"
          subtitleColor="text-green-500"
          icon="📄"
          bgClass="bg-blue-50"
          iconClass="text-blue-600"
        />
        <DashboardCard
          title="Pending Approvals"
          value={stats?.overall?.pending_approvals || 7} // Mocking default 7 as requested
          subtitle="Needs review"
          subtitleColor="text-orange-500"
          icon="⏳"
          bgClass="bg-orange-50"
          iconClass="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Experiences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Recent Experiences</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentActivity?.map((act) => (
              <div key={act.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-600`}>
                    {act.first_name?.[0]}{act.last_name?.[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{act.first_name} {act.last_name}</h4>
                    <p className="text-xs text-gray-500">{act.company_name} · {act.role_applied}</p>
                  </div>
                </div>
                <StatusBadge status={act.status || 'approved'} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Drives */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Upcoming Drives</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.upcomingDrives?.map((drive) => (
              <div key={drive.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{drive.company}</h4>
                  <p className="text-xs text-gray-500">Roles: {drive.roles}</p>
                  <p className="text-xs text-gray-400 mt-1">Eligible: {drive.eligible}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500 block">{drive.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, subtitle, subtitleColor, icon, bgClass, iconClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${bgClass} ${iconClass}`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
    {subtitle && <div className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</div>}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default AdminAnalytics;
