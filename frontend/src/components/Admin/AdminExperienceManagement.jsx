import React, { useState, useEffect } from 'react';
import {
    Article as ArticleIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosConfig';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const RESULT_COLORS = {
    pass: 'text-green-600',
    fail: 'text-red-500',
    not_sure: 'text-amber-600',
};

const AdminExperienceManagement = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [companySearch, setCompanySearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        fetchExperiences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, page]);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (statusFilter) params.status = statusFilter;
            if (companySearch) params.company_name = companySearch;

            const res = await axiosInstance.get('/admin/submissions/all', { params });
            setExperiences(res.data.data || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error('Failed to load experiences:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchExperiences();
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Experiences</h1>
                    <p className="text-gray-500 mt-1 text-sm">{total} total submissions across all statuses</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 mb-6 flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                    <SearchIcon className="text-gray-400" fontSize="small" />
                    <input
                        type="text"
                        placeholder="Search by company name..."
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        className="flex-1 py-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                    />
                </form>

                <div className="flex items-center gap-2">
                    <FilterIcon fontSize="small" className="text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none bg-white focus:border-indigo-400"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button
                        onClick={handleSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                    <ArticleIcon fontSize="small" className="text-indigo-500" />
                    <h3 className="text-base font-bold text-gray-800">Submissions</h3>
                    <span className="ml-auto text-xs text-gray-400">{total} record{total !== 1 ? 's' : ''}</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                    </div>
                ) : experiences.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <ArticleIcon sx={{ fontSize: 40 }} className="mb-2 opacity-30" />
                        <p className="text-sm">No experiences found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="text-left px-6 py-3">Company</th>
                                        <th className="text-left px-4 py-3">Role</th>
                                        <th className="text-center px-4 py-3">Result</th>
                                        <th className="text-center px-4 py-3">CTC</th>
                                        <th className="text-center px-4 py-3">Status</th>
                                        <th className="text-right px-6 py-3">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {experiences.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                        {exp.company_name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{exp.company_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{exp.role_applied}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-semibold capitalize ${RESULT_COLORS[exp.result] || 'text-gray-500'}`}>
                                                    {exp.result === 'pass' ? '✅ Selected' : exp.result === 'fail' ? '❌ Not Selected' : '⏳ Awaiting'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-700 font-medium">
                                                {exp.ctc_offered ? `₹${exp.ctc_offered} LPA` : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[exp.approval_status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {exp.approval_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right text-xs text-gray-400">
                                                {exp.submitted_at ? new Date(exp.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        ← Prev
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminExperienceManagement;
