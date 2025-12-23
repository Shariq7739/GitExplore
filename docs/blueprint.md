# **App Name**: GitExplore

## Core Features:

- Trending Repositories: Fetch and display trending GitHub repositories with pagination, sorted by stars, forks, and update date.
- Repository Search: Search for repositories by name and description using the GitHub API with debouncing.
- Repository Details: Display repository details, including stars, forks, language, last update, and owner information.
- Analytics Dashboard: Visualize repository statistics using Chart.js, including top repositories by stars, language distribution, and open vs closed issues.
- Bookmarking System: Save and unsave repositories to localStorage for persistent bookmarks.
- Rich Text Notes: Add and edit notes for repositories using TipTap rich text editor, saved to localStorage.

## Style Guidelines:

- Primary color: Vibrant purple (#A020F0) for a modern, tech-oriented feel.
- Background color: Dark gray (#282A3A) with 20% saturation to complement the dark theme.
- Accent color: Electric blue (#7DF9FF) to highlight interactive elements and call-to-actions.
- Body and headline font: 'Inter', a sans-serif font for clear readability and a modern, neutral appearance.
- Lucide React icons for a clean, consistent, and modern aesthetic.
- Glassmorphism effect using Tailwind classes like `bg-white/10`, `backdrop-blur-lg`, `border border-white/20`.
- Subtle animations for loading states, transitions, and bookmark interactions for enhanced user experience.