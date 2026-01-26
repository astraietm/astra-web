import React, { useState, useEffect } from 'react';
import { X, Loader2, User } from 'lucide-react';

const ConfirmRegistrationModal = ({ isOpen, onClose, onConfirm, eventName, userName, isLoading }) => {
    const [editableName, setEditableName] = useState(userName || '');

    // Update when userName prop changes
    useEffect(() => {
        setEditableName(userName || '');
    }, [userName]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(editableName);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold font-display text-white">
                        Confirm Registration
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Event Name Display */}
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                                Event
                            </p>
                            <p className="text-white font-bold">
                                {eventName}
                            </p>
                        </div>

                        {/* Editable Name Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-3.5 h-3.5" />
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                value={editableName}
                                onChange={(e) => setEditableName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="Enter your full name"
                            />
                            <p className="text-xs text-gray-500 ml-1">
                                This name will appear on your ticket
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !editableName.trim()}
                                className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    'Confirm Registration'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmRegistrationModal;
