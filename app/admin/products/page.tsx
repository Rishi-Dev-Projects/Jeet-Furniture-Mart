import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await client.fetch(`*[_type == "product"] | order(createdAt desc) {
    _id,
    name,
    category,
    createdAt,
    "imageUrl": images[0].asset->url
  }`);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-stone-900">Manage Products</h2>
        <Link
          href="/admin/products/new"
          className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2 hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-sans uppercase tracking-widest font-bold">Add Product</span>
        </Link>
      </div>

      <div className="bg-transparent md:bg-white md:border md:border-[#E0DDD8] overflow-hidden rounded-xl md:rounded-none">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E0DDD8]">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E0DDD8]">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover border border-[#E0DDD8]" />
                    ) : (
                      <div className="h-10 w-10 bg-stone-100 border border-[#E0DDD8] flex items-center justify-center text-xs text-stone-400">No Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 capitalize">
                    {product.category.replace(/-/g, ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className="text-stone-500 hover:text-stone-700 p-2"
                        title="Edit Product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </Link>
                      <DeleteButton id={product._id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500 text-sm">
                    No products found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {products.map((product: any) => (
            <div key={`mobile-${product._id}`} className="bg-white border border-[#E0DDD8] rounded-xl overflow-hidden shadow-sm">
              
              {/* Field: Image */}
              <div className="flex justify-between items-center p-4 border-b border-[#E0DDD8]">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Image</span>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-14 w-14 object-cover border border-[#E0DDD8] rounded-md" />
                ) : (
                  <div className="h-14 w-14 bg-stone-100 border border-[#E0DDD8] rounded-md flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                )}
              </div>

              {/* Field: Name */}
              <div className="flex justify-between items-center p-4 border-b border-[#E0DDD8]">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Name</span>
                <span className="text-sm font-medium text-stone-900 text-right">{product.name}</span>
              </div>

              {/* Field: Category */}
              <div className="flex justify-between items-center p-4 border-b border-[#E0DDD8]">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Category</span>
                <span className="text-xs bg-stone-100 px-3 py-1.5 rounded-md text-stone-700 capitalize font-medium">
                  {product.category.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Field: Created */}
              <div className="flex justify-between items-center p-4 border-b border-[#E0DDD8]">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Created</span>
                <span className="text-sm text-stone-700 text-right">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Field: Actions */}
              <div className="flex justify-between items-center p-4 bg-stone-50/50">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Actions</span>
                <div className="flex space-x-3">
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    className="px-4 py-1.5 border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={product._id} variant="text" />
                </div>
              </div>

            </div>
          ))}

          {products.length === 0 && (
            <div className="bg-white border border-[#E0DDD8] rounded-xl p-8 text-center text-stone-500 text-sm shadow-sm">
              No products found. Create one to get started.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
