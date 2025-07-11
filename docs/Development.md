# 🛠️ Development Guide

This document explains how to set up the development environment, contribute with new features using feature branches,
and trigger automatic versioning and deployment via GitHub Actions.

---

## 📦 Tooling Setup

We use [Volta](https://volta.sh) to manage Node.js and npm versions consistently across developers and CI.

### 1. Install Volta (if not already installed)

```bash
curl https://get.volta.sh | bash
```

Restart your terminal, then run:

```bash
volta --version
```

### 2. Install Node.js & npm via Volta

From the root of the repository, run:

```bash
volta install
```

This will install the Node.js and npm versions pinned in `package.json` under the `volta` field:

```json
{
  "volta": {
    "node": "22.17.0",
    "npm": "11.4.2"
  }
}
```

---

## 🚀 Run the Development Server

1. Install dependencies:

```bash
npm install
```

2. Start the dev server with Vite:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if already in use).

---

## 🌱 Create a Feature Branch

We follow the `feature/*` branching convention. To create a new feature branch:

```bash
git checkout -b feature/my-cool-feature
```

Commit your changes and push your branch:

```bash
git push origin feature/my-cool-feature
```

Open a pull request to merge your changes into `main`.

---

## ✅ Merge to `main` & Trigger a Release

Once your pull request is reviewed and approved:

1. Merge it into `main` using **Squash & Merge**.
2. The GitHub Actions pipeline will:

- Automatically bump the version
- Create a new Git tag (e.g. `v2.1.1`)
- Run the build (`npm run build`)
- Deploy or upload the release

The version bump behavior can be configured (manual with `npm version`, or automated via commit messages or workflows).

---

## 📦 Deployment

Deployment happens automatically after merging into `main`, triggered by the presence of a new version tag like
`vX.Y.Z`.

If needed, you can trigger it manually:

```bash
npm version patch    # or minor / major
git push --follow-tags
```

This will:

- Update the version in `package.json`
- Commit the version bump
- Create a new Git tag (e.g. `v2.1.1`)
- Trigger the GitHub Actions deployment workflow

---

## 🔄 Releases

This project uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) to automate versioning,
changelog generation, and GitHub releases.

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) in your commit messages to trigger automatic
releases.

---

## 🔍 Additional Commands

- **Lint code**: `npm run lint`
- **Format code**: `npm run format`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

---

## 📁 Project Structure

```
.
├── .github/                  # GitHub configuration and workflows
│   └── workflows/            # GitHub Actions CI/CD pipelines
├── .husky/                  # Git hooks (e.g., pre-commit)
├── .idea/                   # IDE configuration (ignored in VCS)
├── dist/                    # Production build output (generated)
├── docs/                    # Project documentation and assets
├── node_modules/            # Installed packages (auto-generated)
├── public/                  # Static files served at root
├── src/                     # Application source code
│   ├── app/                 # App-level logic and routing
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable UI components
│   ├── constants/           # Shared constants
│   ├── context/             # React context definitions
│   ├── features/            # Feature modules (e.g. firmware)
│   ├── shared/              # Shared logic/utilities across features
│   └── utils/               # General utility functions
├── .env.local               # Local environment variables
├── index.html               # HTML entry point
├── vite-env.d.ts            # Vite TypeScript declarations
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # Base TypeScript config
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
├── postcss.config.cjs       # PostCSS setup
├── eslint.config.js         # ESLint configuration
├── .editorconfig            # Editor configuration
├── .gitignore               # Git ignore rules
├── .prettierignore          # Prettier ignore rules
├── .prettierrc              # Prettier configuration
├── LICENSE
├── package.json             # Project metadata and dependencies
├── package-lock.json        # Dependency lock file
├── README.md
└── DEVELOPMENT.md           # Developer onboarding and workflow
```

---

## 📚 Resources

- [Volta](https://volta.sh)
- [Vite](https://vitejs.dev)
- [React](https://reactjs.org)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Mantine](https://mantine.dev)
- [Husky](https://typicode.github.io/husky/)

---

