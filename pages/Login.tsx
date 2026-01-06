
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, User, Heart } from 'lucide-react';

const Login: React.FC = () => {
  const location = useLocation();
  const isSignUp = location.pathname === '/cadastro';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | 'other' | ''>('');
  const [shoppingFor, setShoppingFor] = useState<'self' | 'gift' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  // Reset error when switching between login and signup
  useEffect(() => {
    setError(null);
  }, [isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        await signUp(
          email,
          password,
          name,
          gender || undefined,
          shoppingFor || undefined
        );
        // After successful signup, user might need to confirm email or is logged in
        // signUp function in AuthContext already handles the alert for email confirmation
      } else {
        await login(email, password);
        navigate('/conta');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Ocorreu um erro ao processar sua solicitação.';
      if (msg.toLowerCase().includes('failed to fetch')) {
        msg = 'ERRO DE CONEXÃO: Verifique se as chaves do Supabase estão configuradas corretamente no arquivo .env.local.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-20 bg-gray-50 flex items-center overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-white p-12 shadow-2xl rounded-sm">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-serif text-navy mb-4">Maison Mendonça</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">
              {isSignUp ? 'Crie sua conta exclusiva' : 'Acesso à conta exclusiva'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 text-red-600 text-[10px] uppercase tracking-wider text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'login'}
                initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu Nome"
                      className="w-full border-b border-gray-200 py-4 focus:border-navy focus:outline-none transition-all placeholder:text-gray-300 font-light"
                    />
                  </motion.div>
                )}

                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: maria@luxo.com"
                    className="w-full border-b border-gray-200 py-4 focus:border-navy focus:outline-none transition-all placeholder:text-gray-300 font-light"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">Senha</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full border-b border-gray-200 py-4 focus:border-navy focus:outline-none transition-all placeholder:text-gray-300 font-light"
                  />
                </div>

                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">Confirmar Senha</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                      className="w-full border-b border-gray-200 py-4 focus:border-navy focus:outline-none transition-all placeholder:text-gray-300 font-light"
                    />
                  </motion.div>
                )}

                {/* Optional fields for better experience */}
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-6 pt-4 border-t border-gray-100"
                  >
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center">Campos opcionais</p>

                    {/* Gender Selection */}
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-4 block">
                        Como você se identifica?
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setGender(gender === 'female' ? '' : 'female')}
                          className={`flex-1 py-3 px-4 border-2 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${gender === 'female'
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          <Heart size={14} />
                          Feminino
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender(gender === 'male' ? '' : 'male')}
                          className={`flex-1 py-3 px-4 border-2 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${gender === 'male'
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          <User size={14} />
                          Masculino
                        </button>
                      </div>
                    </div>

                    {/* Shopping Purpose */}
                    <div>
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-4 block">
                        Para quem você está comprando?
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShoppingFor(shoppingFor === 'self' ? '' : 'self')}
                          className={`flex-1 py-3 px-4 border-2 text-[10px] uppercase tracking-widest font-bold transition-all ${shoppingFor === 'self'
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          Para mim
                        </button>
                        <button
                          type="button"
                          onClick={() => setShoppingFor(shoppingFor === 'gift' ? '' : 'gift')}
                          className={`flex-1 py-3 px-4 border-2 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${shoppingFor === 'gift'
                              ? 'border-navy bg-navy text-white'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          <Gift size={14} />
                          Presentear
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-navy text-white py-5 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all shadow-xl flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isSignUp ? 'Criar minha conta' : 'Entrar na Maison'
              )}
            </button>
          </form>

          <div className="mt-12 text-center space-y-4">
            <p className="text-xs text-gray-500 font-light">
              {isSignUp ? (
                <>Já possui conta? <Link to="/login" className="text-navy font-bold hover:underline">Entrar</Link></>
              ) : (
                <>Novo na Mendonça Dreams? <Link to="/cadastro" className="text-navy font-bold hover:underline">Cadastrar</Link></>
              )}
            </p>
            {!isSignUp && (
              <p className="text-[10px] text-gray-300 uppercase tracking-widest cursor-pointer hover:text-navy transition">Esqueci minha senha</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
