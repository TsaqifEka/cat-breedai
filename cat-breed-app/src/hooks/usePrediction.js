import { useState } from 'react';
import axios from 'axios';

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const predict = async (file) => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    // Revoke previous URL to prevent memory leaks
    setPreviewUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use VITE_API_URL from .env if available, otherwise default to local proxy '/predict'
      const apiUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/predict` 
        : '/predict';

      const res = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setResult(res.data);
      } else {
        setError(res.data.error || 'Unknown error occurred.');
      }
    } catch (err) {
      console.error('Prediction Error:', err);
      setError(err.response?.data?.error || err.message || 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPreviewUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  return { predict, reset, loading, result, error, previewUrl };
};
