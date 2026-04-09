import { motion, useScroll, useTransform } from "motion/react";
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
  Mail
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  hero: { title: "The Best Education", subtitle: "For Your Child", announcement: "ADMISSIONS OPEN 2026-2027" },
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

// ─── Spring Physics Presets ──────────────────────────────────────────────
const springBouncy = { type: "spring" as const, stiffness: 100, damping: 15, mass: 1 };
const springGentle = { type: "spring" as const, stiffness: 60, damping: 20, mass: 1.5 };
const springFloaty = { type: "spring" as const, stiffness: 40, damping: 25, mass: 2 };
const springSnappy = { type: "spring" as const, stiffness: 150, damping: 20, mass: 1 };

// ─── Floating Orbs Background ────────────────────────────────────────────
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="orb orb-orange w-72 h-72 -top-20 -right-20 animate-float-slow" />
    <div className="orb orb-yellow w-48 h-48 top-1/3 -left-10 animate-drift" style={{ animationDelay: "2s" }} />
    <div className="orb orb-red w-56 h-56 bottom-10 right-1/4 animate-float-reverse" style={{ animationDelay: "4s" }} />
    <div className="orb orb-orange w-32 h-32 top-1/2 right-10 animate-float" style={{ animationDelay: "1s" }} />
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
    { name: "Atal Lab", href: "#atal" },
    { name: "Admissions", href: "#admissions" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={springBouncy}
      className={`fixed w-full z-50 backdrop-blur-md shadow-lg border-b border-white/10 transition-all duration-500 ${
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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img 
          src="/hero-bg.jpg" 
          alt="DNR School Campus"
          className="w-full h-full object-cover scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
      </motion.div>

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
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springFloaty}
          className="max-w-2xl"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1 bg-brand-yellow text-brand-red font-bold rounded-full text-sm mb-6 shadow-md"
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ ...springBouncy, delay: 0.3 }}
          >
            <Sparkles size={14} />
            {content.hero?.announcement || "ADMISSIONS OPEN 2026-2027"}
          </motion.span>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springFloaty, delay: 0.5 }}
          >
            {content.hero?.title || "The Best Education"} <br />
            <motion.span 
              className="text-brand-orange text-shadow-sm inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springBouncy, delay: 0.8 }}
            >
              {content.hero?.subtitle || "For Your Child"}
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 1 }}
          >
            Empowering young minds through innovation, academic excellence, and holistic development since 1985.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 1.2 }}
          >
            <motion.a
              href="tel:+919676765185"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={springBouncy}
              className="animate-pulse-orange bg-brand-orange text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
            >
              Register Now: +91 96767 65185
            </motion.a>
            <motion.a
              href="#atal"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={springBouncy}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              Explore ATL Lab
            </motion.a>
          </motion.div>
        </motion.div>
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

const AtalLab = () => {
  const categories = [
    { icon: <Cpu className="text-brand-orange" />, title: "Electronics & Robotics", desc: "Building the future with smart machines." },
    { icon: <Printer className="text-brand-orange" />, title: "3D Printing", desc: "Turning digital designs into physical reality." },
    { icon: <Wifi className="text-brand-orange" />, title: "IoT (Internet of Things)", desc: "Connecting the world through smart devices." },
    { icon: <Lightbulb className="text-brand-orange" />, title: "Design Thinking", desc: "Solving real-world problems creatively." },
  ];

  const fallbackProjects = [
    { title: "Smart Bell System", image: "/atl-project-1.jpg", tag: "Automation" },
    { title: "Rain Detection Project", image: "/atl-project-2.jpg", tag: "Sensors" },
    { title: "Solar Tracker", image: "/atl-project-3.jpg", tag: "Renewable" },
    { title: "IoT Innovation", image: "/atl-project-4.jpg", tag: "IoT" },
  ];

  const [firebaseProjects, setFirebaseProjects] = useState<{ image: string; title: string; tag: string; youtubeUrl?: string }[]>([]);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      const items = snap.docs.map((d) => d.data() as { image: string; title: string; tag: string; youtubeUrl?: string });
      setFirebaseProjects(items);
    }, (error) => {
      console.error("Firebase fetch error:", error);
    });
    return unsub;
  }, []);

  const projects = firebaseProjects.length > 0 ? firebaseProjects : fallbackProjects;

  return (
    <section id="atal" className="py-24 bg-brand-brown-red text-white overflow-hidden">
      <FloatingOrbs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springFloaty}
        >
          <motion.h2 
            className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springBouncy, delay: 0.1 }}
          >
            Innovation Hub
          </motion.h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Atal Tinkering Lab (ATL)</h3>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            A workspace where young minds can give shape to their ideas through hands-on do-it-yourself mode and learn innovation skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black/20"
            initial={{ opacity: 0, x: -60, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={springFloaty}
          >
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/XbWxZfjop3o" 
              title="ATL Projects"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={springBouncy}
                className="p-6 bg-brand-burgundy/50 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-all hover-lift"
              >
                <motion.div 
                  className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shadow-sm mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3 + idx * 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cat.icon}
                </motion.div>
                <h4 className="font-bold text-lg mb-2 text-brand-yellow">{cat.title}</h4>
                <p className="text-sm text-white/60">{cat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mb-12">
          <motion.h4 
            className="text-2xl font-bold mb-8 flex items-center gap-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={springGentle}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy className="text-brand-orange" />
            </motion.span>
            Project Showcase
          </motion.h4>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {projects.map((project: any, idx: number) => {
              const CardWrapper = project.youtubeUrl ? motion.a : motion.div;
              const wrapperProps = project.youtubeUrl ? { href: project.youtubeUrl, target: "_blank", rel: "noopener noreferrer" } : {};
              
              return (
              <CardWrapper 
                key={idx}
                {...wrapperProps}
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={springBouncy}
                className="group relative block rounded-3xl overflow-hidden shadow-lg h-64 hover-lift"
              >
                <img 
                  src={getDriveThumbnailUrl(project.image)} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 transition-colors duration-500 group-hover:from-black/90"></div>
                
                {project.youtubeUrl && (
                  <div className="absolute top-4 right-4 bg-red-600/90 p-3 rounded-full text-white shadow-xl z-20 transition-transform duration-500 hover:scale-125">
                    <Youtube size={24} fill="currentColor" />
                  </div>
                )}

                <div className="absolute bottom-6 left-6 text-white z-20">
                  <span className="text-xs font-bold bg-brand-orange px-2 py-1 rounded mb-2 inline-block">
                    {project.tag}
                  </span>
                  <h5 className="text-xl font-bold">{project.title}</h5>
                </div>
              </CardWrapper>
            )})}
          </motion.div>
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
            transition={springFloaty}
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
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
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

const Gallery = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  const fallbackImages = [
    { url: "/festival-1.jpg", title: "Festival Celebration", category: "Events" },
    { url: "/science-fair.jpg", title: "Science Fair", category: "Activities" },
    { url: "/sports-meet.jpg", title: "Sports Meet", category: "Sports" },
    { url: "/library.jpg", title: "Library Session", category: "Academic" },
    { url: "/yoga-day.jpg", title: "Yoga Day", category: "Sports" },
    { url: "/school-assembly.jpg", title: "School Assembly", category: "Events" },
    { url: "/festival-2.jpg", title: "Festival Celebration", category: "Events" },
    { url: "/hero-bg.jpg", title: "Our Campus", category: "Campus" },
  ];

  const [firebaseImages, setFirebaseImages] = useState<{ url: string; title: string; category: string }[]>([]);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsub = onSnapshot(collection(db, "gallery"), (snap) => {
      const items = snap.docs.map((d) => d.data() as { url: string; title: string; category: string });
      setFirebaseImages(items);
    }, (error) => {
      console.error("Firebase fetch error:", error);
    });
    return unsub;
  }, []);

  const images = firebaseImages.length > 0 ? firebaseImages : fallbackImages;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, images.length));
  };

  return (
    <section id="gallery" className="py-24 bg-brand-brown-red text-white overflow-hidden">
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
          {images.slice(0, visibleCount).map((img, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -12, scale: 1.03 }}
              transition={springBouncy}
              className="group relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] cursor-pointer hover-lift"
            >
              <img
                src={getDriveThumbnailUrl(img.url)}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/90 via-brand-burgundy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col justify-end p-8">
                <motion.div 
                  className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out"
                >
                  <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2 inline-block px-2 py-0.5 bg-white/10 rounded backdrop-blur-md">
                    {img.category}
                  </span>
                  <h4 className="text-white font-bold text-2xl leading-tight drop-shadow-lg">{img.title}</h4>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {visibleCount < images.length && (
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springGentle}
          >
            <motion.button
              onClick={loadMore}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={springBouncy}
              className="px-8 py-3 bg-brand-orange text-white rounded-full font-bold hover:bg-brand-yellow hover:text-brand-burgundy transition-all shadow-lg"
            >
              Load More Photos
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const Contact = () => {
  const content = useSiteContent();

  return (
    <section id="admissions" className="py-24 bg-brand-burgundy text-white overflow-hidden">
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
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
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

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutUs />
      <Academics />
      <Gallery />
      <AtalLab />
      <Contact />
      <Footer />
    </div>
  );
}
