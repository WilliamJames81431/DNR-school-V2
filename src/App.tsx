import { motion } from "motion/react";
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
  ChevronRight
} from "lucide-react";
import { useState } from "react";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Academics", href: "#academics" },
    { name: "Gallery", href: "#gallery" },
    { name: "Atal Lab", href: "#atal" },
    { name: "Admissions", href: "#admissions" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-brand-burgundy/90 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="DNR School Logo"
              className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-brand-orange/30"
            />
            <div className="flex flex-col">
              <span className="text-brand-orange font-bold text-xl leading-none tracking-tighter">D.N.R</span>
              <span className="text-white/80 font-semibold text-sm hidden sm:block">E.M. School</span>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-brand-orange px-2 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#admissions"
                className="bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-brand-yellow hover:text-brand-burgundy transition-all"
              >
                Enroll Now
              </a>
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-burgundy border-t border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-brand-orange block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.jpg" 
          alt="DNR School Campus"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1 bg-brand-yellow text-brand-red font-bold rounded-full text-sm mb-6">
            ADMISSIONS OPEN 2026-2027
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            The Best Education <br />
            <span className="text-brand-orange text-shadow-sm">For Your Child</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg">
            Empowering young minds through innovation, academic excellence, and holistic development since 1985.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="tel:+919676765185"
              className="animate-pulse-orange bg-brand-orange text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
            >
              Register Now: +91 96767 65185
            </motion.a>
            <a
              href="#atal"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              Explore ATL Lab
            </a>
          </div>
        </motion.div>
      </div>

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

  const projects = [
    { title: "Smart Bell System", image: "/atl-project-1.jpg", tag: "Automation" },
    { title: "Rain Detection Project", image: "/atl-project-2.jpg", tag: "Sensors" },
    { title: "Solar Tracker", image: "/atl-project-3.jpg", tag: "Renewable" },
    { title: "IoT Innovation", image: "/atl-project-4.jpg", tag: "IoT" },
  ];

  return (
    <section id="atal" className="py-24 bg-brand-brown-red text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-2">Innovation Hub</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Atal Tinkering Lab (ATL)</h3>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            A workspace where young minds can give shape to their ideas through hands-on do-it-yourself mode and learn innovation skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black/20">
            {/* ATL Lab Demo Video */}
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/XbWxZfjop3o" 
              title="ATL Projects"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 bg-brand-burgundy/50 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-all"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shadow-sm mb-4">
                  {cat.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-brand-yellow">{cat.title}</h4>
                <p className="text-sm text-white/60">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h4 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Trophy className="text-brand-orange" /> Project Showcase
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="group relative rounded-3xl overflow-hidden shadow-lg h-64"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-xs font-bold bg-brand-orange px-2 py-1 rounded mb-2 inline-block">
                    {project.tag}
                  </span>
                  <h5 className="text-xl font-bold">{project.title}</h5>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
      {/* Curved Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.23,103.19,115,100.27,171.55,91.36,235.38,81.3,281.39,63.88,321.39,56.44Z" fill="#4A0404"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-4">Academic Excellence</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              IIT-NEET Foundation <br /> Excellence Program
            </h3>
            <p className="text-white/80 text-lg mb-8">
              Our specialized curriculum focuses on building a strong foundation for competitive exams from an early age, combined with activity-based learning to ensure conceptual clarity.
            </p>
            <ul className="space-y-4 mb-10">
              {["Conceptual Learning", "Expert Faculty", "Digital Classrooms", "Regular Assessments"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-brand-red">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h4 className="text-2xl font-bold mb-8 text-center">Co-Curricular Activities</h4>
            <div className="grid grid-cols-2 gap-6">
              {activities.map((act, idx) => (
                <div key={idx} className="flex flex-col items-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                  <div className="text-brand-yellow mb-4 scale-150">
                    {act.icon}
                  </div>
                  <span className="font-bold">{act.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  
  const images = [
    { url: "/festival-1.jpg", title: "Festival Celebration", category: "Events" },
    { url: "/science-fair.jpg", title: "Science Fair", category: "Activities" },
    { url: "/sports-meet.jpg", title: "Sports Meet", category: "Sports" },
    { url: "/library.jpg", title: "Library Session", category: "Academic" },
    { url: "/yoga-day.jpg", title: "Yoga Day", category: "Sports" },
    { url: "/school-assembly.jpg", title: "School Assembly", category: "Events" },
    { url: "/festival-2.jpg", title: "Festival Celebration", category: "Events" },
    { url: "/hero-bg.jpg", title: "Our Campus", category: "Campus" },
  ];

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, images.length));
  };

  return (
    <section id="gallery" className="py-24 bg-brand-brown-red text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brand-yellow font-bold text-sm tracking-widest uppercase mb-2">Moments</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">School Gallery</h3>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Capturing the vibrant life, achievements, and activities of our students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.slice(0, visibleCount).map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/90 via-brand-burgundy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col justify-end p-8">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2 inline-block px-2 py-0.5 bg-white/10 rounded backdrop-blur-md">
                    {img.category}
                  </span>
                  <h4 className="text-white font-bold text-2xl leading-tight drop-shadow-lg">{img.title}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < images.length && (
          <div className="mt-16 text-center">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-brand-orange text-white rounded-full font-bold hover:bg-brand-yellow hover:text-brand-burgundy transition-all shadow-lg"
            >
              Load More Photos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Contact = () => {
  const contacts = [
    { label: "General Inquiry / Registration", numbers: ["9676765185", "7893040993"] },
    { label: "Grades 1-5", numbers: ["9849934173"] },
    { label: "Grades 6-10", numbers: ["8686666390"] },
    { label: "Nursery / LKG / UKG", numbers: ["9704957727"] },
  ];

  return (
    <section id="admissions" className="py-24 bg-brand-burgundy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-4xl font-bold mb-8">Admissions & Contact</h3>
            <div className="space-y-6">
              {contacts.map((c, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl shadow-sm border border-white/10">
                  <h4 className="text-brand-yellow font-bold mb-3">{c.label}</h4>
                  <div className="flex flex-wrap gap-4">
                    {c.numbers.map((num, idx) => (
                      <a 
                        key={idx} 
                        href={`tel:+91${num}`}
                        className="flex items-center gap-2 text-white/80 hover:text-brand-orange font-medium transition-colors"
                      >
                        <Phone size={18} className="text-brand-orange" />
                        +91 {num}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-8 bg-brand-orange rounded-3xl text-white">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-2">Our Location</h4>
                  <p className="text-white/90">
                    D.N.R. College Association, <br />
                    Bhimavaram, Andhra Pradesh - 534202
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl h-[500px] lg:h-auto min-h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.237618055655!2d81.522222!3d16.544444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37d2a5a5a5a5a5%3A0x5a5a5a5a5a5a5a5a!2sDNR%20College%20Association!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black/40 text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo.png" 
                alt="DNR School Logo"
                className="w-12 h-12 rounded-full object-cover shadow-lg"
              />
              <h4 className="text-2xl font-bold tracking-tighter">
                <span className="text-brand-red">D.N.R</span> E.M. School
              </h4>
            </div>
            <p className="text-gray-400 italic mb-6">
              "Truth our Quest - Service our Aim."
            </p>
            <div className="flex gap-4">
              <a 
                href="https://youtube.com/@dnr-d1n" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-all"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-6">Quick Links</h5>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#atal" className="hover:text-white transition-colors">Atal Lab</a></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">Admissions</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-lg mb-6">Accreditation</h5>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-brand-yellow font-bold text-xl mb-2">Affiliated to CBSE</p>
              <p className="text-sm text-gray-400">Providing quality education following national standards.</p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-white/30 text-sm">
          <p>© {new Date().getFullYear()} D.N.R English Medium School. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Academics />
      <Gallery />
      <AtalLab />
      <Contact />
      <Footer />
    </div>
  );
}
