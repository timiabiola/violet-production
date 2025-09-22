
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ReviewRequestForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Default IDs to use for the database schema compatibility
  const defaultBusinessUnitId = '00000000-0000-0000-0000-000000000000';
  const defaultLicenseeId = '00000000-0000-0000-0000-000000000001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send review requests",
        variant: "destructive",
      });
      return;
    }
    
    if (!customerName || !phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate unique key for tracking
      const uniqueKey = nanoid(10);
      
      const { error } = await supabase
        .from('review_requests')
        .insert({
          licensee_id: defaultLicenseeId,
          patient_name: customerName,
          phone_number: phoneNumber,
          created_by: user.id,
          unique_key: uniqueKey,
          business_unit_id: defaultBusinessUnitId,
        });
        
      if (error) throw error;
      
      toast({
        title: "Request sent",
        description: "The review request has been sent successfully",
      });
      
      // Reset form
      setCustomerName('');
      setPhoneNumber('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send review request';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-4 pb-4 border-b border-white/10">
        <h3 className="text-lg font-medium text-violet-300">Customer Review Request</h3>
        <p className="text-sm text-gray-400 mt-1">Submit a new review request in seconds</p>
      </div>

      <div className="space-y-5">
        <div className={`form-control ${focusedField === 'customer' ? 'is-focused' : ''}`}>
          <label className="block text-white/70 text-sm mb-1.5 font-medium">Customer Name</label>
          <div className="relative">
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onFocus={() => setFocusedField('customer')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter customer's name"
              className="h-11 bg-white/10 rounded-md border border-white/20 text-white pl-3 pr-3 
                        hover:border-white/30 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            {customerName && (
              <span className="absolute right-3 top-3 text-green-400 text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </span>
            )}
          </div>
        </div>
        
        <div className={`form-control ${focusedField === 'phone' ? 'is-focused' : ''}`}>
          <label className="block text-white/70 text-sm mb-1.5 font-medium">Phone Number</label>
          <div className="relative">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="(555) 555-5555"
              className="h-11 bg-white/10 rounded-md border border-white/20 text-white pl-3 pr-3
                        hover:border-white/30 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            {phoneNumber && (
              <span className="absolute right-3 top-3 text-green-400 text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </span>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 transition text-white rounded-md shadow-md shadow-violet-900/20 hover:shadow-violet-900/40 relative overflow-hidden group h-11"
          disabled={isLoading}
        >
          <span className="relative z-10">{isLoading ? "Sending..." : "Send Review Request"}</span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600/0 via-white/10 to-violet-600/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
        </Button>
      </div>
    </form>
  );
};

export default ReviewRequestForm;
