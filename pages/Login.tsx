
import React, { useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const location = useLocation();
  const isSignUpPage = location.pathname.startsWith('/cadastro');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/conta');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen pt-40 pb-20 bg-white flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 transform origin-top translate-x-20 hidden lg:block" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full -translate-x-32 translate-y-32 blur-3xl opacity-60" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-50 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-sm mx-auto">
          {/* Subtle label for context */}
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-medium italic">
              {isSignUpPage ? 'Crie seu perfil exclusivo' : 'Identificação de Cliente'}
            </p>
          </div>

          <div className="flex justify-center [&_.cl-rootBox]:w-full [&_.cl-card]:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] [&_.cl-card]:border [&_.cl-card]:border-gray-100 [&_.cl-card]:rounded-none [&_.cl-card]:p-10 [&_.cl-headerTitle]:hidden [&_.cl-headerSubtitle]:hidden [&_.cl-footer]:flex [&_.cl-footer]:justify-center [&_.cl-footer]:mt-6 [&_.cl-footerAction]:text-[11px] [&_.cl-footerActionText]:text-gray-500 [&_.cl-footerActionLink]:text-navy [&_.cl-footerActionLink]:font-bold [&_.cl-footerActionLink]:uppercase [&_.cl-footerActionLink]:tracking-widest">
            {isSignUpPage ? (
              <SignUp
                routing="path"
                path="/cadastro"
                signInUrl="/login"
                fallbackRedirectUrl="/conta"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-white w-full',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    formButtonPrimary: 'bg-navy hover:bg-navy/90 text-[11px] tracking-[0.3em] font-bold uppercase py-5 transition-all duration-300 rounded-none shadow-none mt-6',
                    formFieldInput: 'border-0 border-b border-gray-200 rounded-none focus:border-navy focus:ring-0 py-4 font-light text-sm bg-transparent transition-colors',
                    formFieldLabel: 'text-[9px] tracking-[0.2em] uppercase font-bold text-navy/60 mb-1',
                    footerActionLink: 'text-navy font-bold hover:underline transition-all',
                    socialButtonsBlockButton: 'border-gray-100 text-gray-600 hover:bg-gray-50 rounded-none transition-colors py-3.5',
                    dividerLine: 'bg-gray-100',
                    dividerText: 'text-gray-400 text-[9px] uppercase tracking-[0.2em]',
                    formFieldAction: 'text-navy text-[10px] font-bold uppercase tracking-wider hover:text-navy/80',
                    identityPreviewText: 'text-gray-500',
                    identityPreviewEditButton: 'text-navy font-bold'
                  },
                }}
              />
            ) : (
              <SignIn
                routing="path"
                path="/login"
                signUpUrl="/cadastro"
                fallbackRedirectUrl="/conta"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-white w-full',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    formButtonPrimary: 'bg-navy hover:bg-navy/90 text-[11px] tracking-[0.3em] font-bold uppercase py-5 transition-all duration-300 rounded-none shadow-none mt-6',
                    formFieldInput: 'border-0 border-b border-gray-200 rounded-none focus:border-navy focus:ring-0 py-4 font-light text-sm bg-transparent transition-colors',
                    formFieldLabel: 'text-[9px] tracking-[0.2em] uppercase font-bold text-navy/60 mb-1',
                    footerActionLink: 'text-navy font-bold hover:underline transition-all',
                    socialButtonsBlockButton: 'border-gray-100 text-gray-600 hover:bg-gray-50 rounded-none transition-colors py-3.5',
                    dividerLine: 'bg-gray-100',
                    dividerText: 'text-gray-400 text-[9px] uppercase tracking-[0.2em]',
                    formFieldAction: 'text-navy text-[10px] font-bold uppercase tracking-wider hover:text-navy/80',
                  },
                }}
              />
            )}
          </div>

          <div className="mt-16 text-center opacity-30">
            <p className="text-gray-900 text-[9px] tracking-[0.4em] uppercase">
              Mendonça Dreams &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
