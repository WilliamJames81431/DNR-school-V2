import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "./firebase";
import {
  LogOut,
  Upload,
  Trash2,
  Image as ImageIcon,
  Cpu,
  Loader2,
  Plus,
  X,
} from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  storagePath: string;
  createdAt: unknown;
}

interface ProjectItem {
  id: string;
  image: string;
  title: string;
  tag: string;
  storagePath: string;
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
  onUpload: (file: File, title: string, categoryOrTag: string) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [categoryOrTag, setCategoryOrTag] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const galleryCategories = ["Events", "Activities", "Sports", "Academic", "Campus"];
  const projectTags = ["Automation", "Sensors", "Renewable", "IoT", "Robotics", "3D Printing"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !categoryOrTag) return;
    setUploading(true);
    try {
      await onUpload(file, title, categoryOrTag);
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
          {/* File Input */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Image File
            </label>
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video mb-2">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-brand-orange/50 transition-colors bg-white/5">
                <ImageIcon className="text-white/30 mb-2" size={32} />
                <span className="text-white/40 text-sm">Click to select an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
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
              {type === "gallery" ? "Category" : "Tag"}
            </label>
            <div className="flex flex-wrap gap-2">
              {(type === "gallery" ? galleryCategories : projectTags).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCategoryOrTag(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    categoryOrTag === opt
                      ? "bg-brand-orange text-white border-brand-orange"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file || !title || !categoryOrTag}
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

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"gallery" | "projects">("gallery");
  const [showUpload, setShowUpload] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

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
    return () => { unsubGallery(); unsubProjects(); };
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    navigate("/admin");
  };

  // ─── Upload handler ─────────────────────────────────────────────────────
  const handleUpload = async (file: File, title: string, categoryOrTag: string) => {
    if (!storage || !db) return;
    const folder = activeTab === "gallery" ? "gallery" : "projects";
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    if (activeTab === "gallery") {
      await addDoc(collection(db, "gallery"), {
        url,
        title,
        category: categoryOrTag,
        storagePath: `${folder}/${fileName}`,
        createdAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "projects"), {
        image: url,
        title,
        tag: categoryOrTag,
        storagePath: `${folder}/${fileName}`,
        createdAt: serverTimestamp(),
      });
    }
  };

  // ─── Delete handler ─────────────────────────────────────────────────────
  const handleDelete = async (
    id: string,
    storagePath: string,
    collectionName: string
  ) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    if (!storage || !db) return;
    setDeleting(id);
    try {
      // Delete from Storage
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      // Delete from Firestore
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

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-yellow hover:text-brand-burgundy transition-all"
          >
            <Plus size={18} />
            Add {activeTab === "gallery" ? "Photo" : "Project"}
          </button>
        </div>

        {/* Content Grid */}
        {items.length === 0 ? (
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
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
                    <span className="text-brand-orange text-xs font-medium">{subtitle}</span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() =>
                      handleDelete(
                        item.id,
                        item.storagePath,
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
