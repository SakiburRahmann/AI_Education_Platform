# 🧠 Lubb AI — Learn with Understanding

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Lubb AI** (inspired by *Ulul Albab*) is a premium AI-powered education platform designed to move beyond rote memorization toward deep, conceptual understanding. By blending advanced RAG (Retrieval-Augmented Generation) with a gamified learning experience, Lubb AI transforms education into an empowering journey of discovery.

## ✨ Core Features

### 🤖 AI-Driven Pedagogy
- **Personalized Lessons:** Dynamic content generation tailored to the learner's pace and understanding.
- **Lubb Assistant:** An intelligent AI guide providing real-time support, conceptual clarifications, and guidance.
- **RAG Integration:** Upload documents to create a personalized knowledge base, allowing the AI to provide context-aware answers from your own materials.

### 🧩 Interactive Learning Components
Unlike traditional platforms, Lubb AI uses a custom-built interactive engine to make learning tactile and engaging:
- **Concept Sliders & Timelines:** Visualize progress and temporal relationships.
- **Branching Scenarios:** Explore "what-if" outcomes in complex simulations.
- **Hotspots & Matching:** Engage with visual and conceptual associations.
- **Active Recall:** Integrated flashcards, fill-in-the-blanks, and free-response assessments.

### 🏆 Gamified Growth
Learning is incentivized through a sophisticated progression system:
- **XP & Leveling:** Earn experience points for completing lessons and quizzes.
- **Achievements:** Unlock badges for mastery and consistency.
- **Leaderboards:** Friendly competition within the community to drive engagement.

### 🌐 Social & Content Ecosystem
- **Community Hub:** Connect with other learners to share insights and collaborate.
- **Educational Blog:** High-quality articles and guides to supplement the learning path.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Backend** | Supabase (Auth, PostgreSQL, Storage) |
| **AI Engine** | Google AI Studio (Gemini) + Vector Embeddings |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- A Supabase project
- Google AI Studio API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ai-education-platform.git
   cd ai-education-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and populate it using the `.env.example` template:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_postgresql_url

   # AI Keys
   GOOGLE_API_KEY_1=your_google_api_key

   # Vercel
   VERCEL_TOKEN=your_vercel_token
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📁 Project Architecture

```text
src/
├── app/              # Next.js App Router (Pages, API routes, Layouts)
│   ├── dashboard/    # User hub (Lessons, Community, Profile)
│   ├── api/          # Backend endpoints (AI, Supabase logic)
│   └── auth/         # Authentication flows
├── components/       # Reusable UI components
│   ├── ui/           # Atomic Shadcn components
│   ├── interactive/  # Custom learning components (Timeline, Flashcards, etc.)
│   └── gamification/ # XP, Badges, and Progress indicators
├── lib/              # Core business logic
│   ├── ai/           # LLM configurations and embedding logic
│   ├── supabase/     # Database clients and server-side helpers
│   └── gamification/ # XP and Level calculation logic
├── hooks/            # Custom React hooks for state and storage
└── types/            # TypeScript definitions
```

---

## 🤝 Contributing

We welcome contributions to make Lubb AI the gold standard for understanding-based education. Please read the `CONTRIBUTING.md` (if available) or open an issue to discuss proposed changes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
