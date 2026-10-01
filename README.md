# Ami RaiAn - Full Stack Developer Portfolio

A modern, responsive portfolio website showcasing the work and skills of Ami RaiAn, a passionate Full Stack Developer specializing in modern web technologies.

## 🌟 Features

- **Modern Design**: Clean, professional UI with smooth animations and transitions
- **Fully Responsive**: Optimized for all devices (desktop, tablet, mobile)
- **Interactive Components**: Dynamic text sphere, animated banner, and engaging user interface
- **Contact Integration**: Built-in contact form with EmailJS integration
- **Performance Optimized**: Built with Next.js 15 and optimized for fast loading
- **SEO Ready**: Comprehensive metadata and SEO optimization
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA labels

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### UI Components & Libraries

- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Icons** - Additional icon sets
- **TagCloud** - Interactive 3D tag cloud
- **Class Variance Authority** - Component styling utilities

### Tools & Build

- **Turbopack** - Ultra-fast bundler for development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **EmailJS** - Contact form email handling

## 📁 Project Structure

```
ami-raian-portfolio/
├── app/                      # Next.js App Router
│   ├── components/           # Reusable components
│   │   ├── AboutDevelopment.tsx
│   │   ├── AboutMe.tsx
│   │   ├── Banner.tsx
│   │   ├── DevStory.tsx
│   │   ├── Header.tsx
│   │   ├── TextSphere.tsx
│   │   └── ui/              # UI component library
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── lib/                 # Utility functions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx            # Home page
├── public/                  # Static assets
│   └── assets/
│       ├── images/         # Background images
│       ├── logo/           # Logo assets
│       ├── myPics/         # Personal photos
│       └── projectImage/   # Project screenshots
├── tailwind.config.js      # Tailwind configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Key Components

### Header

- Transparent navigation with scroll effects
- Responsive design with mobile menu
- Smooth animations with Framer Motion

### Banner

- Parallax scrolling effects
- Personal introduction with animated text
- Dynamic background layers

### About Sections

- **AboutMe**: Personal introduction and skills
- **AboutDevelopment**: Technical expertise showcase
- **DevStory**: Development journey and experience

### Interactive Elements

- **TextSphere**: 3D rotating tag cloud of technologies
- **Contact Form**: Integrated with EmailJS for direct communication

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ami-raian-portfolio.git
   cd ami-raian-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file for EmailJS configuration:

   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎯 Pages & Sections

### Home Page (`/`)

- Hero banner with personal introduction
- About me section
- Interactive technology sphere
- Development expertise showcase
- Developer story timeline

### About Page (`/about`)

- Detailed personal background
- Skills and expertise
- Professional journey
- Technical proficiencies

### Contact Page (`/contact`)

- Contact information
- Interactive contact form
- Social media links
- Professional networking

## 🎨 Customization

### Colors & Styling

The project uses a custom color scheme defined in Tailwind CSS:

- Primary: `#359381` (Teal)
- Secondary: `#003329` (Dark Green)
- Background: Various gray tones

### Fonts

- **Geist Sans** - Primary font family
- **Geist Mono** - Monospace for code/technical text

### Animations

Framer Motion provides smooth animations:

- Page transitions
- Component entrance effects
- Interactive hover states
- Scroll-triggered animations

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration Files

### Next.js Configuration (`next.config.ts`)

- Turbopack enabled for faster builds
- Image optimization settings
- Custom webpack configurations

### TypeScript Configuration (`tsconfig.json`)

- Strict type checking enabled
- Path aliases configured (`@/` → `app/`)
- Latest ECMAScript features

### Tailwind Configuration (`tailwind.config.js`)

- Custom color palette
- Extended spacing and typography
- Animation utilities
- Component-specific styles

## 📈 Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components and images loaded on demand
- **Caching**: Optimal caching strategies
- **Bundle Analysis**: Optimized bundle sizes

## 🌐 SEO & Meta

- Complete meta tag setup
- Open Graph integration
- Twitter Card support
- Structured data markup
- XML sitemap generation
- Robots.txt configuration

## 📞 Contact & Links

- **Website**: [amiraian.com](https://amiraian.com)
- **Email**: Contact form on website
- **Portfolio**: Full project showcase available

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal portfolio, feedback and suggestions are welcome! Feel free to:

- Report bugs
- Suggest improvements
- Share your thoughts on the design

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For beautiful animations
- **All Open Source Contributors** - For the incredible tools and libraries

---

**Built with ❤️ by Ami RaiAn**

_Last updated: 2024_
