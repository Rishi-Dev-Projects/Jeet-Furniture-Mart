import { NextResponse } from 'next/server';
import { writeClient, client } from '@/sanity/lib/client';

export async function POST(request: Request) {
  try {
    const { newPassword, currentPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json({ error: 'New password is required' }, { status: 400 });
    }

    // Verify current password against what is stored in Sanity (or fallback to env)
    const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
    const currentPassphrase = settings?.adminPassphrase || process.env.ADMIN_PASSPHRASE || 'admin123';

    if (currentPassword !== currentPassphrase) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }

    // Update or create siteSettings
    if (settings?._id) {
      await writeClient.patch(settings._id).set({ adminPassphrase: newPassword }).commit();
    } else {
      await writeClient.create({
        _type: 'siteSettings',
        adminPassphrase: newPassword,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update password:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
