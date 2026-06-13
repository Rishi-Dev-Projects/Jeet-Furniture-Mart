'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'sofa',
    description: '',
    material: '',
    dimensions: '',
    featured: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let assetId = null;

      // 1. Upload Image if selected
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('file', imageFile);
        const uploadRes = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: imgData,
        });
        
        let uploadJson;
        try {
          uploadJson = await uploadRes.json();
        } catch (e) {
          throw new Error('Server returned an invalid response. This is likely an image processing issue.');
        }

        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Failed to upload image');
        assetId = uploadJson.assetId;
      }

      // 2. Create Product
      const productRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          assetId 
        }),
      });
      const productJson = await productRes.json();
      if (!productRes.ok) throw new Error(productJson.error || 'Failed to create product');

      // 3. Navigate back
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="p-2 hover:bg-stone-200 transition-colors text-stone-600 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-display font-bold text-stone-900">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E0DDD8] p-6 space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Product Name *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent bg-white"
            >
              <optgroup label="Modern">
                <option value="sofa">Sofa</option>
                <option value="chair">Chair</option>
                <option value="bed">Bed</option>
                <option value="tv-unit">TV Unit</option>
                <option value="wardrobe">Wardrobe</option>
                <option value="modular-others">Modular Others</option>
              </optgroup>
              <optgroup label="Spiritual">
                <option value="wooden-swing">Wooden Swing (Jhula)</option>
                <option value="wooden-stand-jhula">Wooden Stand Jhula</option>
                <option value="wooden-mandir">Wooden Mandir</option>
                <option value="wooden-deco-mandir">Wooden Deco Mandir</option>
                <option value="korean-mandir">Korean Mandir</option>
              </optgroup>
              <optgroup label="Artistic">
                <option value="cnc-2d">CNC 2D</option>
                <option value="cnc-3d">CNC 3D</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Dimensions</label>
            <input
              type="text"
              placeholder="e.g. 6ft x 4ft x 2ft"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              className="w-full px-3 py-2 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Material</label>
            <input
              type="text"
              placeholder="e.g. Teak Wood"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-3 py-2 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-[#E0DDD8] focus:outline-none focus:ring-1 focus:ring-gold-accent focus:border-gold-accent resize-y"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">Product Image *</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E0DDD8] border-dashed bg-stone-50 relative">
            <div className="space-y-1 text-center">
              {imageFile ? (
                <div className="text-sm text-stone-900 font-medium">Selected: {imageFile.name}</div>
              ) : (
                <Upload className="mx-auto h-12 w-12 text-stone-400" />
              )}
              <div className="flex text-sm text-stone-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-gold-accent hover:text-gold-accent/80 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" accept="image/*" required className="sr-only" onChange={handleImageChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-stone-500">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-3">
          <input
            id="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="h-4 w-4 text-gold-accent focus:ring-gold-accent border-[#E0DDD8] rounded"
          />
          <label htmlFor="featured" className="block text-sm text-stone-900">
            Feature this product on the home page
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#E0DDD8] flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center py-3 px-8 border border-transparent text-xs font-sans uppercase font-bold tracking-widest text-white bg-black hover:bg-stone-900 focus:outline-none transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Product...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
