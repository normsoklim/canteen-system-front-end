import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import settingsService from '../settingsService';

interface SystemSettingsData {
  canteenName: string;
  operatingHours: {
    open: string;
    close: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentMethods: string[];
  taxRate: number;
  deliveryEnabled: boolean;
  minimumOrderAmount: number;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await settingsService.getSystemSettings();
        setSettings(result as SystemSettingsData);
      } catch (err) {
        setError('Failed to load settings. Please try again later.');
        console.error('Settings error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setSettings(prev => prev ? {
        ...prev,
        [name]: target.checked
      } : null);
    } else {
      // Handle nested properties
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setSettings(prev => prev ? {
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value
          }
        } : null);
      } else {
        setSettings(prev => prev ? {
          ...prev,
          [name]: value
        } : null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await settingsService.updateSystemSettings(settings);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      console.error('Update settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">System Settings</h1>
        <p className="text-center">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">System Settings</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {settings && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            
            <Input
              label="Canteen Name"
              name="canteenName"
              value={settings.canteenName}
              onChange={handleChange}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Opening Time"
                type="time"
                name="operatingHours.open"
                value={settings.operatingHours.open}
                onChange={handleChange}
                required
              />
              <Input
                label="Closing Time"
                type="time"
                name="operatingHours.close"
                value={settings.operatingHours.close}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <Input
              label="Phone Number"
              name="contactInfo.phone"
              value={settings.contactInfo.phone}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              name="contactInfo.email"
              value={settings.contactInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tax Rate (%)"
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                required
              />
              <Input
                label="Minimum Order Amount"
                type="number"
                name="minimumOrderAmount"
                value={settings.minimumOrderAmount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="deliveryEnabled"
                  checked={settings.deliveryEnabled}
                  onChange={handleChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Enable Delivery</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
            <p className="text-gray-600 mb-3">Select available payment methods:</p>
            
            <div className="space-y-2">
              {['cash', 'card', 'upi', 'digital_wallet'].map(method => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings(prev => prev ? {
                          ...prev,
                          paymentMethods: [...prev.paymentMethods, method]
                        } : null);
                      } else {
                        setSettings(prev => prev ? {
                          ...prev,
                          paymentMethods: prev.paymentMethods.filter(m => m !== method)
                        } : null);
                      }
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">{method.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={saving}
              variant="primary"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SystemSettings;