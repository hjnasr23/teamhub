"use server";

import { createClient } from '@supabase/supabase-js';
import { prisma } from './db';
import { revalidatePath } from 'next/cache';

export async function uploadPostMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    
    if (!file) {
      throw new Error("No file provided");
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase API keys are missing in the runtime environment.");
    }

    // Initialize Supabase client lazily on demand
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Sanitize file name
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `posts/${uniqueFilename}`;

    // Safe Binary Buffer Conversion
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('club-media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    // Graceful Error Fallback
    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(`Supabase Storage Error: Please check if your bucket 'club-media' allows public inserts. Original error: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('club-media')
      .getPublicUrl(data.path);

    return { 
      success: true, 
      mediaUrl: publicUrl,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image'
    };

  } catch (err: any) {
    console.error("Media upload error:", err);
    return { success: false, error: err.message || "Failed to upload media" };
  }
}

export async function createPostAction(data: {
  title: string;
  content: string;
  clubId: string;
  mediaUrl?: string | null;
  mediaType?: string | null;
  visibility?: 'PUBLIC' | 'PREMIUM';
}) {
  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        clubId: data.clubId,
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || null,
        visibility: data.visibility || 'PUBLIC',
      }
    });

    // Revalidate paths that might show this post
    revalidatePath('/dashboard/club');
    revalidatePath('/');
    
    return { success: true, data: post };
  } catch (err: any) {
    console.error("Post creation error:", err);
    return { success: false, error: err.message || "Failed to create post" };
  }
}

export async function updateClubSettingsAction(data: {
  clubId: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  bannerUrl?: string;
}) {
  try {
    const updated = await prisma.club.update({
      where: { id: data.clubId },
      data: {
        description: data.description,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
        ...(data.bannerUrl && { bannerUrl: data.bannerUrl }),
      }
    });

    revalidatePath('/dashboard/club');
    revalidatePath(`/clubs/${updated.slug}`);
    return { success: true, data: updated };
  } catch (err: any) {
    console.error("Update club settings error:", err);
    return { success: false, error: err.message || "Failed to update settings" };
  }
}

export async function uploadClubAsset(formData: FormData, folder: string = "branding") {
  try {
    const file = formData.get('file') as File | null;
    if (!file) throw new Error("No file provided");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase API keys are missing in the runtime environment.");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFilename}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error } = await supabase.storage
      .from('club-media')
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(`Supabase Storage Error: Please check if your bucket 'club-media' allows public inserts. Original error: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('club-media').getPublicUrl(data.path);
    return { success: true, mediaUrl: publicUrl };

  } catch (err: any) {
    console.error("Asset upload error:", err);
    return { success: false, error: err.message || "Failed to upload asset" };
  }
}
