import { createClient } from '@supabase/supabase-js';

// Dynamically load server-only modules
const getPrisma = async () => {
  if (typeof window === "undefined") {
    const { prisma } = await import("./db");
    return prisma;
  }
  return null;
};

const getRevalidatePath = async () => {
  if (typeof window === "undefined") {
    const { revalidatePath } = await import("next/cache");
    return revalidatePath;
  }
  return null;
};

export async function uploadPostMedia(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) {
    throw new Error("No file provided");
  }

  if (typeof window !== "undefined") {
    // Client-side mockup for Static Export Mode
    // Simulated upload delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { 
      success: true, 
      mediaUrl: URL.createObjectURL(file), // Generate local mock URL for immediate UI representation
      mediaType: file.type.startsWith('video/') ? 'video' : 'image'
    };
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase API keys are missing in the runtime environment.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `posts/${uniqueFilename}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error } = await supabase.storage
      .from('club-media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(`Supabase Storage Error: Please check if your bucket 'club-media' allows public inserts. Original error: ${error.message}`);
    }

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
  if (typeof window !== "undefined") {
    // Client-side mockup
    const mockPost = {
      id: "mock-post-" + Date.now(),
      title: data.title,
      content: data.content,
      clubId: data.clubId,
      mediaUrl: data.mediaUrl || null,
      mediaType: data.mediaType || null,
      visibility: data.visibility || 'PUBLIC',
      createdAt: new Date(),
    };
    return { success: true, data: mockPost };
  }

  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

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

    const revalidatePath = await getRevalidatePath();
    if (revalidatePath) {
      revalidatePath('/dashboard/club');
      revalidatePath('/');
    }
    
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
  if (typeof window !== "undefined") {
    // Client-side mockup
    return { 
      success: true, 
      data: { 
        id: data.clubId, 
        description: data.description,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      } 
    };
  }

  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

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

    const revalidatePath = await getRevalidatePath();
    if (revalidatePath) {
      revalidatePath('/dashboard/club');
      revalidatePath(`/clubs/${updated.slug}`);
    }
    return { success: true, data: updated };
  } catch (err: any) {
    console.error("Update club settings error:", err);
    return { success: false, error: err.message || "Failed to update settings" };
  }
}

export async function uploadClubAsset(formData: FormData, folder: string = "branding") {
  const file = formData.get('file') as File | null;
  if (!file) throw new Error("No file provided");

  if (typeof window !== "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, mediaUrl: URL.createObjectURL(file) };
  }

  try {
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
