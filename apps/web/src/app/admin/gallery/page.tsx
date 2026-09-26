"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Image as ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";

const INPUT_CLS = "w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] transition-colors";
const SELECT_CLS = "px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono focus:outline-none focus:border-[#FFE816] transition-colors";

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
    try { const res = await api.get("/api/gallery/"); setItems(res.data); }
    catch {} finally { setLoading(false); }
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

  useEffect(() => { fetchGallery(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) { showToast("Title and image URL are required.", "error"); return; }
    setUploading(true);
    try {
      await api.post("/api/gallery/", { title, category, image_url: imageUrl });
      showToast("Photo added!", "success");
      setTitle(""); setImageUrl(""); setCategory("other");
      fetchGallery();
    } catch { showToast("Failed to add photo.", "error"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    try { await api.delete(`/api/gallery/${id}/`); showToast("Deleted.", "success"); fetchGallery(); }
    catch { showToast("Failed to delete.", "error"); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 bg-[#F79CFF] border-2 border-black shadow-[3px_3px_0px_#000]">
          <ImageIcon className="w-4 h-4 text-black" />
        </div>
        <div>
          <h1 className="font-pixel text-xl font-bold text-white uppercase">Gallery</h1>
          <p className="font-mono text-[10px] text-white/30 uppercase">{items.length} photos</p>
        </div>
      </div>

      {/* Add form */}
      <div className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-[#FFE816]" />
          <span className="font-pixel text-[10px] text-white uppercase tracking-wider">Add New Photo</span>
        </div>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text" placeholder="Photo title" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT_CLS + " flex-1"}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={SELECT_CLS}>
            <option value="other">Other</option>
            <option value="ctf">CTF</option>
            <option value="workshops">Workshops</option>
            <option value="seminars">Seminars</option>
            <option value="hackathons">Hackathons</option>
          </select>
          <div className="flex gap-2 flex-1">
            <input
              type="text" placeholder="https://image-url.com/photo.jpg or upload" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={INPUT_CLS + " flex-1"}
            />
            <input
              type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FFE816] text-black font-pixel text-[9px] uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {uploadingFile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Upload
            </button>
          </div>
          <button
            type="submit" disabled={uploading}
            className="flex items-center gap-2 px-5 py-2 bg-[#C3FF16] text-black font-pixel text-[10px] uppercase border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add Photo
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#FFE816]" />
          <span className="font-pixel text-[10px] text-white/30 uppercase animate-pulse">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] overflow-hidden group"
            >
              <div className="aspect-[4/3] bg-[#0C0C14] overflow-hidden">
                <img
                  src={item.image_url} alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 border-t-2 border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-pixel text-[10px] text-white uppercase truncate">{item.title}</p>
                  <p className="font-mono text-[9px] text-white/30 uppercase">{item.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-shrink-0 flex items-center justify-center w-7 h-7 border-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 border-2 border-white/10 p-16 text-center">
              <p className="font-pixel text-[10px] text-white/20 uppercase">No photos yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
