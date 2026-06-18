# AI Resume Score Checker

AI Resume Score Checker is a React + TypeScript application that analyzes resumes against a Job Description (JD) and provides AI-powered feedback and ATS scores.

## Features

- Upload PDF resumes
- Convert PDF to image preview
- AI-powered resume analysis
- Overall Resume Score
- ATS Score
- Content, Structure, Skills, and Tone & Style scores
- Detailed improvement suggestions
- Resume history dashboard
- Resume preview and download
- Persistent storage using Puter KV

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Puter AI
- Puter KV Store
- Puter File System
- PDF.js

## Installation

```bash
npm install
npm run dev
```

## Project Structure

```
app/
├── components/
├── lib/
├── routes/
├── constants/
└── root.tsx
```

## Workflow

1. Upload Resume and Job Description.
2. Convert PDF to image.
3. Analyze resume using AI.
4. Store results in Puter KV.
5. Display scores and detailed suggestions.
6. Track previously analyzed resumes.

## Author

Ankit Kumar Jha
