# GitExplore 🚀

Welcome to **GitExplore**, a sleek and powerful web application designed to help you discover, analyze, and keep track of trending GitHub repositories. With a modern, dark-themed UI, GitExplore provides a premium experience for developers and tech enthusiasts to stay on top of the latest projects in the open-source world.

![GitExplore Screenshot](https://raw.githubusercontent.com/firebase/studio-hosting/main/gitexplore-screenshot.png)

## ✨ Key Features

- **Explore Trending Repositories**: Discover the hottest repositories on GitHub, updated daily.
- **Advanced Search & Filtering**: Quickly find repositories by name, description, language, license, and even size. Sort results by stars, forks, creation date, and more.
- **Personal Bookmarks**: Save your favorite repositories for easy access later.
- **Private Notes**: Add personal notes to any repository. A rich-text editor allows for formatted notes, which are previewed directly on the repository card.
- **In-Depth Analytics**: Visualize repository data with beautiful and interactive charts, including:
  - Repository creation trends over time.
  - Language distribution across a set of repositories.
  - Top repositories by star count.
- **Responsive & Modern UI**: A stunning dark-mode interface built with the latest web technologies, ensuring a great experience on any device.
- **SEO Friendly**: Includes full Open Graph and Twitter card metadata for rich social sharing.
- **Local Storage Persistence**: Your bookmarks and notes are saved directly in your browser, so they're always there when you return.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/get-npm) or a compatible package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/gitexplore.git
    cd gitexplore
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your GitHub Personal Access Token. This is required to fetch data from the GitHub API. You can generate a token [here](https://github.com/settings/tokens).

    ```.env.local
    GITHUB_TOKEN=ghp_YourGitHubTokenHere
    ```

    > **Important**: This variable is used exclusively on the server-side. For production deployments (e.g., on Netlify or Vercel), you must set `GITHUB_TOKEN` as an environment variable in your hosting provider's dashboard. Do not prefix it with `NEXT_PUBLIC_`.

    > The app includes mock data as a fallback, but for the full experience (live search and trending data), the GitHub token is highly recommended.

### Running the Application

To start the development server, run:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
