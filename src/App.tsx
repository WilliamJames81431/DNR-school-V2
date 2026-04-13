import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { 
  Cpu, 
  Printer, 
  Wifi, 
  Lightbulb, 
  Trophy, 
  Music, 
  Palette, 
  Bike,
  Phone,
  MapPin,
  Youtube,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Mail,
  ArrowLeft,
  Users,
  Award,
  CheckCircle,
  PlayCircle,
  MessageCircle,
  Bell,
  Megaphone,
  Beaker,
  Calculator,
  Monitor,
  BookOpen,
  Gamepad2,
  Cast,
  Wind,
  Database,
  Radio,
  Image as ImageIcon
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db, isConfigured } from "./firebase";

// ─── Utility ────────────────────────────────────────────────────────────
const getDriveThumbnailUrl = (url: string) => {
  if (!url) return url;
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|uc\?export=view[^\&]*&id=)([^\/&?]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
  }
  return url;
};

// ─── Site Content CMS Hook ────────────────────────────────────────────────
const defaultSiteContent: any = {
  hero: { title: "The Best Education", subtitle: "For Your Child", announcement: "ADMISSIONS OPEN 2026-2027", bgImage: "/hero-bg.jpg" },
  about: { title: "About Our School", description: "D.N.R English Medium School is committed to providing a nurturing environment where students thrive academically, socially, and emotionally." },
  contact: { phone: "+91 96767 65185", email: "info@dnremschool.com", address: "Bhimavaram, Andhra Pradesh" }
};

const useSiteContent = () => {
  const [content, setContent] = useState(defaultSiteContent);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsub = onSnapshot(doc(db, "site", "content"), (snap) => {
      if (snap.exists()) {
        setContent((prev: any) => ({ ...prev, ...snap.data() }));
      }
    });
    return unsub;
  }, []);

  return content;
};

// ─── Spring Physics Presets (Natural Smooth) ─────────────────────────────
const springBouncy = { type: "spring" as const, stiffness: 200, damping: 20, mass: 1 };
const springGentle = { type: "spring" as const, stiffness: 100, damping: 25, mass: 1 };
const springFloaty = { type: "spring" as const, stiffness: 80, damping: 30, mass: 1.5 };
const springSnappy = { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.8 };

