# Online Assessment Platform

A modern, full-stack online assessment platform built with Next.js, React, and Node.js. This platform enables employers to create and manage online tests while candidates can take assessments seamlessly.

## 🔗 Links

- **Live Demo:** [https://online-assessment-platform-bice.vercel.app/](https://online-assessment-platform-bice.vercel.app/)
- **GitHub Repository:** [https://github.com/mrakib007/online_assessment_platform](https://github.com/mrakib007/online_assessment_platform)
- **Video Demo:** [Watch Demo](https://drive.google.com/file/d/1oBHmBZSszdBBN1HXrmAO_09b2mMvemep/view?usp=sharing)

## 🚀 Features

### For Employers
- Create and manage online tests
- Configure multiple question sets (anti-cheating via set distribution)
- Define time slots with start/end times and per-slot candidate capacity
- Enable negative marking with configurable penalty percentage
- Add multiple question types (MCQ, Checkbox, Text)
- View candidate results with score breakdowns and penalty details

### For Candidates
- Browse available tests
- Automatic question set assignment (round-robin, no manual selection)
- Time slot enforcement — blocked with next slot info if outside window
- Real-time countdown timer tied to slot end time
- Automatic submission on time expiry
- Detailed results with per-question points earned/deducted

### Technical Features
- **Authentication System** with JWT tokens
- **Role-based Access Control** (Employer/Candidate)
- **Automatic Set Assignment** with round-robin distribution (SetAssignmentService)
- **Time Slot Validation** with capacity enforcement (TimeSlotValidator)
- **Negative Marking Engine** with configurable penalty % (GradingService)
- **Timezone-aware Slot Inputs** — local time converted to UTC on save
- **Real-time Form Validation** with Formik + Yup
- **Toast Notifications** for user feedback
- **Reusable UI Components** (Input, Select, Toast)
- **Redux Toolkit** for global state
- **Responsive Design** with Tailwind CSS
- **Type Safety** with TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start server
npm start
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/akij_resource"
JWT_SECRET="your-secret-key"
PORT=5000
```

## � Test Credentials

Use the following credentials to test the application:

### Employer Account
- **Email:** employer@test.com
- **Password:** 123456

### Candidate Account
- **Email:** candidate@test.com
- **Password:** 123456

---

## �️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Form Management:** Formik + Yup
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **API Client:** RTK Query

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Validation:** Express Validator

---

## 📝 Additional Questions & Answers

### **MCP Integration**

**Q: Have you worked with any MCP (Model Context Protocol)?**

**A: No**, I have not worked with MCP in this project.

**Q: If no, describe an idea of how MCP could be used in this project**

**A:** MCP could significantly enhance this online assessment platform in the following ways:

#### 1. **Figma MCP Integration**
- **Design-to-Code Automation:** Automatically generate React components from Figma designs
- **Design Token Sync:** Keep Tailwind CSS configuration in sync with Figma design tokens (colors, spacing, typography)
- **Component Updates:** Auto-update UI components when designs change in Figma
- **Documentation Generation:** Create component documentation from Figma annotations

#### 2. **Chrome DevTools MCP**
- **Performance Monitoring:** Real-time performance tracking during test-taking sessions
- **Error Tracking:** Capture and log console errors to backend for debugging
- **Network Analysis:** Monitor API calls for optimization opportunities
- **User Behavior Analytics:** Track interactions to improve UX

#### 3. **Supabase MCP**
- **Real-time Synchronization:** Live updates when employers modify tests
- **Collaborative Editing:** Multiple admins can edit tests simultaneously
- **Live Leaderboards:** Real-time candidate rankings during assessments
- **Instant Answer Sync:** Automatic answer synchronization as candidates type

#### 4. **Custom Assessment MCP**
- **AI Question Generation:** Generate questions based on topics and difficulty levels
- **Plagiarism Detection:** Analyze text answers for potential plagiarism
- **Smart Proctoring:** Integrate webcam/screen monitoring for exam integrity
- **Adaptive Testing:** Adjust question difficulty based on candidate performance

---

### **AI Tools for Development**

**Q: Which AI tools or processes have you used or recommend to speed up frontend development?**

**A:** For development, I primarily use **Kiro** and **Cursor** as my main AI-powered IDEs. Beyond that, there are some great extensions and tools worth knowing about — **Augment**, **Amazon Q**, **Antigravity**, and **GitHub Copilot** integrate directly into VS Code and can speed up repetitive tasks, code completion, and refactoring. For more complex problem solving and architecture decisions, **Claude** and **ChatGPT** are useful as standalone tools. These collectively cover most of what you need to move fast on frontend development.

---

### **Offline Mode**

**Q: How would you handle offline mode if a candidate loses internet during an exam?**

**A:** If a candidate loses internet during an exam, I would handle it with a combination of local storage and a service worker.

Every answer the candidate selects would be saved to `localStorage` immediately — not just on submit. This means no answer is ever lost due to a dropped connection. The timer would also persist in `localStorage` so it keeps counting down even if the page reloads.

A `navigator.onLine` listener would detect when the connection drops and show a visible banner so the candidate knows they're offline but their progress is safe. When the connection is restored, the app would automatically sync the locally saved answers to the backend in the background.

On the backend, submissions would be accepted with a timestamp so that if a candidate submits after reconnecting, the server can handle it gracefully without rejecting it as a duplicate or conflict.

This approach ensures no data loss and a seamless experience even with an unstable connection.

---

## 📚 Documentation

For detailed documentation on components, hooks, and API endpoints, see the inline code comments and TypeScript types.




