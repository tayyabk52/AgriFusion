'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useProfile } from '@/contexts/ProfileContext';

/**
 * Temporary debugging component to verify realtime connection
 * Add this to your dashboard to see realtime status
 * Remove after verifying realtime works
 */
export function RealtimeDebugger() {
    const { profile, notifications } = useProfile();
    const [status, setStatus] = useState<string>('Initializing...');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
        console.log(`[Realtime Debug] ${message}`);
    };

    useEffect(() => {
        if (!profile) {
            setStatus('❌ No profile loaded');
            return;
        }

        addLog(`Profile loaded: ${profile.full_name} (${profile.id})`);
        setStatus('🔄 Connecting to realtime...');

        const channel = supabase
            .channel(`debug-notifications:${profile.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${profile.id}`,
                },
                (payload) => {
                    addLog(`🔔 Event: ${payload.eventType} - ${JSON.stringify(payload.new || payload.old)}`);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setStatus('✅ Realtime connected!');
                    addLog('✅ Successfully subscribed to notifications channel');
                } else if (status === 'CHANNEL_ERROR') {
                    setStatus('❌ Connection error');
                    addLog('❌ Channel connection error');
                } else if (status === 'TIMED_OUT') {
                    setStatus('⏱️ Connection timed out');
                    addLog('⏱️ Connection timed out - check database config');
                } else if (status === 'CLOSED') {
                    setStatus('🔌 Connection closed');
                    addLog('🔌 Connection closed');
                } else {
                    setStatus(`🔄 Status: ${status}`);
                    addLog(`Status changed: ${status}`);
                }
            });

        return () => {
            addLog('🔌 Unsubscribing from debug channel');
            supabase.removeChannel(channel);
        };
    }, [profile]);

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-[9999]">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 border-b border-slate-700">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    🐛 Realtime Debugger
                </h3>
                <p className="text-xs opacity-90 mt-1">{status}</p>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <p className="text-slate-400">Profile ID</p>
                        <p className="font-mono text-emerald-400 truncate">
                            {profile?.id || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400">Notifications</p>
                        <p className="font-bold text-white">
                            {notifications.length} loaded
                        </p>
                    </div>
                </div>
            </div>

            {/* Event Logs */}
            <div className="px-4 py-3 max-h-64 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-400 mb-2">Event Log:</p>
                {logs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No events yet...</p>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log, index) => (
                            <div
                                key={index}
                                className="text-xs font-mono bg-slate-800 rounded px-2 py-1 text-slate-300"
                            >
                                {log}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                    📌 Test by creating a notification in Supabase SQL Editor. See{' '}
                    <code className="text-emerald-400">test-realtime.md</code> for instructions.
                </p>
            </div>
        </div>
    );
}