// ─── Floating Orbs Background ────────────────────────────────────────────
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      className="orb orb-orange w-96 h-96 -top-20 -right-20"
      animate={{ 
        y: [0, -30, 0], 
        x: [0, 20, 0],
        borderRadius: ["40% 60% 70% 30% / 40% 40% 60% 50%", "70% 30% 50% 50% / 30% 30% 70% 70%", "40% 60% 70% 30% / 40% 40% 60% 50%"]
      }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="orb orb-yellow w-72 h-72 top-1/3 -left-10"
      animate={{ 
        y: [0, 40, 0], 
        x: [0, -30, 0],
        borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 50% 60% 30% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%"]
      }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.div 
      className="orb orb-red w-80 h-80 bottom-10 right-1/4"
      animate={{ 
        y: [0, -20, 0], 
        x: [0, -40, 0],
        scale: [1, 1.15, 1]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>
);

// ─── Stagger Container ──────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springGentle
  }
};

// ─── Components ──────────────────────────────────────────────────────────

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Academics", href: "#academics" },
    { name: "Gallery", href: "#gallery" },
    { name: "School Labs", href: "#labs" },
    { name: "Admissions", href: "#admissions" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={springBouncy}
      className={`fixed w-full z-[60] backdrop-blur-md shadow-lg border-b border-white/10 transition-all duration-500 ${
        scrolled ? "bg-brand-burgundy/95 shadow-2xl" : "bg-brand-burgundy/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div 
            className="flex-shrink-0 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={springSnappy}
          >
            <motion.img 
              src="/logo.png" 
              alt="DNR School Logo"
              className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-brand-orange/30"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex flex-col">
              <span className="text-brand-orange font-bold text-xl leading-none tracking-tighter">D.N.R</span>
              <span className="text-white/80 font-semibold text-sm hidden sm:block">E.M. School</span>
            </div>
          </motion.div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springGentle, delay: i * 0.08 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="text-white/80 hover:text-brand-orange px-2 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#admissions"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={springBouncy}
                className="bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-brand-yellow hover:text-brand-burgundy transition-all"
              >
                Enroll Now
              </motion.a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={springGentle}
          className="md:hidden bg-brand-burgundy border-t border-white/10"
        >
          <motion.div 
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                variants={staggerItem}
                className="text-white/80 hover:text-brand-orange block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
};

const Hero = () => {
  const content = useSiteContent();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const bgY = useTransform(smoothScroll, [0, 1], ["0%", "30%"]);
  const textY = useTransform(smoothScroll, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(smoothScroll, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.img 
          src={content.hero?.bgImage || "/hero-bg.jpg"} 
          alt="School Campus"
          className="w-full h-full object-cover"
          style={{ scale: imageScale, y: bgY }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="orb orb-orange w-96 h-96 -top-32 right-10 animate-float-slow opacity-60" />
        <div className="orb orb-yellow w-64 h-64 bottom-20 -left-20 animate-drift opacity-40" style={{ animationDelay: "3s" }} />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-4 h-4 bg-brand-yellow rounded-full"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-brand-orange rounded-full"
          animate={{ y: [0, -20, 0], x: [0, 15, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/5 w-2 h-2 bg-white rounded-full"
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <motion.div 
        className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white pt-20"
        style={{ y: textY, opacity }}
      >
        <div className="max-w-4xl">
          {content.hero?.announcement && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springGentle, delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-yellow px-4 py-2 rounded-full mb-8 shadow-xl border border-white/20"
            >
              <div className="w-2 h-2 bg-brand-burgundy rounded-full animate-pulse" />
              <span className="text-brand-burgundy font-black text-xs uppercase tracking-widest">
                {content.hero.announcement}
              </span>
            </motion.div>
          )}

          <motion.h1 
            className="text-white font-black text-5xl md:text-8xl mb-6 leading-[1] tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springBouncy, delay: 0.8 }}
          >
            {content.hero?.title || "The Best Education For Your Child"}
          </motion.h1>
          
          <motion.p 
            className="text-white/90 text-2xl md:text-3xl font-bold mb-12 max-w-2xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 1 }}
          >
            {content.hero?.subtitle}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 1.2 }}
          >
            <motion.a
              href="tel:+919676765185"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,140,0,0.4)]"
            >
              Register Now
            </motion.a>
            <motion.a
              href="#labs"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={springBouncy}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              School Labs
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Curved Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.23,103.19,115,100.27,171.55,91.36,235.38,81.3,281.39,63.88,321.39,56.44Z" fill="#4A0404"></path>
        </svg>
      </div>
    </section>
  );
};

const ProjectVideoModal = ({ videoUrl, onClose }: { videoUrl: string, onClose: () => void }) => {
  if (!videoUrl) return null;
  const videoId = videoUrl.includes('v=') ? videoUrl.split('v=')[1].split('&')[0] : videoUrl.split('/').pop();

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <motion.div 
        className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,140,0,0.3)] relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-brand-orange text-white p-3 rounded-full transition-all"
        >
          <X size={24} />
        </button>
        <iframe 
          className="w-full h-full border-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Project Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </div>
  );
};

const ProjectCard = ({ project, onClick }: { project: any, onClick: (url: string) => void }) => {
  return (
    <motion.div 
      variants={staggerItem}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={springBouncy}
      onClick={() => project.youtubeUrl && onClick(project.youtubeUrl)}
      className={`group relative block rounded-3xl overflow-hidden shadow-lg h-64 hover-lift cursor-pointer`}
    >
      <img 
        src={getDriveThumbnailUrl(project.image)} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 transition-colors duration-500 group-hover:from-black/90"></div>
      
      {project.youtubeUrl && (
        <>
          <motion.div 
            className="absolute top-4 right-4 bg-red-600/90 p-3 rounded-full text-white shadow-xl z-20"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Youtube size={24} fill="currentColor" />
          </motion.div>
          <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2">
              <PlayCircle size={60} className="text-white drop-shadow-2xl" />
              <span className="text-white font-bold text-lg tracking-wider uppercase">Watch Video</span>
            </div>
          </div>
        </>
      )}

      <div className="absolute bottom-6 left-6 text-white z-20">
        <span className="text-xs font-bold bg-brand-orange px-2 py-1 rounded mb-2 inline-block">
          {project.tag}
        </span>
        <h5 className="text-xl font-bold">{project.title}</h5>
      </div>
    </motion.div>
  );
};

const FacilityDetailModal = ({ facility, projects, onOpenVideo, onClose }: { facility: any, projects: any[], onOpenVideo: (url: string) => void, onClose: () => void }) => {
  const [activeFolder, setActiveFolder] = useState<"photos" | "videos">("photos");
  if (!facility) return null;

  const photoItems = [
    ...(facility.imageUrl ? [{ image: facility.imageUrl, title: "Main View", tag: "Overview" }] : []),
    ...projects.filter(p => !p.youtubeUrl)
  ];

  const videoItems = [
    ...(facility.videoUrl ? [{ youtubeUrl: facility.videoUrl, title: "Featured Video", tag: "Featured" }] : []),
    ...projects.filter(p => p.youtubeUrl)
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        className="bg-brand-burgundy border border-white/20 rounded-[2.5rem] overflow-hidden w-full max-w-6xl max-h-[90vh] shadow-[0_0_100px_rgba(255,140,0,0.2)] flex flex-col relative"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={springBouncy}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[1010] bg-black/50 hover:bg-brand-orange text-white p-3 rounded-2xl backdrop-blur-md transition-all shadow-xl group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Sidebar / Overview */}
          <div className="md:w-1/3 bg-black/40 p-8 flex flex-col border-r border-white/10 overflow-y-auto custom-scrollbar">
            <div className="w-16 h-1 bg-brand-yellow rounded-full mb-6" />
            <h3 className="text-4xl font-black text-white mb-4 leading-tight uppercase tracking-tighter">{facility.title}</h3>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {facility.longDesc || facility.desc}
            </p>
            
            {/* Folder Navigation */}
            <div className="space-y-3 mt-auto">
              <button 
                onClick={() => setActiveFolder("photos")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeFolder === "photos" ? "bg-brand-orange text-white shadow-xl" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs">
                  <ImageIcon size={20} /> Photos Folder
                </div>
                <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full">{photoItems.length}</span>
              </button>
              <button 
                onClick={() => setActiveFolder("videos")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeFolder === "videos" ? "bg-brand-orange text-white shadow-xl" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs">
                  <Youtube size={20} /> Videos Folder
                </div>
                <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full">{videoItems.length}</span>
              </button>
            </div>

            <div className="pt-8">
              <button 
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white hover:text-brand-burgundy text-white py-4 rounded-2xl font-black text-sm transition-all uppercase tracking-tighter"
              >
                Exit Lab
              </button>
            </div>
          </div>

          {/* Folder Content Grid */}
          <div className="md:w-2/3 p-8 overflow-y-auto custom-scrollbar bg-brand-burgundy/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeFolder === "photos" ? (
                photoItems.length > 0 ? (
                  photoItems.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-3xl overflow-hidden aspect-video border border-white/10 relative group"
                    >
                      <img 
                        src={getDriveThumbnailUrl((item as any).image)} 
                        alt="Gallery Detail"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white font-bold text-sm tracking-tight">{(item as any).title}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center text-white/30 italic">No photos available in this folder yet.</div>
                )
              ) : (
                videoItems.length > 0 ? (
                  videoItems.map((item, i) => (
                    <div key={i} className="col-span-1">
                      <ProjectCard project={item} onClick={onOpenVideo} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center text-white/30 italic">No videos available in this folder yet.</div>
                )
              )}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const LabsFacilities = ({ onModalToggle }: { onModalToggle: (open: boolean) => void }) => {
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [firebaseProjects, setFirebaseProjects] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    onModalToggle(!!selectedFacility || !!activeVideo);
  }, [selectedFacility, activeVideo, onModalToggle]);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsubFac = onSnapshot(collection(db, "facilities"), (snap) => {
      setFacilities(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubProj = onSnapshot(collection(db, "projects"), (snap) => {
      setFirebaseProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubFac(); unsubProj(); };
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Beaker": return <Beaker />;
      case "Calculator": return <Calculator />;
      case "Cpu": return <Cpu />;
      case "Monitor": return <Monitor />;
      case "Cast": return <Cast />;
      case "Gamepad2": return <Gamepad2 />;
      case "BookOpen": return <BookOpen />;
      case "Music": return <Music />;
      case "Palette": return <Palette />;
      case "Trophy": return <Trophy />;
      case "Radio": return <Radio />;
      default: return <Database />;
    }
  };

  const defaultCategories = [
    { title: "Science Lab", desc: "Hands-on experiments in Physics, Chemistry, and Biology.", iconName: "Beaker" },
    { title: "Math Lab", desc: "Making numbers come alive with practical mental tools.", iconName: "Calculator" },
    { title: "Atal Lab", desc: "Our Innovation Hub for Robotics, IoT, and 3D Printing.", iconName: "Cpu" },
  ];

  const displayItems = useMemo(() => {
    const firestoreItems = facilities.map(f => ({ ...f, isUserAdded: true }));
    // Only include defaults if a Firestore item with the same title doesn't exist
    const filteredDefaults = defaultCategories.filter(def => 
      !firestoreItems.some(f => f.title.toLowerCase() === def.title.toLowerCase())
    );
    return [...filteredDefaults, ...firestoreItems];
  }, [facilities]);
  const projects = firebaseProjects.length > 0 ? firebaseProjects : [
    { title: "Smart Bell System", image: "/atl-project-1.jpg", tag: "Automation" },
    { title: "Rain Detection Project", image: "/atl-project-2.jpg", tag: "Sensors" },
  ];

  return (
    <section id="labs" className="py-24 bg-brand-brown-red text-white overflow-hidden relative">
      <FloatingOrbs />
      {activeVideo && <ProjectVideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springBouncy, delay: 0.1 }}
          >
            Infrastructure of Tomorrow
          </motion.h2>
          <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Labs & Facilities</h3>
          <p className="text-white/70 max-w-2xl mx-auto text-lg italic">
            "Experience the pinnacle of learning infrastructure where every corner is designed for excellence."
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 mb-20 pointer-events-auto">
          {displayItems.map((cat, idx) => (
            <motion.button 
              key={(cat as any).id || idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(255, 140, 0, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFacility(cat)}
              transition={{ ...springBouncy, delay: idx * 0.05 }}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] text-left group"
            >
              <div className="h-full bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 group-hover:bg-white/10 group-hover:border-brand-orange/50 transition-all shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 blur-[40px] rounded-full -mr-12 -mt-12 transition-all group-hover:bg-brand-orange/30"></div>
                
                <div className="w-20 h-20 bg-brand-orange/10 rounded-3xl flex items-center justify-center mb-6 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all shadow-inner group-hover:shadow-[0_0_40px_rgba(255,140,0,0.6)]">
                  <div className="p-4 transform group-hover:scale-125 transition-transform duration-500 text-3xl">
                    {getIcon((cat as any).iconName)}
                  </div>
                </div>
                
                <h4 className="font-black text-xl mb-3 text-white uppercase tracking-tighter whitespace-nowrap">{(cat as any).title}</h4>
                <div className="text-sm text-white/50 mb-4 line-clamp-2 leading-tight">{(cat as any).desc}</div>
                
                <div className="mt-auto flex items-center gap-2 text-brand-yellow font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Now <ChevronRight size={14} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Modal Management */}
        {selectedFacility && (
          <FacilityDetailModal 
            facility={selectedFacility} 
            projects={firebaseProjects.filter(p => p.facilityId === selectedFacility.id)}
            onOpenVideo={setActiveVideo}
            onClose={() => setSelectedFacility(null)} 
          />
        )}

        <div className="mb-12">
          <motion.h4 
            className="text-2xl font-black mb-8 flex items-center gap-3 text-brand-yellow uppercase tracking-tighter"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={springGentle}
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-2 bg-brand-orange/20 rounded-xl"
            >
              <Cpu size={24} className="text-brand-orange" />
            </motion.div>
            Student Innovations
          </motion.h4>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {projects.map((project: any, idx: number) => (
              <ProjectCard key={project.id || idx} project={project} onClick={setActiveVideo} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  const stats = [
    { icon: <Users size={32} />, value: "1000+", label: "Students Enrolled" },
    { icon: <Award size={32} />, value: "15+", label: "Years of Excellence" },
    { icon: <Trophy size={32} />, value: "50+", label: "Awards Won" },
    { icon: <CheckCircle size={32} />, value: "100%", label: "Result Success" },
  ];

  return (
    <section className="py-20 bg-brand-burgundy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              className="flex flex-col items-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: idx * 0.1 }}
            >
              <motion.div 
                className="text-brand-yellow mb-4 p-4 bg-white/5 rounded-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut" }}
              >
                {stat.icon}
              </motion.div>
              <h4 className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</h4>
              <p className="text-white/60 font-bold uppercase text-xs tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutUs = () => {
  const content = useSiteContent();
  return (
    <section id="about" className="py-24 bg-brand-burgundy/95 text-white overflow-hidden relative">
      <FloatingOrbs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto bg-white/5 border border-white/10 p-12 rounded-3xl backdrop-blur-sm shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springFloaty}
        >
          <h2 className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-4">Discover DNR</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white drop-shadow-md">{content.about?.title || "About Our School"}</h3>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-line">
            {content.about?.description || "D.N.R English Medium School is committed to providing a nurturing environment where students thrive academically, socially, and emotionally."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Academics = () => {
  const activities = [
    { icon: <Bike />, name: "Sports" },
    { icon: <Trophy />, name: "Karate" },
    { icon: <Music />, name: "Dance" },
    { icon: <Palette />, name: "Arts & Crafts" },
  ];

  return (
    <section id="academics" className="py-24 bg-brand-burgundy text-white relative overflow-hidden">
      <FloatingOrbs />
      {/* Curved Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.23,103.19,115,100.27,171.55,91.36,235.38,81.3,281.39,63.88,321.39,56.44Z" fill="#4A0404"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.h2 
              className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: 0.1 }}
            >
              Academic Excellence
            </motion.h2>
            <motion.h3 
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight break-words hyphens-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springFloaty, delay: 0.2 }}
            >
              IIT-NEET Foundation <br />
              Excellence Program
            </motion.h3>
            <motion.p 
              className="text-white/80 text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: 0.3 }}
            >
              Our specialized curriculum focuses on building a strong foundation for competitive exams from an early age, combined with activity-based learning to ensure conceptual clarity.
            </motion.p>
            <motion.ul 
              className="space-y-4 mb-10"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {["Conceptual Learning", "Expert Faculty", "Digital Classrooms", "Regular Assessments"].map((item, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-center gap-3"
                  variants={staggerItem}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-brand-red"
                    whileHover={{ scale: 1.3, rotate: 90 }}
                    transition={springBouncy}
                  >
                    <ChevronRight size={16} strokeWidth={3} />
                  </motion.div>
                  <span className="font-semibold">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            initial={{ opacity: 0, x: 60, rotateY: -5 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springFloaty}
          >
            <h4 className="text-2xl font-bold mb-8 text-center">Co-Curricular Activities</h4>
            <motion.div 
              className="grid grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {activities.map((act, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex flex-col items-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover-lift"
                  variants={staggerItem}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={springBouncy}
                >
                  <motion.div 
                    className="text-brand-yellow mb-4 scale-150"
                    animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4 + idx, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {act.icon}
                  </motion.div>
                  <span className="font-bold">{act.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const NoticeBoard = () => {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsub = onSnapshot(collection(db, "notices"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotices(items);
    });
    return unsub;
  }, []);

  if (notices.length === 0) return null;

  return (
    <section className="py-12 bg-brand-orange relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md shadow-lg border border-white/30 whitespace-nowrap">
          <Megaphone className="text-white animate-bounce" />
          <span className="text-white font-black uppercase tracking-tighter text-xl">Updates</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative group">
          <motion.div 
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {/* Double the notices for smooth infinite loop */}
            {[...notices, ...notices, ...notices].map((notice, idx) => (
              <div key={idx} className="flex items-center gap-4 text-white font-semibold text-lg">
                <div className="w-2 h-2 bg-brand-yellow rounded-full" />
                {notice.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);

  const fallbackImages: { url: string; title: string; category: string; youtubeUrl?: string }[] = [
    { url: "/festival-1.jpg", title: "Festival Celebration", category: "Events" },
    { url: "/science-fair.jpg", title: "Science Fair", category: "Activities" },
    { url: "/sports-meet.jpg", title: "Sports Meet", category: "Sports" },
    { url: "/library.jpg", title: "Library Session", category: "Academic" },
    { url: "/yoga-day.jpg", title: "Yoga Day", category: "Sports" },
    { url: "/school-assembly.jpg", title: "School Assembly", category: "Events" },
    { url: "/festival-2.jpg", title: "Festival Celebration", category: "Events" },
    { url: "/hero-bg.jpg", title: "Our Campus", category: "Campus" },
  ];

  const [firebaseImages, setFirebaseImages] = useState<{ url: string; title: string; category: string; youtubeUrl?: string }[]>([]);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsub = onSnapshot(collection(db, "gallery"), (snap) => {
      const items = snap.docs.map((d) => d.data() as { url: string; title: string; category: string; youtubeUrl?: string });
      setFirebaseImages(items);
    }, (error) => {
      console.error("Firebase fetch error:", error);
    });
    return unsub;
  }, []);

  const images = firebaseImages.length > 0 ? firebaseImages : fallbackImages;

  // Group images into albums
  const albums = useMemo(() => {
    const grouped = images.reduce<{ [key: string]: typeof images }>((acc, img) => {
      if (!acc[img.category]) acc[img.category] = [];
      acc[img.category].push(img);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      coverImage: items[0].url,
      items
    }));
  }, [images]);

  return (
    <section id="gallery" className="py-24 bg-brand-brown-red text-white overflow-hidden relative">
      <FloatingOrbs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springFloaty}
        >
          <h2 className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-2">Moments</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">School Gallery</h3>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Capturing the vibrant life, achievements, and activities of our students.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {albums.map((album, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -12, scale: 1.03 }}
              transition={springBouncy}
              onClick={() => setActiveAlbum(album.category)}
              className="group relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] cursor-pointer hover-lift"
            >
              <img
                src={getDriveThumbnailUrl(album.coverImage)}
                alt={album.category}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/90 via-brand-burgundy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col justify-end p-8">
                <motion.div 
                  className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out"
                >
                  <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2 inline-block px-2 py-0.5 bg-white/10 rounded backdrop-blur-md shadow-sm">
                    {album.items.length} Items
                  </span>
                  <h4 className="text-white font-bold text-2xl leading-tight drop-shadow-lg">{album.category}</h4>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Album Modal */}
      {activeAlbum && (
        <div className="fixed inset-0 z-[100] bg-brand-burgundy/95 backdrop-blur-xl overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col min-h-screen">
            <button 
              onClick={() => setActiveAlbum(null)} 
              className="mb-8 self-start text-brand-orange hover:text-white flex items-center gap-2 font-bold transition-colors"
            >
              <ArrowLeft /> Back to Albums
            </button>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 flex items-center gap-4">
              <span className="bg-brand-orange text-white px-4 py-1 rounded-xl text-lg uppercase tracking-widest font-black shadow-lg">Album</span>
              {activeAlbum}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {albums.find(a => a.category === activeAlbum)?.items.map((item, idx) => {
                const CardWrapper = item.youtubeUrl ? motion.a : motion.div;
                const wrapperProps = item.youtubeUrl ? { href: item.youtubeUrl, target: "_blank", rel: "noopener noreferrer" } : {};
                return (
                  <CardWrapper 
                    key={idx} 
                    {...wrapperProps} 
                    className="group relative block rounded-3xl overflow-hidden shadow-2xl xl:aspect-[4/3] aspect-[4/3] hover-lift cursor-pointer"
                  >
                    <img 
                      src={getDriveThumbnailUrl(item.url)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 transition-colors duration-500 group-hover:from-black/90"></div>
                    {item.youtubeUrl && (
                      <>
                        <motion.div 
                          className="absolute top-4 right-4 bg-red-600/90 p-3 rounded-full text-white shadow-xl z-20"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Youtube size={24} fill="currentColor" />
                        </motion.div>
                        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                          <div className="flex flex-col items-center gap-2">
                            <PlayCircle size={60} className="text-white drop-shadow-2xl" />
                            <span className="text-white font-bold text-lg tracking-wider uppercase">Watch Video</span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-6 left-6 text-white z-20">
                      <h5 className="text-xl font-bold">{item.title}</h5>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
            
            {!albums.find(a => a.category === activeAlbum)?.items?.length && (
               <p className="text-white/50 text-center py-20">No media found in this album.</p>
            )}
            
          </div>
        </div>
      )}
    </section>
  );
};

const Contact = () => {
  const content = useSiteContent();

  return (
    <section id="admissions" className="pt-24 pb-12 bg-brand-burgundy text-white overflow-hidden">
      <FloatingOrbs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springFloaty}
          >
            <motion.h3 
              className="text-4xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: 0.1 }}
            >
              Admissions & Contact
            </motion.h3>
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="p-6 bg-white/5 rounded-2xl shadow-sm border border-white/10 hover-lift"
                variants={staggerItem}
                whileHover={{ x: 8 }}
                transition={springBouncy}
              >
                <h4 className="text-brand-yellow font-bold mb-3">Phone Number</h4>
                <div className="flex flex-wrap gap-4">
                  <motion.a 
                    href={`tel:${content.contact?.phone || ""}`}
                    className="flex items-center gap-2 text-white/80 hover:text-brand-orange font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={springSnappy}
                  >
                    <Phone size={18} className="text-brand-orange" />
                    {content.contact?.phone || "+91 96767 65185"}
                  </motion.a>
                </div>
              </motion.div>

              <motion.div 
                className="p-6 bg-white/5 rounded-2xl shadow-sm border border-white/10 hover-lift"
                variants={staggerItem}
                whileHover={{ x: 8 }}
                transition={springBouncy}
              >
                <h4 className="text-brand-yellow font-bold mb-3">Email Address</h4>
                <div className="flex flex-wrap gap-4">
                  <motion.a 
                    href={`mailto:${content.contact?.email || ""}`}
                    className="flex items-center gap-2 text-white/80 hover:text-brand-orange font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={springSnappy}
                  >
                    <Mail size={18} className="text-brand-orange" />
                    {content.contact?.email || "info@dnremschool.com"}
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-10 p-8 bg-brand-orange rounded-3xl text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springFloaty, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="mt-1 flex-shrink-0" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Our Location</h4>
                  <p className="text-white/90 whitespace-pre-line">
                    {content.contact?.address || "D.N.R. College Association, Bhimavaram, AP - 534202"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="rounded-3xl overflow-hidden shadow-xl h-[500px] lg:h-auto min-h-[400px]"
            initial={{ opacity: 0, x: 60, rotateY: -5 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springFloaty}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.237618055655!2d81.522222!3d16.544444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37d2a5a5a5a5a5%3A0x5a5a5a5a5a5a5a5a!2sDNR%20College%20Association!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none group-hover:pointer-events-auto"
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <motion.footer 
      className="bg-black/40 text-white py-16 border-t border-white/5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={staggerItem}>
            <div className="flex items-center gap-3 mb-6">
              <motion.img 
                src="/logo.png" 
                alt="DNR School Logo"
                className="w-12 h-12 rounded-full object-cover shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <h4 className="text-2xl font-bold tracking-tighter">
                <span className="text-brand-red">D.N.R</span> E.M. School
              </h4>
            </div>
            <p className="text-gray-400 italic mb-6">
              "Truth our Quest - Service our Aim."
            </p>
            <div className="flex gap-4">
              <motion.a 
                href="https://youtube.com/@dnr-d1n" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-all"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                transition={springBouncy}
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div variants={staggerItem}>
            <h5 className="font-bold text-lg mb-6">Quick Links</h5>
            <ul className="space-y-4 text-gray-400">
              {[
                { name: "Home", href: "#home" },
                { name: "About Us", href: "#about" },
                { name: "Atal Lab", href: "#atal" },
                { name: "Admissions", href: "#admissions" },
              ].map((link) => (
                <li key={link.name}>
                  <motion.a 
                    href={link.href} 
                    className="hover:text-white transition-colors inline-block"
                    whileHover={{ x: 5 }}
                    transition={springSnappy}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h5 className="font-bold text-lg mb-6">Accreditation</h5>
            <motion.div 
              className="p-6 bg-white/5 rounded-2xl border border-white/10"
              whileHover={{ scale: 1.03 }}
              transition={springGentle}
            >
              <p className="text-brand-yellow font-bold text-xl mb-2">Affiliated to CBSE</p>
              <p className="text-sm text-gray-400">Providing quality education following national standards.</p>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p>© {new Date().getFullYear()} D.N.R English Medium School. All Rights Reserved.</p>
          <motion.a
            href="/admin"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-brand-yellow hover:border-brand-yellow/30 transition-all font-medium tracking-wide text-xs uppercase"
          >
            Admin / Staff Login
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

const ChatBot = () => {
  return (
    <motion.div 
      className="fixed bottom-8 left-8 z-[60]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, ...springBouncy }}
    >
      <motion.a
        href="https://wa.me/919676765185"
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl relative group"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={32} />
        <div className="absolute left-20 bg-white text-brand-burgundy px-4 py-2 rounded-xl text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          How can we help? Chat now!
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white" />
        </div>
        <motion.div 
          className="absolute inset-0 bg-green-500 rounded-full -z-10"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.a>
    </motion.div>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Global Scroll Lock for Modals
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutUs />
      <Achievements />
      <NoticeBoard />
      <Academics />
      <Gallery />
      <LabsFacilities onModalToggle={setIsModalOpen} />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
}
