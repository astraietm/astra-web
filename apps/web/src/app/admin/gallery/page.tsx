"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Image as ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const fetchGallery = async () => {
    try {
      const res = await api.get("/api/gallery/");
      setItems(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image file size must be less than 10MB.", "error");
      return;
    }

    setUploadingFile(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dykinibqt";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "astra_gallery";

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.secure_url) {
          setImageUrl(json.secure_url);
          showToast("Image uploaded successfully!", "success");
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result as string);
          showToast("Image attached successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result as string);
          showToast("Image attached successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      showToast("Title and image URL are required.", "error");
      return;
    }
    setUploading(true);
    try {
      await api.post("/api/gallery/", { title, category, image_url: imageUrl });
      showToast("Photo added!", "success");
      setTitle("");
      setImageUrl("");
      setCategory("other");
      fetchGallery();
    } catch {
      showToast("Failed to add photo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await api.delete(`/api/gallery/${id}/`);
      showToast("Deleted.", "success");
      fetchGallery();
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Media Gallery
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {items.length} uploaded photos &amp; event memories
          </p>
        </div>
      </div>

      {/* Add form */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-white" /> Add New Photo
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Photo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all cursor-pointer"
          >
            <option value="other">Other</option>
            <option value="ctf">CTF</option>
            <option value="workshops">Workshops</option>
            <option value="seminars">Seminars</option>
            <option value="hackathons">Hackathons</option>
          </select>
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="Image URL or upload"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              title="Upload from computer"
            >
              {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Upload</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Add Photo</span>
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
            Loading gallery...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-neutral-800/80 bg-neutral-900/50 overflow-hidden shadow-sm hover:border-neutral-700 transition-all"
            >
              <div className="aspect-video w-full overflow-hidden bg-neutral-950 relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = "0.3";
                  }}
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer shadow-sm"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-white truncate">{item.title}</h3>
                  <span className="text-[10px] text-neutral-400 capitalize">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-neutral-800 p-16 text-center">
              <p className="text-xs text-neutral-500">No gallery items found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
