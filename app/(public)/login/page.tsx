'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Train, Eye, EyeOff, ArrowRight, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { validateEmail, validatePassword } from '@/lib/validations';
import { loginUser } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = React.useState('passenger@railvision.ai');
  const [password, setPassword] = React.useState('Railway2026!');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const [errors, setErrors] = React.useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr || undefined,
        password: passErr || undefined,
      });
      return;
    }

    setIsLoading(true);
    try {
      const session = await loginUser({ email, password, rememberMe });
      setIsSuccess(true);
      toast({
        title: 'Authentication Successful',
        description: `Welcome back, ${session.user?.name || 'Passenger'}.`,
        type: 'success',
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Invalid credentials. Please verify your details.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0a0f1d] px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2545] text-white shadow-md dark:bg-blue-600">
            <Train className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            RailVision AI
          </span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access personal journey platform maps and grievance tracking
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 shadow-md">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Signed in successfully
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Redirecting to your passenger dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="passenger@railvision.ai"
                required
                autoComplete="email"
              />

              <div className="space-y-1.5">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545] dark:border-slate-700"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: 'Reset link dispatched',
                      description: 'Demo recovery instructions simulated.',
                    });
                  }}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full mt-2 gap-2"
                size="md"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Demo Mode Notice */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>Demo Mode Active: Pre-filled credentials ready</span>
                </p>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
