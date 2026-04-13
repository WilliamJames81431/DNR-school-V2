import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  LogOut,
  Upload,
  Trash2,
  Image as ImageIcon,
  Cpu,
  Loader2,
  Plus,
  X,
  Settings,
  FileText,
  Phone,
  Save,
} from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  createdAt: unknown;
}

interface ProjectItem {
  id: string;
  image: string;
  title: string;
  tag: string;
  createdAt: unknown;
}

// ─── Upload Modal ────────────────────────────────────────────────────────────
function UploadModal({
  type,
  onClose,
  onUpload,
}: {
  type: "gallery" | "project";
  onClose: () => void;
  onUpload: (url: string, title: string, categoryOrTag: string, youtubeUrl?: string) => Promise<void>;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [categoryOrTag, setCategoryOrTag] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title || !categoryOrTag) return;
    setUploading(true);
    try {
      await onUpload(imageUrl, title, categoryOrTag, youtubeUrl);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-brand-burgundy border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Upload className="text-brand-orange" size={24} />
          Upload {type === "gallery" ? "Gallery Image" : "ATL Project"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image URL Input */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Image URL (Google Drive, Imgur, etc.)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-orange transition-all"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder={type === "gallery" ? "e.g. Annual Day Celebration" : "e.g. Smart Bell System"}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-orange transition-all"
            />
          </div>

          {/* Category / Tag */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              {type === "gallery" ? "Category (e.g. Sports, Events)" : "Tag (e.g. Robotics, IoT)"}
            </label>
            <input
              type="text"
              value={categoryOrTag}
              onChange={(e) => setCategoryOrTag(e.target.value)}
              required
              placeholder="Enter a category name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-orange transition-all"
            />
          </div>

          {/* Optional YouTube URL */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              YouTube Video Link (Optional)
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-orange transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !imageUrl || !title || !categoryOrTag}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-brand-burgundy transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Site Content Editor ───────────────────────────────────────────────────
function SiteContentEditor() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "site", "content"), (snap) => {
      if (snap.exists()) {
        setContent(snap.data());
      } else {
        // Defaults
        setContent({
          hero: { title: "The Best Education For Your Child", subtitle: "Discover a place where learning comes alive." },
          about: { title: "About Our School", description: "D.N.R English Medium School is committed to providing a nurturing environment where students thrive academically, socially, and emotionally." },
          contact: { phone: "+91 12345 67890", email: "info@dnremschool.com", address: "Bhimavaram, Andhra Pradesh" },
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("Content stream error:", err);
      setLoading(false);
      alert("Database error: Could not fetch site content. Make sure your rules are deployed!");
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "site", "content"), content, { merge: true });
      alert("Site content updated successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save content. Ensure you have the correct permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-white/50">
        <Loader2 className="animate-spin mx-auto mb-2" />
        Loading editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Hero Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FileText className="text-brand-orange" /> Hero Section
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Announcement Badge</label>
            <input type="text" value={content?.hero?.announcement || ""} onChange={(e) => handleChange("hero", "announcement", e.target.value)} placeholder="e.g. ADMISSIONS OPEN 2026-2027" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Main Title</label>
            <input type="text" value={content?.hero?.title || ""} onChange={(e) => handleChange("hero", "title", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Subtitle</label>
            <input type="text" value={content?.hero?.subtitle || ""} onChange={(e) => handleChange("hero", "subtitle", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Hero Background Image URL (Google Drive/Link)</label>
            <input type="text" value={content?.hero?.bgImage || ""} onChange={(e) => handleChange("hero", "bgImage", e.target.value)} placeholder="/hero-bg.jpg" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Settings className="text-brand-orange" /> About Us Section
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Section Title</label>
            <input type="text" value={content?.about?.title || ""} onChange={(e) => handleChange("about", "title", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea value={content?.about?.description || ""} onChange={(e) => handleChange("about", "description", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange h-32 transition-all hover:border-white/30" />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Phone className="text-brand-orange" /> Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
            <input type="text" value={content?.contact?.phone || ""} onChange={(e) => handleChange("contact", "phone", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
            <input type="email" value={content?.contact?.email || ""} onChange={(e) => handleChange("contact", "email", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all hover:border-white/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Physical Address</label>
            <textarea value={content?.contact?.address || ""} onChange={(e) => handleChange("contact", "address", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange h-24 transition-all hover:border-white/30" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-8 flex justify-end z-10">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow text-white hover:text-brand-burgundy px-10 py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-white/20">
          <Save size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"gallery" | "projects" | "content" | "notices">("gallery");
  const [showUpload, setShowUpload] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newNotice, setNewNotice] = useState("");

  // Real-time listeners
  useEffect(() => {
    if (!db) return;
    const unsubGallery = onSnapshot(collection(db, "gallery"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
      setGalleryItems(items);
    });
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem));
      setProjectItems(items);
    });
    const unsubNotices = onSnapshot(collection(db, "notices"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotices(items);
    });
    return () => { unsubGallery(); unsubProjects(); unsubNotices(); };
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    navigate("/admin");
  };

  // ─── Upload handler ─────────────────────────────────────────────────────
  const convertToDirectLink = (url: string) => {
    const driveRegex = /drive\.google\.com\/(?:file\/d\/|uc\?export=view[^\&]*&id=)([^\/&?]+)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
    }
    return url;
  };

  const handleAddNotice = async () => {
    if (!newNotice || !db) return;
    await addDoc(collection(db, "notices"), {
      text: newNotice,
      createdAt: serverTimestamp(),
    });
    setNewNotice("");
  };

  const handleUpload = async (rawUrl: string, title: string, categoryOrTag: string, youtubeUrl?: string) => {
    if (!db) return;

    const url = convertToDirectLink(rawUrl);

    if (activeTab === "gallery") {
      await addDoc(collection(db, "gallery"), {
        url,
        title,
        category: categoryOrTag,
        youtubeUrl: youtubeUrl || "",
        createdAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "projects"), {
        image: url,
        title,
        tag: categoryOrTag,
        youtubeUrl: youtubeUrl || "",
        createdAt: serverTimestamp(),
      });
    }
  };

  // ─── Delete handler ─────────────────────────────────────────────────────
  const handleDelete = async (
    id: string,
    collectionName: string
  ) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    if (!db) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  const tabs = [
    { key: "gallery" as const, label: "Gallery", icon: <ImageIcon size={18} /> },
    { key: "projects" as const, label: "ATL Projects", icon: <Cpu size={18} /> },
    { key: "content" as const, label: "Site Content", icon: <FileText size={18} /> },
    { key: "notices" as const, label: "Notices", icon: <Bell size={18} /> },
  ];

  const items = activeTab === "gallery" ? galleryItems : projectItems;

  return (
    <div className="min-h-screen bg-brand-burgundy">
      {/* Top Bar */}
      <header className="bg-brand-burgundy/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <ImageIcon size={18} className="text-white" />
            </div>
            <h1 className="text-white font-bold text-lg">Content Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-white/50 text-sm hover:text-white/80 transition-colors hidden sm:block"
            >
              View Website →
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-brand-orange text-white shadow-lg"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== "content" && activeTab !== "notices" && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-yellow hover:text-brand-burgundy transition-all"
            >
              <Plus size={18} />
              Add {activeTab === "gallery" ? "Photo" : "Project"}
            </button>
          )}
        </div>

        {/* Content Grid */}
        {activeTab === "content" && <SiteContentEditor />}

        {activeTab === "notices" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Add New Notice</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newNotice}
                  onChange={(e) => setNewNotice(e.target.value)}
                  placeholder="Enter urgent school notice here..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange"
                />
                <button
                  onClick={handleAddNotice}
                  className="bg-brand-orange hover:bg-brand-yellow text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Add Notice
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group">
                  <p className="text-white text-lg">{notice.text}</p>
                  <button
                    onClick={() => handleDelete(notice.id, "notices")}
                    className="p-3 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {notices.length === 0 && (
                <p className="text-white/20 text-center py-10">No active notices.</p>
              )}
            </div>
          </div>
        )}

        {(activeTab === "gallery" || activeTab === "projects") && (
          items.length === 0 ? (
            <div className="text-center py-24">
              <ImageIcon className="mx-auto text-white/10 mb-4" size={64} />
              <p className="text-white/30 text-lg">
                No {activeTab === "gallery" ? "photos" : "projects"} yet.
              </p>
              <p className="text-white/20 text-sm mt-1">
                Click "Add {activeTab === "gallery" ? "Photo" : "Project"}" to upload your first one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const imageUrl = "url" in item ? item.url : (item as ProjectItem).image;
                const subtitle = "category" in item ? (item as GalleryItem).category : (item as ProjectItem).tag;

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={convertToDirectLink(imageUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
                      <span className="text-brand-orange text-xs font-medium">{subtitle}</span>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id,
                          activeTab === "gallery" ? "gallery" : "projects"
                        )
                      }
                      disabled={deleting === item.id}
                      className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === item.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          type={activeTab === "gallery" ? "gallery" : "project"}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
