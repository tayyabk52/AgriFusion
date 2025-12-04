'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/consultant/DashboardLayout';
import { Users, Search, Filter, MoreVertical, MapPin, Phone, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { FarmerWithProfile, FarmerStats } from '@/types/farmer';
import { useConsultantApproval } from '@/contexts/ConsultantApprovalContext';
import { EditFarmerModal } from '@/components/dashboard/consultant/EditFarmerModal';
import { FarmerActionsMenu } from '@/components/dashboard/consultant/FarmerActionsMenu';
import { ConfirmationModal } from '@/components/dashboard/consultant/ConfirmationModal';

export default function FarmersPage() {
    const router = useRouter();
    const { isApproved } = useConsultantApproval();

    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<FarmerWithProfile[]>([]);
    const [filteredFarmers, setFilteredFarmers] = useState<FarmerWithProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [stats, setStats] = useState<FarmerStats>({
        total: 0,
        active: 0,
        newThisMonth: 0,
        pending: 0,
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [consultantProfileId, setConsultantProfileId] = useState<string | null>(null);

    // Modal states
    const [showEditFarmerModal, setShowEditFarmerModal] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<FarmerWithProfile | null>(null);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [farmerToRemove, setFarmerToRemove] = useState<FarmerWithProfile | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    // Auto-dismiss message after 4 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Apply search filter
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredFarmers(farmers);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = farmers.filter((farmer) => {
            const profile = farmer.profiles;
            const matchesName = profile?.full_name?.toLowerCase().includes(query);
            const matchesEmail = profile?.email?.toLowerCase().includes(query);
            const matchesPhone = profile?.phone?.includes(query);
            const matchesLocation =
                farmer.district?.toLowerCase().includes(query) ||
                farmer.state?.toLowerCase().includes(query);
            const matchesCrops = farmer.current_crops?.some((crop) =>
                crop.toLowerCase().includes(query)
            );

            return matchesName || matchesEmail || matchesPhone || matchesLocation || matchesCrops;
        });

        setFilteredFarmers(filtered);
    }, [searchQuery, farmers]);

    const checkAuthAndFetchData = async () => {
        try {
            // Check authentication
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/signin');
                return;
            }

            // Fetch consultant profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (profileError || !profile) {
                console.error('Error fetching profile:', profileError);
                setLoading(false);
                return;
            }

            // Verify role is consultant
            if (profile.role !== 'consultant') {
                router.push('/dashboard/farmer');
                return;
            }

            setConsultantProfileId(profile.id);

            // Fetch farmers linked to this consultant
            await fetchFarmers(profile.id);
        } catch (error) {
            console.error('Error in checkAuthAndFetchData:', error);
            setLoading(false);
        }
    };

    const fetchFarmers = async (consultantId: string) => {
        try {
            // Fetch farmers linked to this consultant
            const { data, error } = await supabase
                .from('farmers')
                .select(`
                    *,
                    profiles:profile_id (
                        id,
                        full_name,
                        email,
                        phone,
                        avatar_url,
                        status
                    )
                `)
                .eq('consultant_id', consultantId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch count of unassigned pending farmers (available to be linked)
            const { count: pendingCount, error: pendingError } = await supabase
                .from('farmers')
                .select('id', { count: 'exact', head: true })
                .is('consultant_id', null);

            if (pendingError) {
                console.error('Error fetching pending count:', pendingError);
            }

            const farmersData = (data || []) as FarmerWithProfile[];
            setFarmers(farmersData);
            setFilteredFarmers(farmersData);

            // Calculate stats with pending count
            calculateStats(farmersData, pendingCount || 0);
        } catch (error: any) {
            console.error('Error fetching farmers:', error);
            setMessage({ type: 'error', text: 'Failed to load farmers data.' });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (farmersData: FarmerWithProfile[], pendingCount: number) => {
        const total = farmersData.length;
        const active = farmersData.filter((f) => f.profiles?.status === 'active').length;

        // New registrations in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newThisMonth = farmersData.filter((f) => {
            const createdAt = new Date(f.created_at);
            return createdAt >= thirtyDaysAgo;
        }).length;

        // Pending represents unassigned farmers available to be linked
        setStats({ total, active, newThisMonth, pending: pendingCount });
    };

    const refreshFarmersList = () => {
        if (consultantProfileId) {
            fetchFarmers(consultantProfileId);
        }
    };

    // Modal handlers
    const handleEditFarmer = (farmer: FarmerWithProfile) => {
        setSelectedFarmer(farmer);
        setShowEditFarmerModal(true);
    };

    const handleEditFarmerSuccess = () => {
        setMessage({ type: 'success', text: 'Farmer details updated successfully!' });
        refreshFarmersList();
    };

    const handleViewFarmer = (farmer: FarmerWithProfile) => {
        // For now, just show farmer details in console
        // You could create a ViewFarmerModal later if needed
        console.log('View farmer:', farmer);
        setMessage({ type: 'success', text: 'View details feature coming soon!' });
    };

    const handleRemoveFarmer = (farmer: FarmerWithProfile) => {
        setFarmerToRemove(farmer);
        setShowRemoveConfirmModal(true);
    };

    const handleRemoveConfirm = async () => {
        if (!farmerToRemove) return;

        setIsRemoving(true);

        try {
            // Update farmers table to remove consultant link
            const { error: farmerError } = await supabase
                .from('farmers')
                .update({ consultant_id: null })
                .eq('id', farmerToRemove.id);

            if (farmerError) throw farmerError;

            // Update profile status back to pending
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ status: 'pending' })
                .eq('id', farmerToRemove.profiles.id);

            if (profileError) throw profileError;

            setMessage({ type: 'success', text: 'Farmer removed from your network.' });
            refreshFarmersList();
            setShowRemoveConfirmModal(false);
            setFarmerToRemove(null);
        } catch (err: any) {
            console.error('Remove farmer error:', err);
            setMessage({ type: 'error', text: 'Failed to remove farmer. Please try again.' });
        } finally {
            setIsRemoving(false);
        }
    };

    const handleRemoveCancel = () => {
        setShowRemoveConfirmModal(false);
        setFarmerToRemove(null);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600">Loading farmers data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Users className="text-white" size={24} strokeWidth={2.5} />
                        </div>
                        Farmers Management
                    </h1>
                    <p className="text-slate-500">Manage and track all registered farmers</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Farmers', value: stats.total.toString(), color: 'emerald' },
                    { label: 'Active Farmers', value: stats.active.toString(), color: 'blue' },
                    { label: 'New This Month', value: stats.newThisMonth.toString(), color: 'amber' },
                    { label: 'Available to Link', value: stats.pending.toString(), color: 'red' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Farmers List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
                {/* Table Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">All Farmers</h2>
                        <div className="flex gap-2">
                            {!showSearchInput && (
                                <button
                                    onClick={() => setShowSearchInput(true)}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                                >
                                    <Search size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Input */}
                    <AnimatePresence>
                        {showSearchInput && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    placeholder="Search farmers by name, location, crops, or contact..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pl-11 pr-11 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    autoFocus
                                />
                                <Search
                                    size={20}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <button
                                    onClick={() => {
                                        setShowSearchInput(false);
                                        setSearchQuery('');
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {filteredFarmers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {farmers.length === 0
                                    ? 'No farmers registered yet'
                                    : 'No farmers found'}
                            </h3>
                            <p className="text-slate-500 mb-4">
                                {farmers.length === 0
                                    ? 'Use the "Onboard Farmer" menu to add farmers to your network.'
                                    : 'Try adjusting your search query.'}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Farmer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Crops
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredFarmers.map((farmer, index) => {
                                    const profile = farmer.profiles;
                                    const location = [farmer.district, farmer.state]
                                        .filter(Boolean)
                                        .join(', ') || 'Not specified';
                                    const crops = farmer.current_crops?.join(', ') || 'Not specified';
                                    const isActive = profile?.status === 'active';

                                    return (
                                        <motion.tr
                                            key={farmer.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {profile?.avatar_url ? (
                                                        <img
                                                            src={profile.avatar_url}
                                                            alt={profile.full_name}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                                                            {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {profile?.full_name || 'Unknown'}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {farmer.farm_name || 'No farm name'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    {location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600">{crops}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {profile?.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Phone size={14} className="text-slate-400" />
                                                            {profile.phone}
                                                        </div>
                                                    )}
                                                    {profile?.email && (
                                                        <p className="text-xs text-slate-500">{profile.email}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                        isActive
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                            isActive ? 'bg-emerald-500' : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    {profile?.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <FarmerActionsMenu
                                                    farmer={farmer}
                                                    onEdit={handleEditFarmer}
                                                    onView={handleViewFarmer}
                                                    onRemove={handleRemoveFarmer}
                                                    disabled={!isApproved}
                                                />
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
                            message.type === 'success'
                                ? 'bg-white border-emerald-100 text-slate-900'
                                : 'bg-white border-red-100 text-slate-900'
                        }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${
                                message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                        />
                        <p className="text-sm font-medium">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Farmer Modal */}
            {selectedFarmer && (
                <EditFarmerModal
                    isOpen={showEditFarmerModal}
                    onClose={() => {
                        setShowEditFarmerModal(false);
                        setSelectedFarmer(null);
                    }}
                    onSuccess={handleEditFarmerSuccess}
                    farmer={selectedFarmer}
                />
            )}

            {/* Remove Farmer Confirmation Modal */}
            <ConfirmationModal
                isOpen={showRemoveConfirmModal}
                onClose={handleRemoveCancel}
                onConfirm={handleRemoveConfirm}
                title="Remove Farmer from Network?"
                message={`Are you sure you want to remove ${farmerToRemove?.profiles?.full_name || 'this farmer'} from your network? This will unlink the farmer but will not delete their account. They will return to the unassigned farmers pool.`}
                confirmText="Yes, Remove Farmer"
                cancelText="Cancel"
                variant="danger"
                isLoading={isRemoving}
            />
        </DashboardLayout>
    );
}
