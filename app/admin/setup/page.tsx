// app/admin/setup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setApiKey } from '@/store/adminSlice';
import { adminApi } from '@/lib/admin-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const [apiKey, setApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError(null);
    setSuccess(false);

    // Temporarily set key to test
    localStorage.setItem('admin_api_key', apiKey);
    
    try {
      const response = await adminApi.checkApiKeyStatus();
      if (response.data.success && response.data.valid) {
        dispatch(setApiKey(apiKey));
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        setError('Invalid API key. Please check and try again.');
        localStorage.removeItem('admin_api_key');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate API key');
      localStorage.removeItem('admin_api_key');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access Required</CardTitle>
          <CardDescription>
            Enter your admin API key to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter your admin API key"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="font-mono"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>API key validated! Redirecting...</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isValidating || !apiKey}>
              {isValidating ? 'Validating...' : 'Access Dashboard'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Contact your system administrator to obtain an API key.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}