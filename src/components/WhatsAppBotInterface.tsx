import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
}

interface WhatsAppBotInterfaceProps {
  farmerId?: string;
}

export const WhatsAppBotInterface = ({ farmerId }: WhatsAppBotInterfaceProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        type: 'bot',
        message: 'Welcome to Grameen WhatsApp Bot! 🌾\n\nAvailable commands:\n• MY LISTINGS - View your crop residue listings\n• BOOKINGS - Check machine booking status\n• HELP - Get assistance\n• REGISTER - Complete your registration',
        timestamp: new Date().toISOString()
      }
    ]);

    // Load farmer phone if available
    if (farmerId) {
      fetchFarmerPhone();
    }
  }, [farmerId]);

  const fetchFarmerPhone = async () => {
    if (!farmerId) return;

    try {
      const { data: farmer, error } = await supabase
        .from('farmers')
        .select('farmer_phone')
        .eq('id', farmerId)
        .single();

      if (error) throw error;
      
      if (farmer?.farmer_phone) {
        setPhoneNumber(farmer.farmer_phone);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching farmer phone:', error);
    }
  };

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toUpperCase().trim();

    if (message.includes('MY LISTINGS') || message.includes('LISTINGS')) {
      try {
        if (!farmerId) {
          return 'Please complete your farmer registration first to view listings.';
        }

        const { data: listings, error } = await supabase
          .from('crop_residue_listings')
          .select('*')
          .eq('farmer_id', farmerId);

        if (error) throw error;

        if (!listings || listings.length === 0) {
          return 'You have no crop residue listings yet. Contact your Panchayat admin to create listings.';
        }

        let response = `📋 Your Crop Residue Listings (${listings.length}):\n\n`;
        listings.forEach((listing, index) => {
          response += `${index + 1}. ${listing.crop_type.toUpperCase()}\n`;
          response += `   • ${listing.quantity_tons} tons\n`;
          response += `   • Status: ${listing.status}\n`;
          response += `   • Method: ${listing.disposal_method}\n\n`;
        });

        return response;
      } catch (error) {
        return 'Sorry, I couldn\'t fetch your listings right now. Please try again later.';
      }
    }

    if (message.includes('BOOKINGS') || message.includes('MACHINE')) {
      try {
        if (!farmerId) {
          return 'Please complete your farmer registration first to view bookings.';
        }

        const { data: bookings, error } = await supabase
          .from('machine_bookings')
          .select('*')
          .eq('farmer_id', farmerId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (!bookings || bookings.length === 0) {
          return 'You have no machine bookings yet. Contact your Panchayat admin to book machines for crop residue management.';
        }

        let response = `🚜 Your Machine Bookings (${bookings.length}):\n\n`;
        bookings.forEach((booking, index) => {
          response += `${index + 1}. ${booking.machine_type.replace('_', ' ').toUpperCase()}\n`;
          response += `   • Date: ${new Date(booking.booking_date).toLocaleDateString()}\n`;
          response += `   • Status: ${booking.status}\n`;
          if (booking.cost) response += `   • Cost: ₹${booking.cost}\n`;
          response += '\n';
        });

        return response;
      } catch (error) {
        return 'Sorry, I couldn\'t fetch your bookings right now. Please try again later.';
      }
    }

    if (message.includes('HELP') || message.includes('COMMANDS')) {
      return `🤖 Grameen Bot Commands:\n\n• MY LISTINGS - View your crop residue listings\n• BOOKINGS - Check machine booking status\n• REGISTER - Get registration help\n• CONTACT - Get Panchayat contact info\n• PRICES - Current market prices\n• STATUS [listing_id] - Check specific listing\n\nFor technical support, contact your Panchayat admin.`;
    }

    if (message.includes('REGISTER') || message.includes('REGISTRATION')) {
      return `📝 Registration Help:\n\n1. Visit the Grameen platform\n2. Your Panchayat admin will register you\n3. You'll receive login credentials\n4. Start listing your crop residue!\n\nContact your Panchayat office for assistance.`;
    }

    if (message.includes('CONTACT') || message.includes('PANCHAYAT')) {
      return `📞 Contact Information:\n\nFor assistance:\n• Visit your local Panchayat office\n• Contact Panchayat admin\n• Use the Grameen web platform\n\nOr reply with HELP for more commands.`;
    }

    if (message.includes('PRICES') || message.includes('MARKET')) {
      return `💰 Current Market Prices (per ton):\n\n🌾 Paddy: ₹3,000-5,000\n🌾 Wheat: ₹2,500-4,000\n🌻 Sunflower: ₹4,000-6,000\n🌽 Maize: ₹2,000-3,500\n🌿 Sugarcane: ₹1,500-2,500\n\nPrices vary by location and quality. Contact buyers for current rates.`;
    }

    // Default response
    return `I didn't understand "${userMessage}". Reply with HELP to see available commands.`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(async () => {
      const botResponse = await simulateBotResponse(userMessage.message);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const connectWhatsApp = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your WhatsApp number to connect.",
        variant: "destructive"
      });
      return;
    }

    // Simulate connection
    setIsConnected(true);
    toast({
      title: "WhatsApp Connected!",
      description: `Connected to WhatsApp number: ${phoneNumber}`
    });

    // Add connection confirmation message
    const connectMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      message: `✅ WhatsApp connected successfully to ${phoneNumber}!\n\nYou can now receive notifications and updates directly on WhatsApp. Try sending "MY LISTINGS" to get started.`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, connectMessage]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            WhatsApp Bot Interface
            {isConnected && <Badge variant="default">Connected</Badge>}
          </CardTitle>
          <CardDescription>
            Interact with Grameen through WhatsApp for quick updates and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WhatsApp Connection */}
          {!isConnected && (
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter WhatsApp number (e.g., +91 9876543210)"
                  type="tel"
                />
              </div>
              <Button onClick={connectWhatsApp}>
                <Phone className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </div>
          )}

          {/* Chat Interface */}
          <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.type === 'user' ? 'You' : 'Grameen Bot'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message... (try 'MY LISTINGS' or 'HELP')"
              disabled={!isConnected}
            />
            <Button onClick={sendMessage} disabled={!isConnected || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {!isConnected && (
            <p className="text-sm text-muted-foreground text-center">
              Connect your WhatsApp number to start chatting with Grameen Bot
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Commands</CardTitle>
          <CardDescription>
            Common commands you can use with the WhatsApp bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'MY LISTINGS',
              'BOOKINGS', 
              'HELP',
              'PRICES'
            ].map((command) => (
              <Button
                key={command}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputMessage(command);
                  if (isConnected) sendMessage();
                }}
                disabled={!isConnected}
              >
                {command}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};