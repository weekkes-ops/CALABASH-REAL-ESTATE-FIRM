
import React, { useState } from 'react';
import { Agent } from '../types';

interface AgentAuthProps {
  onLogin: (agent: Agent) => void;
}

const AUTHORIZATION_CODE = "CALABASH-ELITE-2024";

const AgentAuth: React.FC<AgentAuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agency: '',
    password: '',
    authCode: ''
  });

  const getRegisteredAgents = (): (Agent & { password?: string })[] => {
    const data = localStorage.getItem('calabash_registered_agents');
    return data ? JSON.parse(data) : [];
  };

  const saveAgent = (agent: Agent & { password?: string }) => {
    const agents = getRegisteredAgents();
    agents.push(agent);
    localStorage.setItem('calabash_registered_agents', JSON.stringify(agents));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const agents = getRegisteredAgents();

    if (isRegistering) {
      // Authorization Check
      if (formData.authCode !== AUTHORIZATION_CODE) {
        setError('Invalid Authorization Code. You must be pre-authorized by Calabash Administration to create an agent account.');
        return;
      }

      // Check if email already exists
      if (agents.find(a => a.email.toLowerCase() === formData.email.toLowerCase())) {
        setError('An agent with this email already exists.');
        return;
      }

      const newAgent: Agent & { password?: string } = {
        id: 'agent-' + Math.random().toString(36).substr(2, 5),
        name: formData.name,
        email: formData.email,
        agency: formData.agency || 'Calabash Real Estate Company',
        authorized: true, 
        password: formData.password
      };

      saveAgent(newAgent);
      // Clean up password before passing to state
      const { password, ...agentData } = newAgent;
      onLogin(agentData as Agent);
    } else {
      // Login Logic
      const foundAgent = agents.find(
        a => a.email.toLowerCase() === formData.email.toLowerCase() && a.password === formData.password
      );

      if (foundAgent) {
        const { password, ...agentData } = foundAgent;
        onLogin(agentData as Agent);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-blue-900 p-8 text-white text-center border-b border-blue-800">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
            <i className="fas fa-user-tie text-2xl text-yellow-500"></i>
          </div>
          <h2 className="text-2xl font-extrabold">{isRegistering ? 'Authorized Registration' : 'Agent Login'}</h2>
          <p className="text-blue-100 text-sm mt-2 opacity-80">
            {isRegistering 
              ? 'Enter your professional credentials and authorization key.' 
              : 'Access your professional dashboard and listing tools.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-start animate-in fade-in slide-in-from-top-2">
              <i className="fas fa-exclamation-circle mr-2 mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}

          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Authorization Code</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.authCode}
                    onChange={(e) => setFormData({...formData, authCode: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-mono tracking-widest text-blue-900"
                    placeholder="XXXX-XXXX-XXXX"
                  />
                  <i className="fas fa-key absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">Provided by your agency manager.</p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agency Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.agency}
                    onChange={(e) => setFormData({...formData, agency: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                    placeholder="Calabash Real Estate Company"
                  />
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              placeholder="agent@calabashrealestate.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-yellow-100 hover:bg-yellow-700 transition-all active:scale-95"
          >
            {isRegistering ? 'Create Authorized Account' : 'Sign In'}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm font-semibold text-blue-900 hover:text-yellow-600 transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an agent account? Register here'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl flex items-start space-x-4 border border-blue-100">
        <div className="bg-blue-100 text-blue-900 p-2 rounded-lg shrink-0">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div>
          <span className="font-bold text-blue-900 text-xs block mb-1 uppercase tracking-wider">Authorization Policy</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            To maintain listing quality, all agent accounts must be authorized. 
            If you do not have a code, please contact <strong>admin@calabash.sl</strong> or visit our Freetown office at No 11 Dillet Street.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentAuth;
