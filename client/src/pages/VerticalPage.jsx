import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import axios from '../api/axios';

export default function VerticalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/verticals');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch verticals');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Vertical Page</h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message text-red-500 p-4 border border-red-500 rounded bg-red-50">{error}</div>
      ) : (
        <div>Data loaded</div>
      )}
    </div>
  );
}