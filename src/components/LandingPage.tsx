import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Leaf, Users, TrendingUp, Recycle, Shield, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { DummyDataSetup } from '@/components/DummyDataSetup';
import farmMachinery from '@/assets/farm-machinery.jpg';
import biomassMaterials from '@/assets/biomass-materials.jpg';
import environmentalImpact from '@/assets/environmental-impact.jpg';
import panchayatOffice from '@/assets/panchayat-office.jpg';

export const LandingPage = () => {
  const { t } = useTranslation();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  const features = [
    {
      icon: Users,
      title: t('features.panchayatGov.title'),
      description: t('features.panchayatGov.description')
    },
    {
      icon: Recycle,
      title: t('features.wasteManagement.title'),
      description: t('features.wasteManagement.description')
    },
    {
      icon: TrendingUp,
      title: t('features.marketLinkage.title'),
      description: t('features.marketLinkage.description')
    },
    {
      icon: Shield,
      title: t('features.transactions.title'),
      description: t('features.transactions.description')
    },
    {
      icon: MapPin,
      title: t('features.locationServices.title'),
      description: t('features.locationServices.description')
    },
    {
      icon: Leaf,
      title: t('features.environmentalImpact.title'),
      description: t('features.environmentalImpact.description')
    }
  ];

  const stats = [
    { value: "50M+", label: t('stats.cropResidue') },
    { value: "15%", label: t('stats.pollutionReduction') },
    { value: "₹50K+", label: t('stats.farmerIncome') },
    { value: "100+", label: t('stats.panchayatsReady') }
  ];

  return (
    <div className="min-h-screen bg-background transition-theme">
      {/* Navigation */}
      <Navbar />

      {/* Dummy Data Setup - Only for testing */}
      <div className="fixed bottom-4 right-4 z-50">
        <DummyDataSetup />
      </div>

      {/* Hero Section with Parallax */}
      <section className="relative overflow-hidden">
        <div 
          className="parallax-bg h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center relative"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/lovable-uploads/8d934a30-f777-403d-bc6d-9a2b2fdc01ed.png)` 
          }}
        >
          {/* Hero Content */}
          <div className="container mx-auto px-4 text-center text-white relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="inline-block">
                {t('hero.title')} <span className="text-warning text-5xl md:text-7xl drop-shadow-lg shadow-warning/50">{t('hero.titleHighlight')}</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 bg-green-500 hover:bg-green-600 text-white">
                  {t('hero.joinPanchayat')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white bg-white/10 hover:bg-white hover:text-primary">
                  {t('hero.registerBuyer')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards positioned below hero but overlapping */}
        <div className="relative -mt-20 z-30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-primary dark:bg-primary backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-white/90 leading-tight">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem and Solution sections removed from landing page - moved to About Us */}

      {/* Intro Video (embedded) - placed before How it Works */}
      <section
        className="py-12 bg-background relative z-10 fade-in-up"
        ref={(el) => { sectionRefs.current[0] = el; }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/Bqc2fHLBsGA?si=cdn-o1i67H_htiGM"
                title="Grameen Intro"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section 
        className="py-20 bg-background relative z-10 fade-in-up" 
        ref={(el) => { sectionRefs.current[1] = el; }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('howItWorks.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-8 inline-block">
                <img 
                  src={panchayatOffice} 
                  alt="Panchayat Registration" 
                  className="w-64 h-48 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('howItWorks.step1.title')}</h3>
              <p className="text-muted-foreground">
                {t('howItWorks.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8 inline-block">
                <img 
                  src={biomassMaterials} 
                  alt="Crop Residue Listing" 
                  className="w-64 h-48 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('howItWorks.step2.title')}</h3>
              <p className="text-muted-foreground">
                {t('howItWorks.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8 inline-block">
                <img 
                  src={farmMachinery} 
                  alt="Industries Purchase" 
                  className="w-64 h-48 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('howItWorks.step3.title')}</h3>
              <p className="text-muted-foreground">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary transition-theme relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {t('cta.registerPanchayat')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white bg-white/10 hover:bg-white hover:text-primary">
                {t('cta.joinIndustry')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Crop Residue Resources & Solutions - Tabbed Interface */}
      <section 
        className="py-20 bg-muted/30 transition-theme relative z-10 fade-in-up" 
        ref={(el) => { sectionRefs.current[2] = el; }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('resources.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('resources.subtitle')}
            </p>
          </div>

          <Tabs defaultValue="crops" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="crops" className="text-sm sm:text-base">
                {t('resources.crops')}
              </TabsTrigger>
              <TabsTrigger value="industries" className="text-sm sm:text-base">
                {t('resources.industries')}
              </TabsTrigger>
              <TabsTrigger value="machines" className="text-sm sm:text-base">
                {t('resources.machines')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crops" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: t('resources.cropData.paddyStraw.name'),
                    description: t('resources.cropData.paddyStraw.description'),
                    image: "/lovable-uploads/8c0674c2-01f5-4d93-9226-3a3faa20aa26.png"
                  },
                  {
                    name: t('resources.cropData.wheatStraw.name'), 
                    description: t('resources.cropData.wheatStraw.description'),
                    image: "/lovable-uploads/cf88cbda-f0a3-46c8-a729-b177f8f8c411.png"
                  },
                  {
                    name: t('resources.cropData.sugarcaneBagasse.name'),
                    description: t('resources.cropData.sugarcaneBagasse.description'),
                    image: "/lovable-uploads/6a58fcc8-5169-40df-9e07-10876279cc38.png"
                  },
                  {
                    name: t('resources.cropData.sunflowerStalks.name'),
                    description: t('resources.cropData.sunflowerStalks.description'),
                    image: "/lovable-uploads/4999d5e9-8d34-44cb-8462-3076b314883f.png"
                  },
                  {
                    name: t('resources.cropData.maizeCobs.name'),
                    description: t('resources.cropData.maizeCobs.description'),
                    image: "/lovable-uploads/3cd8e988-8845-4c44-98b8-2348ec536663.png"
                  },
                  {
                    name: t('resources.cropData.mustardStalks.name'),
                    description: t('resources.cropData.mustardStalks.description'),
                    image: "/lovable-uploads/329614a7-9d4d-441e-a06e-d5052736b4dc.png"
                  }
                ].map((crop, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted/50 flex items-center justify-center">
                      <img 
                        src={crop.image} 
                        alt={crop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{crop.name}</h4>
                      <p className="text-muted-foreground text-sm">{crop.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="industries" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: t('resources.industryData.bioCNG.name'),
                    description: t('resources.industryData.bioCNG.description'),
                    image: "/lovable-uploads/0175d8ed-14b0-45d0-aa48-0be748744e0a.png"
                  },
                  {
                    name: t('resources.industryData.ethanol.name'),
                    description: t('resources.industryData.ethanol.description'),
                    image: "/lovable-uploads/a876e6de-969f-4e9d-8dad-106817b474c8.png"
                  },
                  {
                    name: t('resources.industryData.paper.name'),
                    description: t('resources.industryData.paper.description'),
                    image: "/lovable-uploads/b8d9765b-6aa2-4bd6-a329-77cac4cc20f7.png"
                  },
                  {
                    name: t('resources.industryData.packaging.name'),
                    description: t('resources.industryData.packaging.description'),
                    image: "/lovable-uploads/5c828c19-ad84-4c0a-81af-a8325d0ecf2f.png"
                  },
                  {
                    name: t('resources.industryData.mushroom.name'),
                    description: t('resources.industryData.mushroom.description'),
                    image: "/lovable-uploads/95e4c934-bc44-49ba-870a-c1535f9e4ab2.png"
                  },
                  {
                    name: t('resources.industryData.compost.name'),
                    description: t('resources.industryData.compost.description'),
                    image: "/lovable-uploads/6870cd5b-a7a3-4cb1-ad66-d8d92530a652.png"
                  }
                ].map((industry, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted/50 flex items-center justify-center">
                      <img 
                        src={industry.image} 
                        alt={industry.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{industry.name}</h4>
                      <p className="text-muted-foreground text-sm">{industry.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="machines" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: t('resources.machineData.happySeeder.name'),
                    description: t('resources.machineData.happySeeder.description'),
                    image: "/lovable-uploads/6416d623-359b-4ead-8cbc-189e3aadebf4.png"
                  },
                  {
                    name: t('resources.machineData.rotavator.name'),
                    description: t('resources.machineData.rotavator.description'),
                    image: "/lovable-uploads/3f322888-d4aa-47c8-a233-0c6c2dfe73a4.png"
                  },
                  {
                    name: t('resources.machineData.sms.name'),
                    description: t('resources.machineData.sms.description'),
                    image: "/lovable-uploads/148994de-9963-4988-90a6-e7c09784c128.png"
                  },
                  {
                    name: t('resources.machineData.strawBaler.name'),
                    description: t('resources.machineData.strawBaler.description'),
                    image: "/lovable-uploads/e2895cc1-0bcd-459d-b5da-0239052c0a11.png"
                  },
                  {
                    name: t('resources.machineData.mulcher.name'),
                    description: t('resources.machineData.mulcher.description'),
                    image: "/lovable-uploads/d1e4e404-f2ca-40ea-b0b8-de82c701c28e.png"
                  },
                  {
                    name: t('resources.machineData.zeroTillDrill.name'),
                    description: t('resources.machineData.zeroTillDrill.description'),
                    image: "/lovable-uploads/06f26c0b-4aa2-4888-b850-cb2541f6a865.png"
                  }
                ].map((machine, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted/50 flex items-center justify-center">
                      <img 
                        src={machine.image} 
                        alt={machine.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{machine.name}</h4>
                      <p className="text-muted-foreground text-sm">{machine.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 transition-theme">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Grameen</span>
            </div>
            <p className="text-muted-foreground text-center">
              Turning agricultural waste into wealth. Building a sustainable future for rural India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};