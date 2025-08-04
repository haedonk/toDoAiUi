# Todo AI - Smart Task Management

A fully functional, AI-powered todo application built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy with Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variable: `VITE_API_BASE_URL` = `https://todoai-ruqd.onrender.com/api`
   - Deploy!

📖 **Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🚀 Features

### Authentication
- **Login/Register** with JWT token-based authentication
- **Auto-redirect** to dashboard if logged in
- **Persistent sessions** with localStorage
- **Protected routes** with route guards

### Todo Management
- **Create, Read, Update, Delete** todos
- **Mark as complete/incomplete**
- **Priority levels** (Low, Medium, High) with colored badges
- **Due dates** with overdue detection
- **Drag & drop reordering** for manual prioritization
- **Search and filter** by status and priority
- **Responsive card layout**

### AI Features
- **Smart Prioritization** - AI analyzes and reorders your todos
- **Task Suggestions** - AI generates relevant task recommendations
- **Context-aware** suggestions based on existing todos
- **One-click** addition of AI suggestions to your todo list

### UI/UX
- **Modern, clean design** with Tailwind CSS
- **Dark mode toggle** with persistent preference
- **Responsive design** for desktop and mobile
- **Smooth animations** and hover effects
- **Toast notifications** for user feedback
- **Modal forms** for creating and editing todos
- **Loading states** and error handling

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context + Custom Hooks

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── AIPanel.tsx    # AI features sidebar
│   ├── Navbar.tsx     # Navigation header
│   ├── TodoForm.tsx   # Create/edit todo modal
│   ├── TodoItem.tsx   # Individual todo item
│   └── ProtectedRoute.tsx # Route protection
├── pages/             # Page components
│   ├── Login.tsx      # Login page
│   ├── Register.tsx   # Registration page
│   └── Dashboard.tsx  # Main todo dashboard
├── context/           # React Context providers
│   └── AuthContext.tsx # Authentication state
├── hooks/             # Custom React hooks
│   └── useTodos.ts    # Todo management logic
├── services/          # API services
│   └── api.ts         # HTTP client and API calls
├── types/             # TypeScript type definitions
│   └── index.ts       # Application types
├── utils/             # Utility functions
│   └── index.ts       # Helper functions
└── App.tsx            # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-ai-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API endpoint:
   ```
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/complete` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/reorder` - Reorder todos

### AI Features
- `POST /api/ai/prioritize` - AI prioritize todos
- `POST /api/ai/suggest` - Generate AI suggestions
- `GET /api/ai/suggestions` - Get cached suggestions

## 🎨 Customization

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Custom components in the `src/components/` directory
- Global styles in `src/index.css`

### Dark Mode
Dark mode is implemented using Tailwind's dark mode utilities and persisted in localStorage.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Protected routes
- Input validation
- XSS protection through React's built-in escaping

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
The application can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🧪 Demo Account

For testing purposes, the login page includes demo credentials:
- **Email**: demo@todoai.com
- **Password**: demo123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- AI features require a backend API implementation
- Demo credentials are for frontend testing only
- Some animations may not work in reduced motion mode

## 🔮 Future Enhancements

- Collaborative todos (team features)
- File attachments
- Recurring tasks
- Calendar integration
- Offline support with PWA
- Email notifications
- Advanced AI insights and analytics
