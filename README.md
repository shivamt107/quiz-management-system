# Quiz Management System

A modern, feature-rich quiz management application built with React and Tailwind CSS.

## Features

### Authentication & Authorization
- **Role-based access control** with two user types:
  - **Admin** (username: `admin`, password: `admin`)
    - Create, edit, and delete quizzes
    - Full access to all features
  - **Public User** (username: `user`, password: `user`)
    - View and take quizzes
    - Read-only access

### Quiz Management
- **Create Quizzes** with comprehensive details:
  - Title, description, category, difficulty level
  - Duration settings
  - Multiple question types support
- **Edit Quizzes** - Admin can modify existing quizzes
- **Delete Quizzes** - Admin can remove quizzes

### Question Types
- **Multiple Choice Questions (MCQ)** - 4 options with single correct answer
- **True/False Questions** - Binary choice questions
- **Text Questions** - Open-ended responses

### User Interface
- **Responsive Grid Layout** - 5 columns on large screens, adaptive on smaller devices
- **Pagination** - Display 10 quizzes per page for better performance
- **Modern Design** - Built with Tailwind CSS for a clean, professional look
- **Smooth Navigation** - React Router for seamless page transitions

### Data Persistence
- LocalStorage integration for quiz data persistence
- Auto-save functionality

## Tech Stack

- **React** - UI library
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **LocalStorage** - Client-side data persistence

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd quiz-management
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
quiz-management/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/      # React components
│   │   ├── Login.js
│   │   ├── QuizCard.js
│   │   └── QuizList.js
│   ├── constants/       # App constants and permissions
│   │   ├── index.js
│   │   └── permissions.js
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── usePermissions.js
│   │   └── useQuizData.js
│   ├── pages/           # Page components
│   │   └── CreateEditQuiz.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Usage

### Login
1. Use one of the demo credentials to login:
   - Admin: `admin` / `admin`
   - User: `user` / `user`

### Creating a Quiz (Admin Only)
1. Click "Add New Quiz" button
2. Fill in quiz details (title, description, category, difficulty, duration)
3. Add questions by selecting question type (MCQ, True/False, or Text)
4. For MCQ and True/False, provide options and select the correct answer
5. Set points for each question
6. Click "Add Question" to add to the quiz
7. Click "Create Quiz" when done

### Editing a Quiz (Admin Only)
1. Click "Edit" button on any quiz card
2. Modify quiz details or questions
3. Add or remove questions
4. Click "Update Quiz" to save changes

### Deleting a Quiz (Admin Only)
1. Click "Delete" button on any quiz card
2. Confirm the deletion

### Viewing Quizzes
- Browse quizzes in the grid layout
- Use pagination to navigate through multiple pages
- View quiz details including category, difficulty, question count, and duration

## Performance Optimizations

- **Memoization** - Components and callbacks are memoized to prevent unnecessary re-renders
- **Code Splitting** - Lazy loading for route-based components
- **Pagination** - Only 10 items rendered at a time
- **Optimized Re-renders** - Custom comparison functions in React.memo()

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation!** Ejects from Create React App

## Future Enhancements

- [ ] Quiz taking functionality with timer
- [ ] Score tracking and leaderboards
- [ ] Quiz analytics and statistics
- [ ] Image support in questions
- [ ] Export/Import quiz data
- [ ] Backend integration with REST API
- [ ] User profile management
- [ ] Search and filter functionality
- [ ] Quiz categories management
- [ ] Multi-language support

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Built with using React and Tailwind CSS
