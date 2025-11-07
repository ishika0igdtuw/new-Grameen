import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navbar = ({ initialScrolled }: { initialScrolled?: boolean }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState<boolean>(() => {
    try {
      if (initialScrolled) return true;
      if (typeof window !== 'undefined' && window.scrollY > 50) return true;
      if (location && location.pathname === '/about') return true;
      return false;
    } catch (e) {
      return false;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure route changes (like navigating to About) set proper initial header style
  useEffect(() => {
    // If parent requested initialScrolled, respect it. Otherwise derive from scroll or about route.
    if (initialScrolled) {
      setScrolled(true);
      return;
    }
    setScrolled(window.scrollY > 50 || location.pathname === '/about');
  }, [location.pathname, initialScrolled]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { key: 'home', label: t('nav.home'), href: '/' },
    { key: 'panchayat', label: t('nav.panchayat'), href: '/auth' },
    { key: 'buyers', label: t('nav.buyers'), href: '/auth' },
    { key: 'farmers', label: t('nav.farmers'), href: '/auth' },
    { key: 'aboutUs', label: t('nav.aboutUs'), href: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm md:bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/026331b6-8c4c-49eb-8e7c-043e8c62f255.png"
            alt="Grameen Logo"
            className="h-8 w-8 object-contain rounded-full" 
          />
          <span 
            className={`text-2xl md:text-3xl font-bold transition-colors ${
              scrolled ? 'text-grameen-brand-dark' : 'text-grameen-brand'
            }`}
          >
            Grameen
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
          {navItems.map((item) => (
            <Link 
              key={item.key}
              to={item.href}
              className={`relative font-medium text-lg transition-colors duration-200 ${
                scrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-green-300'
              }`}
            >
              {item.label}
              {location.pathname === item.href && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost" 
            size="sm"
            onClick={toggleLanguage}
            className={`font-medium ${
              scrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-green-300'
            }`}
          >
            <Globe className="h-4 w-4 mr-1" />
            {i18n.language === 'en' ? 'EN' : 'HI'}
          </Button>

          <Button
            variant="ghost"
            size="sm" 
            onClick={toggleTheme}
            className={scrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-green-300'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Link to="/auth">
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t('nav.getStarted')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`md:hidden ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b animate-accordion-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            {navItems.map((item) => (
              <Link 
                key={item.key}
                to={item.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Controls */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-foreground hover:text-primary"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {i18n.language === 'en' ? 'EN' : 'HI'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm" 
                  onClick={toggleTheme}
                  className="text-foreground hover:text-primary"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};