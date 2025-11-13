// Razorpay Configuration
// Replace these with your actual Razorpay keys from https://dashboard.razorpay.com/

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'; // Test key - replace with your key

// Note: In production, you should:
// 1. Get your Razorpay keys from https://dashboard.razorpay.com/
// 2. Add VITE_RAZORPAY_KEY_ID to your .env file
// 3. Never commit your secret key to the repository

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(true);
      } else {
        reject(new Error('Razorpay script failed to load'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    document.body.appendChild(script);
  });
};

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

