# Agnonix — 3D AI Portfolio Experience ✨

> An immersive, cinematic 3D portfolio showcasing AI/SaaS projects in interactive 3D space  
> Built with React, Three.js, and Framer Motion

[**Live Demo**](#) | [GitHub](https://github.com/thecrypticcontroller/agnonix) | [Portfolio](https://devesh-portfolio.vercel.app)

---

## 🌌 What It Does

**Agnonix** is a next-gen portfolio experience that replaces the traditional flat resume/portfolio site with an **immersive 3D environment**.

**Instead of:**
- ❌ Scrolling through a boring portfolio website
- ❌ Reading static text about projects
- ❌ Clicking through tabs to see work

**You get:**
- ✅ Navigate projects in **3D space** with cinematic transitions
- ✅ Explore skills, experience, and achievements interactively
- ✅ Smooth animations and professional motion design
- ✅ Works beautifully on desktop, tablet, and mobile
- ✅ **Fast** — optimized Three.js rendering

---

## ✨ Features

- 🌌 **3D Environment** — Explore projects in immersive 3D space
- ⚡ **Smooth Animations** — Framer Motion + React Three Fiber
- 🎬 **Cinematic Transitions** — Professional motion graphics
- 📱 **Responsive Design** — Works on all devices
- 🎯 **Interactive Elements** — Click, hover, and explore
- ⚡ **Optimized Performance** — Code-split Three.js for fast loads

---

## 🛠️ Tech Stack

```
Frontend Framework: React 18.3.1
3D Graphics: Three.js 0.169.0
React 3D: @react-three/fiber 8.17.10
3D Components: @react-three/drei 9.114.3
Motion Design: Framer Motion 11.11.17
Build Tool: Vite 5.4.21
Language: TypeScript 5.6.3
Styling: Custom CSS + Framer Motion
```

---

## 🚀 Quick Start

### **Option A: View Live Demo**
Visit the live Agnonix experience: [coming soon]

### **Option B: Run Locally**

```bash
# Clone the repo
git clone https://github.com/thecrypticcontroller/agnonix
cd agnonix

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Visit http://localhost:5173
```

### **Build for Production**

```bash
npm run build
# or
pnpm build

# Output in dist/ directory
```

---

## 📂 Project Structure

```
agnonix/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main app component
│   ├── styles.css        # Global styles
│   ├── components/
│   │   ├── Scene.tsx     # 3D scene setup
│   │   ├── TopBar.tsx    # Navigation bar
│   │   └── SectionLabel.tsx
│   └── data/
│       └── profile.ts    # Project/skill data
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

---

## 🎨 Customization

### **Update Your Profile**
Edit `src/data/profile.ts` to customize:
- Your name and title
- Projects (name, description, links)
- Skills and technologies
- Social links

### **Styling**
- Global styles in `src/styles.css`
- Component styles via Framer Motion
- Three.js material customization in `Scene.tsx`

### **3D Scene**
The 3D environment is configured in `src/components/Scene.tsx`. Modify:
- Camera position and FOV
- Lighting setup
- Scene background
- Object positions and rotations

---

## 📦 Performance

**Optimized for speed:**
- Code splitting: Three.js, React Three Fiber, and Drei are bundled separately
- Lazy loading: Assets load on demand
- Canvas optimization: Efficient Three.js rendering pipeline
- Mobile-optimized: Responsive canvas sizing

**Typical load time:** < 3 seconds on modern devices

---

## 🌐 Deploy to Vercel

### **One-Click Deploy:**

```bash
npm install -g vercel
vercel --prod
```

### **Manual Deployment:**
1. Push code to GitHub
2. Connect repo to Vercel
3. Vercel auto-detects Vite configuration
4. Deploy on every push

---

## 🎯 Use Cases

- **Personal Portfolio** — Stand out with an interactive experience
- **Freelancer Showcase** — Impress potential clients
- **Agency Website** — Showcase team and projects
- **Resume Alternative** — Modern way to present your work

---

## 📧 Contact & Support

- **Questions?** Open an issue on GitHub
- **Want to hire?** Check out the main portfolio: [devesh-portfolio.vercel.app](https://devesh-portfolio.vercel.app)

---

## 📄 License

MIT License — See LICENSE file for details.

---

**Built with ❤️ using React, Three.js, and Vite**
