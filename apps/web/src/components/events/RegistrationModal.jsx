import React, { useState } from 'react';
import { X, Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose, eventName }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketData, setTicketData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          event_name: eventName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTicketData(data);
        setStatus('success');
      } else {
        setStatus('error');
        const firstError = Object.values(data)[0];
        setErrorMsg(Array.isArray(firstError) ? firstError[0] : 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setStatus('error');
      setErrorMsg('Failed to connect to the server. Is it running?');
    }
  };

  const downloadQR = () => {
    if (!ticketData?.qr_code) return;
    const link = document.createElement('a');
    link.href = ticketData.qr_code;
    link.download = `${eventName.replace(/\s+/g, '_')}_Ticket.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold font-display text-white">
            {status === 'success' ? 'Registration Complete' : 'Event Registration'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">You're In!</h3>
                <p className="text-gray-400 text-sm">
                  Your ticket for <span className="text-primary">{eventName}</span> has been generated.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-primary/20 shadow-inner">
                <img 
                  src={ticketData.qr_code} 
                  alt="Entry QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>

              <p className="text-xs text-yellow-500/80 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                ⚠ Please save this QR code. It is required for entry.
              </p>

              <button
                onClick={downloadQR}
                className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="e.g. Alex Chen"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="e.g. alex@university.edu"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
