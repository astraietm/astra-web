"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Upload, Trash2, Loader2, Plus } from "lucide-react";

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [imageUrl, setImageUrl] = useState("");
  const { showToast } = useToast();

  const fetchGallery = async () => {
    try { const res = await api.get("/api/gallery/"); setItems(res.data); } catch {} finally { setLoading(false); }
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
    try { await api.delete(`/api/gallery/${id}/`); showToast("Photo deleted.", "success"); fetchGallery(); }
    catch { showToast("Failed to delete.", "error"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">Gallery Management</h1>

      <div className="bg-[#111318] border border-white/5 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-medium text-white mb-4">Add New Photo</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white">
            <option value="other">Other</option><option value="ctf">CTF</option><option value="workshops">Workshops</option>
            <option value="seminars">Seminars</option><option value="hackathons">Hackathons</option>
          </select>
          <input type="url" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white" />
          <button type="submit" disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
          </button>
        </form>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="bg-[#111318] border border-white/5 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-gray-900"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /></div>
              <div className="p-3 flex items-center justify-between">
                <div><p className="text-sm text-white font-medium">{item.title}</p><p className="text-xs text-gray-500">{item.category}</p></div>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
