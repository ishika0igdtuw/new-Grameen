import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Tractor, Calendar, Plus, ArrowRight, Wrench, Cpu, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MachineBookingForm } from '@/components/forms/MachineBookingForm';

// Machine images
import combineHarvester from '@/assets/machines/combine-harvester-real.jpg';
import stubbleChopper from '@/assets/machines/stubble-chopper-real.jpg';
import rotaryMulcher from '@/assets/machines/rotary-mulcher-real.jpg';
import cropBaler from '@/assets/machines/crop-baler-real.jpg';

export const FarmerMachineBooking = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [machineBookings, setMachineBookings] = useState<any[]>([]);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMachineForm, setShowMachineForm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  const machineTypes = [
    {
      id: 'combine_harvester',
      name: t('machineBooking.machineTypes.combineHarvester.name'),
      image: combineHarvester,
      description: t('machineBooking.machineTypes.combineHarvester.description'),
      features: ['Cuts multiple crops', 'Chops leftover stalks', 'Fast grain separation'],
      hourlyRate: '₹1,200/hour',
      dailyRate: '₹8,000/day',
      icon: Wrench
    },
    {
      id: 'stubble_chopper',
      name: t('machineBooking.machineTypes.stubbleChopper.name'),
      image: stubbleChopper,
      description: t('machineBooking.machineTypes.stubbleChopper.description'),
      features: ['Cuts stubble evenly', 'Chops into small pieces', 'Clears field quickly'],
      hourlyRate: '₹800/hour', 
      dailyRate: '₹4,500/day',
      icon: Tractor
    },
    {
      id: 'rotary_mulcher',
      name: t('machineBooking.machineTypes.rotaryMulcher.name'),
      image: rotaryMulcher,
      description: t('machineBooking.machineTypes.rotaryMulcher.description'),
      features: ['Shreds crop waste', 'Mixes into soil', 'Adds nutrition to soil'],
      hourlyRate: '₹600/hour',
      dailyRate: '₹3,500/day',
      icon: Cpu
    },
    {
      id: 'crop_baler',
      name: t('machineBooking.machineTypes.cropBaler.name'),
      image: cropBaler,
      description: t('machineBooking.machineTypes.cropBaler.description'),
      features: ['Collects waste automatically', 'Packs tightly', 'Easy to move bundles'],
      hourlyRate: '₹500/hour',
      dailyRate: '₹3,000/day',
      icon: Zap
    }
  ];

  const handleMachineSelect = (machineType: string) => {
    setSelectedMachine(machineType);
    setShowMachineForm(true);
  };

  useEffect(() => {
    fetchMachineData();
  }, [profile]);

  const fetchMachineData = async () => {
    if (!profile) return;

    try {
      // Fetch farmer profile
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('profile_id', profile.id)
        .single();

      if (farmerError) {
        console.error('Error fetching farmer profile:', farmerError);
        setLoading(false);
        return;
      }

      setFarmerProfile(farmerData);

      // Fetch machine bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('machine_bookings')
        .select('*')
        .eq('farmer_id', farmerData.id)
        .order('created_at', { ascending: false });

      if (bookingError) {
        console.error('Error fetching machine bookings:', bookingError);
      } else {
        setMachineBookings(bookingData || []);
      }

    } catch (error) {
      console.error('Error fetching machine data:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load machine booking data',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('machineBooking.title')}
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            {t('machineBooking.subtitle')}
          </p>
        </div>

        {/* Available Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {machineTypes.map((machine) => {
            const IconComponent = machine.icon;
            return (
              <Card 
                key={machine.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 overflow-hidden bg-white"
                onClick={() => handleMachineSelect(machine.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={machine.image} 
                    alt={machine.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-6 w-6" />
                      <h3 className="text-xl font-bold">{machine.name}</h3>
                    </div>
                    <div className="text-green-300 text-sm">
                      <div>{machine.hourlyRate}</div>
                      <div>{machine.dailyRate}</div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {machine.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {machine.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMachineSelect(machine.id);
                    }}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book {machine.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Your Bookings Section */}
        {machineBookings.length > 0 && (
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{t('machineBooking.yourBookingsTitle')}</CardTitle>
              <CardDescription className="text-lg">
                {t('machineBooking.yourBookingsSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">{t('machineBooking.totalBookings')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{machineBookings.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium text-yellow-800">{t('machineBooking.pending')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {machineBookings.filter(b => b.status === 'pending').length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium text-green-800">{t('machineBooking.approved')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {machineBookings.filter(b => b.status === 'approved').length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium text-blue-800">{t('machineBooking.completed')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {machineBookings.filter(b => b.status === 'completed').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bookings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machineBookings.map((booking: any) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  return (
                    <Card key={booking.id} className="border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg capitalize">
                            {booking.machine_type.replace('_', ' ')}
                          </CardTitle>
                          <Badge variant={getStatusColor(booking.status)} className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{t('machineBooking.bookingDate')}:</span>
                          <span className="font-medium">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {booking.cost && (
                          <div>
                            <span className="text-muted-foreground text-sm">{t('machineBooking.cost')}:</span>
                            <p className="font-medium text-lg">₹{booking.cost.toLocaleString()}</p>
                          </div>
                        )}
                        
                        {booking.notes && (
                          <div>
                            <span className="text-muted-foreground text-sm">{t('machineBooking.notes')}:</span>
                            <p className="font-medium text-sm">{booking.notes}</p>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {t('machineBooking.requested')}: {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                            {booking.status === 'pending' && (
                              <span className="text-xs text-yellow-600 font-medium">
                                {t('machineBooking.awaitingApproval')}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-20">
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">
                {t('machineBooking.howItWorksTitle')}
              </CardTitle>
              <CardDescription className="text-lg text-center">
                {t('machineBooking.howItWorksSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('machineBooking.selectBookTitle')}</h3>
                  <p className="text-gray-600 text-lg">
                    {t('machineBooking.selectBookDescription')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('machineBooking.panchayatCoordTitle')}</h3>
                  <p className="text-gray-600 text-lg">
                    {t('machineBooking.panchayatCoordDescription')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-yellow-600">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('machineBooking.servicePaymentTitle')}</h3>
                  <p className="text-gray-600 text-lg">
                    {t('machineBooking.servicePaymentDescription')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Machine Booking Dialog */}
      <Dialog open={showMachineForm} onOpenChange={setShowMachineForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <MachineBookingForm 
            onSuccess={() => {
              setShowMachineForm(false);
              setSelectedMachine(null);
              fetchMachineData();
            }}
            onCancel={() => {
              setShowMachineForm(false);
              setSelectedMachine(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};