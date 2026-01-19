import React, { useState } from 'react';
import { Mail, MapPin, Send, Terminal, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import CyberBackground from '../components/common/CyberBackground';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    try {
      await axios.post(`${API_URL}/ops/contact-us/`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Transmission intercepted. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-background relative overflow-hidden flex flex-col justify-center font-sans">
      {/* Background Elements */}
      <CyberBackground fixed={true} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/20 rounded-full bg-primary/5 backdrop-blur-sm shadow-[0_0_15px_rgba(0,224,255,0.1)]">
                <Terminal className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-primary text-xs font-mono tracking-widest uppercase">Encryption: AES-256</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-6 leading-tight">
                Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Uplink</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md font-light">
                Establish a direct, encrypted line to Astra HQ. All transmissions are monitored by our defense protocols.
              </p>
            </div>

            <div className="space-y-4 mb-12">
              {/* Merchant Legal Entity Name */}
              <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-primary/20 bg-black/40 backdrop-blur-md transition-all duration-300 hover:translate-x-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(0,224,255,0.1)]">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1 opacity-70">Merchant Legal Entity Name</h3>
                  <p className="text-white font-medium text-base">ASTRA IETM</p>
                </div>
              </div>

              {/* Addresses */}
              <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/20 bg-black/40 backdrop-blur-md transition-all duration-300 hover:translate-x-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <MapPin className="w-4 h-4 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-mono text-[10px] text-blue-500 uppercase tracking-widest mb-1 opacity-70">Registered & Operational Address</h3>
                  <p className="text-white font-medium text-base">KMCT Institute of Emerging Technology and Management Mukkam Kozhikode, 673602</p>
                </div>
              </div>

              {/* Phone */}
              <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-green-500/20 bg-black/40 backdrop-blur-md transition-all duration-300 hover:translate-x-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-500/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <Terminal className="w-4 h-4 text-green-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-mono text-[10px] text-green-500 uppercase tracking-widest mb-1 opacity-70">Telephone No</h3>
                  <p className="text-white font-medium text-base">+91 8891396933</p>
                </div>
              </div>

              {/* Email */}
              <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-purple-500/20 bg-black/40 backdrop-blur-md transition-all duration-300 hover:translate-x-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                  <Mail className="w-4 h-4 text-purple-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-mono text-[10px] text-purple-500 uppercase tracking-widest mb-1 opacity-70">E-Mail ID</h3>
                  <p className="text-white font-medium text-base">contact@astraietm.in</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terminal Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative border gradient */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/30 to-blue-600/30 rounded-2xl blur-sm opacity-50 pointer-events-none"></div>

            <div className="bg-[#050505]/90 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-20 px-8 text-center flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Transmission Successful</h2>
                    <p className="text-gray-400 font-light mb-8 max-w-xs">Our agents have received your uplink. Prepare for contact.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm hover:bg-white/10 transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden"
                  >
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-gray-600" />
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">secure_transmission.exe</div>
                      </div>
                    </div>

                    <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                      {status === 'error' && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-mono">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="space-y-2 group">
                        <label className="text-[10px] font-mono text-gray-500 group-focus-within:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-600 group-focus-within:bg-primary rounded-full transition-colors"></span> Identify_User
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="> Enter Codename"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700 hover:border-white/20"
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="text-[10px] font-mono text-gray-500 group-focus-within:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-600 group-focus-within:bg-primary rounded-full transition-colors"></span> Communication_Channel
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="> Enter Frequency ID (Email)"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700 hover:border-white/20"
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="text-[10px] font-mono text-gray-500 group-focus-within:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-600 group-focus-within:bg-primary rounded-full transition-colors"></span> Data_Payload
                        </label>
                        <textarea
                          rows="4"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="> Input Message Stream..."
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700 hover:border-white/20 resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_30px_rgba(0,224,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="font-mono tracking-widest uppercase">Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <span className="font-mono tracking-widest">INITIALIZE_UPLINK</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;

