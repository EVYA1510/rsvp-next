# מדריך פיתוח - RSVP Next.js Wedding App

## 🏗️ ארכיטקטורה

### מבנה תיקיות
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   │   ├── calendar/   # Calendar API
│   │   └── submit/     # RSVP Submission API
│   ├── layout.tsx      # Root Layout
│   └── page.tsx        # Home Page
├── components/         # React Components
│   ├── forms/         # Form Components
│   ├── ui/            # UI Components
│   └── __tests__/     # Component Tests
├── hooks/             # Custom Hooks
│   └── __tests__/     # Hook Tests
├── lib/               # Utilities & Libraries
│   ├── validations.ts # Zod Schemas
│   ├── googleSheets.ts # Google Sheets Integration
│   └── __tests__/     # Library Tests
├── utils/             # Utility Functions
│   ├── accessibility.ts # Accessibility Helpers
│   ├── localStorageHelpers.ts # Local Storage
│   └── test-utils.tsx # Testing Utilities
└── styles/            # Global Styles
    └── globals.css    # Tailwind CSS
```

## 🧪 מערכת הבדיקות

### סטטוס נוכחי
- **35 בדיקות עוברות** מתוך 37
- **כיסוי קוד**: 21% statements, 28% branches
- **זמן הרצה**: ~4 שניות

### קבצי בדיקה
```
src/
├── components/__tests__/
│   └── RSVPForm.test.tsx      # ✅ 100% הצלחה
├── hooks/__tests__/
│   └── useRSVPForm.test.ts    # ✅ 80% הצלחה
├── lib/__tests__/
│   └── validations.test.ts    # ✅ 100% הצלחה
└── app/api/__tests__/
    ├── submit.test.ts         # 🔄 בפיתוח
    └── calendar.test.ts       # 🔄 בפיתוח
```

### הרצת בדיקות

```bash
# בדיקות רגילות
npm test

# בדיקות עם כיסוי
npm run test:coverage

# בדיקות במצב צפייה
npm run test:watch

# בדיקות ב-CI
npm run test:ci
```

### תצורת Jest
```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 15,
      lines: 15,
      statements: 15,
    },
  },
};
```

## 🔧 כלי פיתוח

### TypeScript
- **תצורה קפדנית** עם `strict: true`
- **Type Safety** מלא לכל הקומפוננטים
- **Interface Definitions** לכל הנתונים

### ESLint & Prettier
```bash
# בדיקת קוד
npm run lint

# תיקון אוטומטי
npm run lint:fix
```

### Bundle Analysis
```bash
# ניתוח גודל הבנדל
npm run analyze
```

## 📦 תלויות עיקריות

### Production Dependencies
```json
{
  "next": "15.4.5",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "framer-motion": "^12.23.12",
  "zod": "^4.0.17",
  "react-hot-toast": "^2.5.2",
  "canvas-confetti": "^1.9.3"
}
```

### Development Dependencies
```json
{
  "typescript": "^5",
  "jest": "^30.0.5",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.6.4",
  "tailwindcss": "^3.4.17",
  "eslint": "^9"
}
```

## 🎨 עיצוב ו-UI

### Tailwind CSS
- **Utility-First** approach
- **Responsive Design** מובנה
- **Dark Mode** support
- **Custom Components** עם @apply

### Framer Motion
- **Smooth Animations** לכל האינטראקציות
- **Page Transitions** חלקים
- **Loading States** אנימטיביים

### Accessibility
- **ARIA Labels** מלאים
- **Keyboard Navigation** תומך
- **Screen Reader** friendly
- **Focus Management** נכון

## 🔌 API Integration

### Google Sheets API
```typescript
// src/lib/googleSheets.ts
export async function appendRow(data: string[]): Promise<GoogleSheetsResponse> {
  // Implementation for Google Sheets integration
}
```

### Environment Variables
```env
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Touch Interactions
- **Touch-friendly** buttons
- **Swipe gestures** support
- **Mobile-optimized** forms

## 🚀 Deployment

### Vercel (מומלץ)
```bash
# Deploy to Vercel
vercel --prod
```

### Environment Setup
1. הגדר משתני סביבה ב-Vercel Dashboard
2. הוסף Google Sheets API credentials
3. הגדר custom domain (אופציונלי)

### Performance Optimization
- **Image Optimization** עם Next.js
- **Code Splitting** אוטומטי
- **Tree Shaking** ל-unused code
- **Bundle Analysis** לניטור גודל

## 🐛 Debugging

### Development Tools
```bash
# Debug mode
NODE_ENV=development npm run dev

# Bundle analysis
npm run analyze

# Type checking
npx tsc --noEmit
```

### Common Issues

#### 1. Google Sheets API Errors
```typescript
// Check API key and permissions
console.log('API Key:', process.env.GOOGLE_SHEETS_API_KEY);
```

#### 2. TypeScript Errors
```bash
# Fix type errors
npx tsc --noEmit --skipLibCheck
```

#### 3. Test Failures
```bash
# Run specific test file
npm test -- RSVPForm.test.tsx

# Debug test
npm test -- --verbose
```

## 📈 Performance Monitoring

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Bundle Size
- **Initial Load**: ~146KB
- **JavaScript**: ~120KB
- **CSS**: ~26KB

## 🔒 Security

### Best Practices
- **Input Validation** עם Zod
- **XSS Protection** מובנה
- **CSRF Protection** עם Next.js
- **Environment Variables** מוגנים

### API Security
```typescript
// Rate limiting
export const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🤝 Contributing

### Code Style
- **Prettier** formatting
- **ESLint** rules
- **TypeScript** strict mode
- **Conventional Commits**

### Pull Request Process
1. Create feature branch
2. Write tests for new functionality
3. Update documentation
4. Submit PR with description
5. Code review and approval

### Testing Checklist
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Coverage threshold met
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Performance impact assessed

## 📊 Analytics & Monitoring

### Google Analytics
```typescript
// Track RSVP submissions
gtag('event', 'rsvp_submit', {
  event_category: 'engagement',
  event_label: 'wedding_rsvp'
});
```

### Error Monitoring
```typescript
// Error boundary logging
console.error('Component Error:', error, errorInfo);
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build
```

### Deployment Stages
1. **Development** - Local development
2. **Staging** - Pre-production testing
3. **Production** - Live deployment

## 📝 Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ RSVP form functionality
- ✅ Google Sheets integration
- ✅ Responsive design
- ✅ Comprehensive testing
- ✅ Accessibility features
- ✅ Performance optimization

### Upcoming Features
- 🔄 Multi-language support
- 🔄 Advanced analytics
- 🔄 Email notifications
- 🔄 Admin dashboard
- 🔄 Guest list management
