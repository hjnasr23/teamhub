"use client";

import React, { useState, useRef } from "react";
import { Send, UploadCloud, X, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPostMedia, createPostAction } from "@/lib/media-actions";

export default function CreatePostForm({ 
  t, 
  clubId 
}: { 
  t: any;
  clubId: string;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PREMIUM">("PUBLIC");
  
  // Media State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setErrorMsg("Title and content are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let mediaUrl = null;
      let mediaType = null;

      // 1. Upload Media if exists
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("clubId", clubId);

        const uploadRes = await uploadPostMedia(formData);
        
        if (!uploadRes.success) {
          throw new Error(uploadRes.error || "Failed to upload media");
        }
        
        mediaUrl = uploadRes.mediaUrl;
        mediaType = uploadRes.mediaType;
      }

      // 2. Create Post
      const postRes = await createPostAction({
        title,
        content,
        clubId,
        mediaUrl,
        mediaType,
        visibility
      });

      if (!postRes.success) {
        throw new Error(postRes.error || "Failed to create post");
      }

      // 3. Reset form
      setTitle("");
      setContent("");
      setVisibility("PUBLIC");
      removeFile();

    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg dark:bg-rose-950/30 dark:border-rose-900/50">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
          {t.postTitle}
        </label>
        <input 
          id="title"
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.postTitlePlaceholder} 
          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
          {t.content}
        </label>
        <textarea 
          id="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.contentPlaceholder} 
          className="w-full resize-none px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]"
          disabled={isSubmitting}
        />
      </div>

      {/* Media Upload Dropzone */}
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
          {t.attachMedia}
        </label>
        
        {!previewUrl ? (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#111a2e] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-950/30 dark:text-emerald-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">
              {t.clickToUpload}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.mediaSpecs}
            </p>
          </div>
        ) : (
          <div className="relative rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#111a2e] overflow-hidden flex flex-col items-center justify-center">
            {/* Preview Area */}
            <div className="relative w-full max-h-64 flex justify-center bg-black/5 dark:bg-black/20">
              {file?.type.startsWith('video/') ? (
                <video src={previewUrl} className="max-h-64 object-contain" controls />
              ) : (
                <img src={previewUrl} alt="Preview" className="max-h-64 object-contain" />
              )}
            </div>
            
            {/* File Info Footer */}
            <div className="w-full flex items-center justify-between p-3 border-t border-gray-300 dark:border-gray-800 bg-white dark:bg-[#0c1420]">
              <div className="flex items-center gap-2 overflow-hidden">
                {file?.type.startsWith('video/') ? (
                  <Video className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
                <span className="text-xs font-medium text-gray-900 truncate dark:text-slate-300">
                  {file?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                disabled={isSubmitting}
                className="p-1 rounded-md text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          className="hidden"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-3 border-t border-gray-300 dark:border-gray-800 pt-4">
        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-1">
          {t.postVisibility}
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="visibility" 
              value="PUBLIC"
              checked={visibility === "PUBLIC"}
              onChange={(e) => setVisibility(e.target.value as "PUBLIC" | "PREMIUM")}
              className="text-emerald-500 focus:ring-emerald-500"
              disabled={isSubmitting}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-slate-300">{t.public}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="visibility" 
              value="PREMIUM"
              checked={visibility === "PREMIUM"}
              onChange={(e) => setVisibility(e.target.value as "PUBLIC" | "PREMIUM")}
              className="text-emerald-500 focus:ring-emerald-500"
              disabled={isSubmitting}
            />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{t.premiumLabel}</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="gap-2 bg-emerald-500 text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-50 font-bold"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? t.uploading : t.publishPost}
        </Button>
      </div>
    </form>
  );
}
