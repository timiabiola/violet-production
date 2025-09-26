
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticleBackground from '@/components/ParticleBackground';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    // Check if this is an email confirmation callback
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isEmailConfirmation = hashParams.get('type') === 'email' ||
                               hashParams.get('type') === 'signup' ||
                               hashParams.get('type') === 'recovery' ||
                               hashParams.get('type') === 'magiclink';

    // If this is an email confirmation, redirect to the callback handler
    if (isEmailConfirmation && window.location.hash) {
      navigate(`/auth/callback${window.location.hash}`);
      return;
    }

    if (user && !isEmailConfirmation) {
      // Only redirect if not coming from email confirmation
      checkOnboardingStatus();
    }
  }, [user, navigate]);

  const checkOnboardingStatus = async () => {
    // Redirect existing users to their dashboard
    navigate('/review-form');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      // After successful login, we'll check onboarding status in ProtectedRoute
      navigate('/review-form');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, fullName);
      // After signup, switch to sign-in tab
      setActiveTab('signin');
      // Clear form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ParticleBackground />

      <div className="max-w-md w-full z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="bg-glass border-white/10 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-white animate-in fade-in slide-in-from-top duration-500">
              Violet the Curious
            </CardTitle>
            <CardDescription className="text-gray-300 animate-in fade-in slide-in-from-top duration-500 delay-100">
              Healthcare Reputation Management
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/80 transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/80 transition-all duration-200"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6 animate-in fade-in slide-in-from-right duration-300">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80" htmlFor="signin-email">Email</label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80" htmlFor="signin-password">Password</label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-700 transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                        Signing in...
                      </span>
                    ) : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 animate-in fade-in slide-in-from-left duration-300">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80" htmlFor="signup-name">Full Name</label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80" htmlFor="signup-email">Email</label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80" htmlFor="signup-password">Password</label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80" htmlFor="signup-confirm">Confirm Password</label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-700 transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                        Creating account...
                      </span>
                    ) : "Create Account"}
                  </Button>

                  <p className="text-xs text-white/60 text-center mt-2">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
