import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Leaf, Building2, User, Factory } from 'lucide-react';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [panchayats, setPanchayats] = useState<any[]>([]);

  useEffect(() => {
    fetchPanchayats();
  }, []);

  const fetchPanchayats = async () => {
    console.log('Fetching panchayats...');
    const { data, error } = await supabase
      .from('panchayats')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching panchayats:', error);
    } else {
      console.log('Panchayats fetched:', data);
      setPanchayats(data || []);
    }
  };

  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as string;
    const panchayatId = formData.get('panchayat_id') as string;
    
    const result = await signUp(email, password, fullName, role);
    
    // If farmer and panchayat selected, store the panchayat preference
    if (!result.error && role === 'farmer' && panchayatId) {
      localStorage.setItem('selected_panchayat_id', panchayatId);
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/026331b6-8c4c-49eb-8e7c-043e8c62f255.png"
              alt="Grameen Logo"
              className="h-16 w-16 object-contain rounded-full" 
            />
          </div>
          <CardTitle className="text-2xl">Grameen</CardTitle>
          <CardDescription>Crop Residue Management Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" name="fullName" required />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" required minLength={6} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select 
                    name="role" 
                    required 
                    onValueChange={(value) => setSelectedRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">
                        <div className="flex items-center space-x-2">
                          <Factory className="h-4 w-4 text-blue-600" />
                          <span>Industry/Buyer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="panchayat_admin">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span>Panchayat Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="farmer">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-amber-600" />
                          <span>Farmer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === 'farmer' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Select Your Panchayat *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={fetchPanchayats}
                        className="h-6 text-xs"
                      >
                        🔄 Refresh
                      </Button>
                    </div>
                    <Select name="panchayat_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your panchayat" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white z-50">
                        {panchayats.length > 0 ? (
                          panchayats.map(panchayat => (
                            <SelectItem key={panchayat.id} value={panchayat.id}>
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-green-600" />
                                <div className="flex flex-col">
                                  <span className="font-medium">{panchayat.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {panchayat.village}, {panchayat.district}, {panchayat.state}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center">
                            <span className="text-muted-foreground text-sm">No panchayats found</span>
                            <p className="text-xs text-muted-foreground mt-1">
                              Ask your panchayat admin to register first, or click refresh
                            </p>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {panchayats.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 If your panchayat was just registered, click the refresh button above
                      </p>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;