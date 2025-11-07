import { ReactNode, createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Leaf, LogOut, User, Sun, Moon, Globe, LayoutDashboard, FileText, CreditCard, UserCircle, Menu, Tractor, BarChart3, ShoppingCart, Building } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

// Create context for navigation
const NavigationContext = createContext<{
  onNavigate?: (section: string) => void;
  activeSection?: string;
}>({});

export const Layout = ({ children, onNavigate, activeSection = 'dashboard' }: LayoutProps) => {
  const { user, profile, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      'panchayat_admin': 'Panchayat Admin',
      'farmer': 'Farmer',
      'buyer': 'Industry/Buyer',
      'industry': 'Industry/Buyer'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (profile?.role === 'farmer') {
      return [
        { key: 'dashboard', label: t('farmer.dashboard'), icon: LayoutDashboard },
        { key: 'sell-residue', label: t('farmer.sellResidue'), icon: FileText },
        { key: 'my-listings', label: t('farmer.myListings'), icon: CreditCard },
        { key: 'rent-machinery', label: t('farmer.rentMachinery'), icon: Tractor },
        { key: 'analytics', label: t('farmer.analytics'), icon: BarChart3 },
        { key: 'profile', label: t('farmer.profile'), icon: UserCircle },
      ];
    } else if (profile?.role === 'panchayat_admin') {
      return [
        { key: 'dashboard', label: t('panchayatDashboard.dashboard'), icon: LayoutDashboard },
        { key: 'farmers', label: 'Farmers', icon: User },
        { key: 'residue', label: 'Residue', icon: FileText },
        { key: 'machines', label: 'Machines', icon: Tractor },
        { key: 'analytics', label: t('panchayatDashboard.analytics'), icon: BarChart3 },
        { key: 'profile', label: t('panchayatDashboard.profile'), icon: UserCircle },
      ];
    } else if (profile?.role === 'buyer' || profile?.role === 'industry') {
      return [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
        { key: 'orders', label: 'Orders', icon: FileText },
        { key: 'profile', label: 'Profile', icon: UserCircle },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const isMobile = useIsMobile();

  return (
    <NavigationContext.Provider value={{ onNavigate, activeSection }}>
      <div className="min-h-screen bg-background page-transition">
        <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/026331b6-8c4c-49eb-8e7c-043e8c62f255.png"
                alt="Grameen Logo"
                className="h-10 w-10 object-contain rounded-full" 
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Grameen</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{t('farmer.cropResidueManagement')}</p>
              </div>
            </div>

           {/* Desktop Navigation */}
          {(profile?.role === 'farmer' || profile?.role === 'panchayat_admin' || profile?.role === 'buyer' || profile?.role === 'industry') && navItems.length > 0 && !isMobile && onNavigate && (
            <nav className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <button 
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          <div className="flex items-center space-x-2">
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost" 
                size="sm"
                onClick={toggleLanguage}
                className="text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4 mr-1" />
                {i18n.language === 'en' ? 'EN' : 'HI'}
              </Button>

              <Button
                variant="ghost"
                size="sm" 
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>

            {profile && (
              <div className="text-sm text-muted-foreground hidden xl:block">
                {getRoleBadge(profile.role)}
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block max-w-[120px] truncate">
                    {profile?.full_name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('farmer.myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm">
                  <div className="flex flex-col">
                    <span className="truncate">{profile?.full_name}</span>
                    <span className="text-muted-foreground truncate">{user.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Mobile navigation */}
                {(profile?.role === 'farmer' || profile?.role === 'panchayat_admin' || profile?.role === 'buyer' || profile?.role === 'industry') && navItems.length > 0 && onNavigate && (
                  <>
                    <div className="lg:hidden">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.key;
                        return (
                          <DropdownMenuItem key={item.key} onClick={() => onNavigate(item.key)}>
                            <div className={`flex items-center w-full ${isActive ? 'bg-muted' : ''}`}>
                              <Icon className="mr-2 h-4 w-4" />
                              <span>{item.label}</span>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                    <DropdownMenuSeparator className="lg:hidden" />
                  </>
                )}

                {/* Mobile controls */}
                <div className="sm:hidden">
                  <DropdownMenuItem onClick={toggleLanguage}>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{t('farmer.language')}: {i18n.language === 'en' ? t('farmer.english') : t('farmer.hindi')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'light' ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    <span>{t('farmer.theme')}: {theme === 'light' ? t('farmer.light') : t('farmer.dark')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('farmer.signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

        <main className="container mx-auto px-4 py-6 md:py-8 page-transition">
          {children}
        </main>
      </div>
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);