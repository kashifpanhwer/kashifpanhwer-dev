/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Mail, 
  Phone, 
  Rocket, 
  User, 
  ExternalLink, 
  ChevronUp,
  BrainCircuit,
  Lightbulb,
  TrendingUp,
  Layout,
  Terminal,
  Database,
  Layers
} from 'lucide-react';

// --- Components ---

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-neon-blue pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(0, 210, 255, 0.3)' : 'transparent'
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
    />
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/10' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          className="text-2xl font-display font-bold tracking-tighter text-neon-blue"
          whileHover={{ scale: 1.05 }}
        >
          KP<span className="text-white">.</span>
        </motion.div>
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium uppercase tracking-widest hover:text-neon-blue transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
            </a>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full border border-neon-blue text-neon-blue text-xs font-bold uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-all"
        >
          Hire Me
        </motion.button>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const [text, setText] = useState('');
  const roles = ['Content Creator', 'Coder'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        setText(currentRole.substring(0, text.length - 1));
        setSpeed(50);
      } else {
        setText(currentRole.substring(0, text.length + 1));
        setSpeed(150);
      }

      if (!isDeleting && text === currentRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, speed]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-block px-4 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-xs font-bold uppercase tracking-widest mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Available for Projects
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-tight mb-6">
            I'm <span className="text-neon-blue neon-text">Kashif</span>
            <br />
            Panhwer
          </h1>
          <div className="text-2xl md:text-3xl font-light text-white/70 mb-8 h-10">
            A <span className="text-white font-bold border-r-2 border-neon-blue pr-2">{text}</span>
          </div>
          <p className="text-lg text-white/50 max-w-lg mb-10 leading-relaxed">
            Building Digital Future through innovative code and creative storytelling. 
            Crafting premium experiences that push the boundaries of the web.
          </p>
          <div className="flex gap-6">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-neon-blue text-black font-bold rounded-xl flex items-center gap-2 group"
            >
              Contact Me
              <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 font-bold rounded-xl flex items-center gap-2"
            >
              View Work
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Animated Rings */}
            <motion.div 
              className="absolute inset-0 border-2 border-neon-blue/30 rounded-full"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute -inset-4 border border-neon-cyan/20 rounded-full"
              animate={{ rotate: -360, scale: [1, 1.05, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-neon-blue neon-border">
              <img 
                src="https://i.supaimg.com/e6ff10c6-9000-4221-9f72-14bebe0f89c8/41c1593f-0617-4717-9d74-c785e07c7829.jpg" 
                alt="Kashif Panhwer" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Badges */}
            <motion.div 
              className="absolute -top-4 -right-4 glass p-4 rounded-2xl flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-10 h-10 bg-neon-blue/20 rounded-lg flex items-center justify-center">
                <Code2 className="text-neon-blue w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase font-bold">Experience</div>
                <div className="text-sm font-bold">Modern Coder</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -left-4 glass p-4 rounded-2xl flex items-center gap-3"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="w-10 h-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                <Cpu className="text-neon-cyan w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase font-bold">Focus</div>
                <div className="text-sm font-bold">AI & Web</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  const info = [
    { label: 'Full Name', value: 'Kashif Panhwer', icon: User },
    { label: 'Age', value: '16', icon: Rocket },
    { label: 'Profession', value: 'Content Creator & Coder', icon: Code2 },
    { label: 'Location', value: 'Mirpur Khas, Pakistan', icon: Globe },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            About <span className="text-neon-blue">Me</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-neon-blue/10 transition-colors" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold mb-6 text-neon-blue">Personal Information</h3>
              <div className="space-y-6">
                {info.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-neon-blue/30 transition-all hover:translate-x-2"
                  >
                    <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                      <item.icon className="text-neon-blue w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase font-bold tracking-widest">{item.label}</div>
                      <div className="text-lg font-medium">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-bold mb-6 text-neon-blue">My Story</h3>
              <p className="text-white/60 leading-relaxed text-lg">
                I am a passionate 16-year-old developer and content creator from Pakistan. 
                My journey in the digital world started with a curiosity for how things work 
                behind the screen. Today, I blend technical coding skills with creative content 
                creation to build unique digital experiences.
              </p>
              <p className="text-white/60 leading-relaxed text-lg">
                I believe that the future belongs to those who can bridge the gap between 
                technology and human connection. Whether it's through a lines of code or 
                a compelling video, my goal is to inspire and innovate.
              </p>
              <div className="pt-6 flex gap-4">
                <div className="px-6 py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue font-bold">
                  10+ Projects
                </div>
                <div className="px-6 py-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan font-bold">
                  Creative Mind
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skills = [
    { name: 'AI Development', level: 40, icon: BrainCircuit, color: 'from-neon-blue to-blue-600' },
    { name: 'Web Development', level: 85, icon: Globe, color: 'from-neon-cyan to-cyan-600' },
    { name: 'Software Development', level: 75, icon: Terminal, color: 'from-blue-500 to-indigo-600' },
    { name: 'Creative Thinking', level: 95, icon: Lightbulb, color: 'from-purple-500 to-neon-blue' },
  ];

  return (
    <section id="skills" className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Technical <span className="text-neon-blue">Arsenal</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl hover:border-neon-blue/50 transition-all group"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon-blue/10 transition-colors">
                    <skill.icon className="text-neon-blue w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{skill.name}</h3>
                </div>
                <span className="text-neon-blue font-display font-bold">{skill.level}%</span>
              </div>
              
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`h-full bg-gradient-to-r ${skill.color} relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              {skill.name === 'AI Development' && (
                <div className="mt-4 text-xs text-white/40 font-bold uppercase tracking-widest">Beginner Level</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Interests = () => {
  const interests = [
    { title: 'Technology Innovation', icon: Cpu, desc: 'Exploring the latest breakthroughs in tech architecture and hardware.' },
    { title: 'AI Tools & Development', icon: BrainCircuit, desc: 'Building and utilizing AI models to solve complex real-world problems.' },
    { title: 'Digital Growth', icon: TrendingUp, desc: 'Scaling digital presence and optimizing for maximum impact and reach.' },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Core <span className="text-neon-blue">Interests</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {interests.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl border-t-4 border-t-neon-blue/50 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="text-neon-blue w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-neon-blue font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <Rocket className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', title: 'Code Architecture', cat: 'Software' },
    { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', title: 'Web Interface', cat: 'Web' },
    { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', title: 'Cyber Security', cat: 'Security' },
    { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', title: 'AI Neural Network', cat: 'AI' },
    { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', title: 'Modern Workspace', cat: 'Creative' },
    { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800', title: 'Future Tech', cat: 'Innovation' },
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', title: 'Hardware Systems', cat: 'Hardware' },
    { url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800', title: 'Data Analytics', cat: 'Data' },
    { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800', title: 'Team Collaboration', cat: 'Management' },
    { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', title: 'Digital Matrix', cat: 'Coding' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', title: 'Global Network', cat: 'Web' },
    { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', title: 'Robotics AI', cat: 'AI' },
  ];

  return (
    <section id="portfolio" className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Creative <span className="text-neon-blue">Gallery</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <div className="text-xs text-neon-blue font-bold uppercase tracking-widest mb-1">{img.cat}</div>
                <div className="text-lg font-bold mb-4">{img.title}</div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  View Project <ExternalLink className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-blue/50 transition-colors rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Quote = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-neon-blue/5 blur-[100px] rounded-full scale-150 translate-y-1/2" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-neon-blue mb-8 flex justify-center">
            <Layers className="w-12 h-12 animate-bounce" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight italic text-white/90 neon-text">
            “Success is not just what you accomplish in your life, it’s about what you inspire others to do.”
          </h2>
          <div className="mt-12 w-24 h-1 bg-neon-blue mx-auto rounded-full" />
          <div className="mt-6 font-display text-neon-blue font-bold tracking-widest uppercase">Kashif Panhwer</div>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Get In <span className="text-neon-blue">Touch</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-display font-bold mb-6">Let's build something <span className="text-neon-blue">extraordinary</span> together.</h3>
            <p className="text-white/50 text-lg mb-10 leading-relaxed">
              I'm always open to new opportunities, collaborations, or just a friendly chat about technology and creativity.
            </p>
            
            <div className="space-y-6">
              <motion.a
                href="tel:923162563671"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 p-6 glass rounded-2xl group"
              >
                <div className="w-14 h-14 rounded-xl bg-neon-blue/10 flex items-center justify-center group-hover:bg-neon-blue group-hover:text-black transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">Call Me</div>
                  <div className="text-xl font-bold">+92 316 2563671</div>
                </div>
              </motion.a>

              <motion.a
                href="mailto:panhwer11786@gmail.com"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 p-6 glass rounded-2xl group"
              >
                <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan group-hover:text-black transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">Email Me</div>
                  <div className="text-xl font-bold">panhwer11786@gmail.com</div>
                </div>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-3xl"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50">Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50">Subject</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none transition-colors" placeholder="Project Inquiry" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50">Message</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none transition-colors h-32 resize-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center gap-8">
        <div className="text-2xl font-display font-bold tracking-tighter text-neon-blue">
          KP<span className="text-white">.</span>
        </div>
        <div className="text-white/40 text-sm">
          © {new Date().getFullYear()} Kashif Panhwer. All rights reserved.
        </div>
        <div className="flex gap-6">
          {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map((social) => (
            <a key={social} href="#" className="text-white/40 hover:text-neon-blue transition-colors text-sm font-bold uppercase tracking-widest">
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-neon-blue z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-neon-blue text-black rounded-full flex items-center justify-center z-50 shadow-[0_0_20px_rgba(0,210,255,0.4)]"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="text-6xl font-display font-bold text-neon-blue mb-8"
      >
        KP<span className="text-white">.</span>
      </motion.div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-neon-blue"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-xs font-bold uppercase tracking-[0.5em] text-white/40"
      >
        Initializing Future
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative font-sans">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <div className="chrome-border" />
          <ScrollProgress />
          <ParticlesBackground />
          <CustomCursor />
          <Navbar />
          
          <main>
            <Hero />
            <About />
            <Skills />
            <Interests />
            <Portfolio />
            <Quote />
            <Contact />
          </main>

          <Footer />
          <BackToTop />
        </>
      )}
    </div>
  );
}
