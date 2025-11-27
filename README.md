## Job Assistant – AI-Powered Career Copilot

Job Assistant is an AI-powered web app that helps you streamline your job search and preparation:

- Create tailored CVs for different roles.
- Generate personalized cover letters for each vacancy.
- Gather and track job vacancies in one place.
- Train for interviews with an AI interview coach.

The app is built with **Next.js** and uses **Google Gemini** as the AI provider. It is designed to be easily deployed on **Netlify**.

---

## Features

- **Smart CV Builder**
  - Generate or refine CVs based on your background.
  - Create multiple versions tuned to different roles or industries.

- **AI Cover Letter Generator**
  - Paste a vacancy or job description and get a tailored cover letter.
  - Adjust tone and length to match your style.

- **Vacancy Collector**
  - Save vacancies you find (title, company, link, notes).
  - Keep track of application status and deadlines.

- **Interview Trainer**
  - Practice common and role-specific interview questions.
  - Get AI feedback on your answers and hints for improvement.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React (+ your ShadCN)
- **Database:** Postgres
- **ORM:** Drizzle
- **AI Provider:** Google Gemini API
- **Deployment:** Netlify

Update this section if you change any major technology.

---

## Getting Started

### 1. Prerequisites

- Node.js (LTS recommended, e.g. 18+)
- npm, yarn, pnpm, or bun

### 2. Install Dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 3. Environment Variables

Create a `.env.local` file in the project root and add your configuration, for example:

```bash
GEMINI_API_KEY=your-gemini-api-key
# Add any other keys and settings the app needs
```

Make sure not to commit secrets to version control.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser.

---

## Usage

Typical workflow:

1. **Profile / CV**
   - Enter your experience, skills, and education.
   - Let the assistant generate or improve your CV.

2. **Vacancies**
   - Add job postings (title, company, link, description).
   - Keep track of which roles you’re targeting and your application status.

3. **Cover Letters**
   - Select a vacancy and generate a tailored cover letter.
   - Edit, regenerate, or fine-tune the text before sending.

4. **Interview Training**
   - Choose a role or topic (e.g. frontend, backend, product, etc.).
   - Practice Q&A with the interview trainer.
   - Use the AI feedback to refine your answers.

Adjust this section to match your actual UI and flows.

---

## Deployment on Netlify

1. Push your project to a Git repository (GitHub, GitLab, Bitbucket, etc.).
2. Create a new site on Netlify and connect the repository.
3. Set the build command and publish directory, for example:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` or `out` (depending on your Next.js setup)
4. Add your environment variables (e.g. `GEMINI_API_KEY`) in the Netlify dashboard.
5. Deploy the site.

Refer to Netlify’s documentation if your Next.js configuration is more advanced (SSR, edge functions, etc.).

---

## Scripts

Common scripts (see `package.json`):

- `npm run dev` – Start development server.
- `npm run build` – Create production build.
- `npm run start` – Run production server.
- `npm run lint` – Run linting (if configured).

Use the corresponding `yarn`, `pnpm`, or `bun` commands if you prefer.

---

## Roadmap

- Improved vacancy tracking (statuses, reminders, analytics).
- Richer interview simulations (timed sessions, difficulty levels, role-specific banks).
- Multi-language support.
- Export & sharing (PDF/DOCX CVs and cover letters).

Update this list as the project evolves.

---

## Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
3. Commit your changes and open a pull request.

---


