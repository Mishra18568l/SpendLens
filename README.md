# SpendLens — AI Tool Spend Audit Platform

SpendLens is a modern AI cost optimization platform that helps startups, developers, and engineering teams analyze their spending on AI tools like Claude, ChatGPT, Cursor, GitHub Copilot, and more.

The platform generates intelligent audit reports with personalized savings recommendations, pricing optimization insights, and shareable audit summaries.

---

## 🚀 Live Demo

🔗 Live Project: https://spendlens-kappa.vercel.app

---

## 📌 Features

- 🔍 AI tool spend auditing
- 📊 Personalized savings analysis
- 💡 Smart optimization recommendations
- 📈 Monthly & yearly savings calculations
- 🤖 AI-generated financial summaries
- 📧 Lead capture & email report flow
- 🔗 Public shareable audit links
- ⚡ Responsive modern UI
- 🛡️ Spam protection with honeypot validation
- ☁️ Vercel deployment ready

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS

### Backend / APIs
- Next.js App Router APIs
- Supabase
- Anthropic API
- Resend API

### Deployment
- Vercel

---

## 📂 Project Structure

```bash
src/
 ├── app/
 │    ├── api/
 │    ├── audit/
 │    └── page.tsx
 │
 ├── components/
 ├── lib/
 ├── types/
 └── __tests__/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Mishra18568l/SpendLens.git
cd SpendLens
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

RESEND_API_KEY=your_resend_api_key
```

> The project also works without API keys using fallback mock summaries and in-memory storage.

---

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## ☁️ Deployment

This project is deployed on Vercel.

### Deploy your own version

```bash
npx vercel
```

---

## 🧠 Key Engineering Decisions

### ✅ Rule-Based Audit Engine
All savings calculations are deterministic and handled through TypeScript logic to avoid inaccurate AI-generated financial outputs.

### ✅ AI Used Only for Summaries
Anthropic AI is used only for human-readable financial explanations and recommendations.

### ✅ Fallback Architecture
If APIs are unavailable, the application gracefully switches to:
- in-memory storage
- template AI summaries

### ✅ Modern Next.js Architecture
Implemented using:
- App Router
- API Routes
- Server & Client Components
- Dynamic Routes

---

## 📷 Screenshots

### Homepage
_Add screenshot here_

### Audit Results Page
_Add screenshot here_

### AI Recommendations
_Add screenshot here_

---

## 🧪 Testing

Run tests using:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

---

## 📈 Future Improvements

- PDF report generation
- Authentication system
- Multi-user dashboards
- Advanced analytics
- Stripe billing integration
- Team collaboration support

---

## 👨‍💻 Author

### Vikash Mishra

- GitHub: https://github.com/Mishra18568l

---

## 📄 License

This project is built for educational, portfolio, and assignment purposes.
