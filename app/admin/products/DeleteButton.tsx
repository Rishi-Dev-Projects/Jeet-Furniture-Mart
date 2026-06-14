'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, variant = 'icon' }: { id: string; variant?: 'icon' | 'text' }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let errorMsg = 'Failed to delete';
        try {
          const data = await res.json();
          if (data.error) errorMsg = data.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      router.refresh();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Error deleting product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={
        variant === 'icon' 
          ? "text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
          : "px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
      }
      title="Delete Product"
    >
      {variant === 'icon' ? <Trash2 className="w-4 h-4" /> : 'Delete'}
    </button>
  );
}
