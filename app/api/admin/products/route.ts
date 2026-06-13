import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Auto-generate a slug from the name if not provided
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Structure the document for Sanity
    const doc = {
      _type: 'product',
      name: body.name,
      slug: { _type: 'slug', current: slug },
      category: body.category,
      // themeZone is auto-derived or left default
      themeZone: 'modern',
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
      createdAt: new Date().toISOString(),
      viewCount: 0,
      images: body.assetId
        ? [
            {
              _type: 'image',
              asset: { _type: 'reference', _ref: body.assetId },
            },
          ]
        : [],
    };

    const result = await writeClient.create(doc);

    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
