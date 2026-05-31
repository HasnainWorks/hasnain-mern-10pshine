📝 Noted. — Full-Stack Notes Application
A modern, full-stack notes application built with the MERN stack, featuring AI-powered writing assistance, rich text editing, and a premium dark UI.

🚀 Tech Stack
LayerTechnologyFrontendReact.js, Vite, Tailwind CSSBackendNode.js, Express.jsDatabaseMongoDB AtlasAuthenticationJWT (JSON Web Tokens)LoggingPino LoggerAI IntegrationGroq (LLaMA 3.3)TestingMocha/Chai (Backend), Vitest/Jest (Frontend)Version ControlGit

✨ Features
🔐 Authentication & Authorization

User signup and login with JWT
Protected routes — notes are private per user
Token expiry detection and auto logout
Secure password hashing with bcryptjs

📝 Note Management

Create, edit, delete notes
Rich text editor (Tiptap) — bold, italic, headings, lists, blockquote, code blocks
Autosave every 30 seconds
Ctrl+S keyboard shortcut to save
Unsaved changes warning on close
Soft delete — notes go to Trash before permanent deletion
Restore notes from Trash
Permanently delete from Trash

📌 Organization

Pin/Unpin notes — pinned notes appear at top
Tags — add multiple tags per note, filter by tag
Search — real-time search by title, content, or tag
Sort — by Newest, Oldest, or A→Z
Infinite scroll pagination

🤖 AI Integration (Powered by Groq)

Summarize — get a 2-3 sentence summary of any note
Writing Assistant — Continue writing, Improve quality, Fix grammar
Auto Tags — AI suggests relevant tags based on note content

📤 Export & Import

Export note as PDF
Export note as .txt
Copy note content to clipboard
Copy shareable note link
Import .txt files directly into the editor

👤 User Profile

View account stats (total notes, pinned, trashed)
Edit name and email
Change password with validation
Delete account (wipes all notes)

🎨 UI/UX

Premium dark theme with lime #CAFF00 accent
Fully responsive — hamburger menu on mobile
Custom confirm modals — no browser alerts
404 page
Footer on all pages


🔒 Security

Rate limiting on auth routes (10 requests / 15 min)
CORS restricted to frontend origin
XSS sanitization on note content (sanitize-html)
JWT secret validation on server startup
Input length limits on all fields
Passwords hashed with bcryptjs (salt rounds: 10)
New password must differ from current password


📁 Project Structure
hasnain-mern-10pshine/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── notesController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── notesService.js
│   │   └── aiService.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── notes.test.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── notes/
    │   │   │   ├── NotesGrid.jsx
    │   │   │   ├── NoteCard.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   ├── AiPanel.jsx
    │   │   │   ├── ExportMenu.jsx
    │   │   │   ├── ImportNote.jsx
    │   │   │   └── notesUtils.jsx
    │   │   ├── profile/
    │   │   │   ├── ProfileHeader.jsx
    │   │   │   ├── ProfileStats.jsx
    │   │   │   ├── EditInfoForm.jsx
    │   │   │   ├── ChangePasswordForm.jsx
    │   │   │   ├── DangerZone.jsx
    │   │   │   ├── Section.jsx
    │   │   │   └── Field.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PinnedView.jsx
    │   │   ├── TagsView.jsx
    │   │   └── TrashView.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── NoteEditor.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── authService.js
    │   └── App.jsx
    └── index.html

⚙️ Installation & Setup
Prerequisites

Node.js v18+
MongoDB Atlas account
Groq API key (free at console.groq.com)


Backend Setup
bash# Clone the repository
git clone https://github.com/yourusername/hasnain-mern-10pshine.git

# Navigate to backend
cd hasnain-mern-10pshine/backend

# Install dependencies
npm install

# Create .env file
touch .env
Add to .env:
envPORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
bash# Start backend
npm start

# or with nodemon
npm run dev

Frontend Setup
bash# Navigate to frontend
cd hasnain-mern-10pshine/frontend

# Install dependencies
npm install

# Create .env file
touch .env
Add to .env:
envVITE_API_URL=http://localhost:5000/api
bash# Start frontend
npm run dev

🧪 Running Tests
Backend Tests (Mocha/Chai)
bashcd backend
npm test
Frontend Tests (Vitest/Jest)
bashcd frontend
npm test

🌐 API Endpoints
Auth Routes
MethodEndpointDescriptionAuthPOST/api/auth/signupRegister new user❌POST/api/auth/loginLogin user❌GET/api/auth/meGet current user + stats✅PUT/api/auth/meUpdate name/email✅PUT/api/auth/me/passwordChange password✅DELETE/api/auth/meDelete account✅
Notes Routes
MethodEndpointDescriptionAuthPOST/api/notesCreate note✅GET/api/notesGet all notes (paginated)✅PUT/api/notes/:idUpdate note✅DELETE/api/notes/:idSoft delete (trash)✅GET/api/notes/trashGet trashed notes✅PATCH/api/notes/:id/restoreRestore from trash✅DELETE/api/notes/:id/permanentPermanently delete✅PATCH/api/notes/:id/pinToggle pin✅PATCH/api/notes/:id/tagsUpdate tags✅
AI Routes
MethodEndpointDescriptionAuthPOST/api/ai/summarizeSummarize note✅POST/api/ai/assistWriting assistant✅POST/api/ai/tagsGenerate tags✅

🔑 Environment Variables
Backend .env
VariableDescriptionPORTServer port (default: 5000)MONGO_URIMongoDB Atlas connection stringJWT_SECRETSecret key for JWT signingGROQ_API_KEYGroq API key for AI featuresFRONTEND_URLFrontend URL for CORSNODE_ENVEnvironment (development/production)
Frontend .env
VariableDescriptionVITE_API_URLBackend API base URL

🌿 Git Branching Strategy
main
├── develop
│   ├── feature/user-auth
│   ├── feature/note-editor
│   ├── feature/ai-integration
│   ├── feature/user-profile
│   ├── feature/search-filter
│   ├── chore/backend/production-readiness
│   └── chore/frontend/ui-polish-and-cleanup

📸 Application Screens
ScreenDescriptionLogin / SignupAuthentication with branded split-panel layoutDashboardNotes grid with search, filter, sort, infinite scrollNote EditorFull-screen rich text editor with AI panelPinnedAll pinned notesTagsBrowse notes by tagTrashRecover or permanently delete notesProfileAccount stats, edit info, change password, delete account

👨‍💻 Developer
Hasnain Qurban

Email: hasnainqurban284@gmail.com
GitHub: github.com/HasnainWorks


📄 License
This project is developed as part of an academic requirement at 10Pearls University.

Built with ❤️ using React, Node.js, MongoDB, and Groq AI
