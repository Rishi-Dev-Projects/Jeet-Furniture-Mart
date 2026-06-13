import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    
    // Auto-generate a slug from the name if not provided
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const updateData: any = {
      name: body.name,
      slug: { _type: 'slug', current: slug },
      category: body.category,
      description: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: body.description }],
          style: 'normal',
        },
      ],
      dimensions: body.dimensions || '',
      material: body.material || '',
      featured: body.featured || false,
    };

    if (body.assetId) {
      updateData.images = [
        {
          _type: 'image',
          asset: { _type: 'reference', _ref: body.assetId },
        },
      ];
    }

    const result = await writeClient.patch(id).set(updateData).commit();
    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
