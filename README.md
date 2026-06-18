AI Resume Score Checker

AI Resume Score Checker is a web application that analyzes resumes against a given Job Description (JD) and provides AI-powered feedback, ATS compatibility scores, and actionable suggestions for improvement.

Features
Upload PDF resumes.
Convert resumes into preview images.
Analyze resumes using AI.
Generate:
Overall Resume Score
ATS Score
Content Score
Structure Score
Skills Score
Tone & Style Score
Display detailed improvement suggestions.
Resume history dashboard.
Resume preview with downloadable PDF.
Persistent storage using Puter KV.
User authentication via Puter.
Tech Stack
Frontend
React
TypeScript
React Router
Tailwind CSS
Vite
Storage & Backend Services
Puter KV Store
Puter File System (FS)
Puter Authentication
AI
Puter AI Chat API
PDF Processing
pdfjs-dist
Folder Structure
app/
│
├── components/
│   ├── Accordion.tsx
│   ├── ATS.tsx
│   ├── Details.tsx
│   ├── FileUploader.tsx
│   ├── Navbar.tsx
│   ├── ResumeCard.tsx
│   ├── ScoreBadge.tsx
│   ├── ScoreCircle.tsx
│   ├── Scoregage.tsx
│   └── Summary.tsx
│
├── lib/
│   ├── pdf2img.tsx
│   ├── puter.ts
│   └── utils.ts
│
├── routes/
│   ├── auth.tsx
│   ├── home.tsx
│   ├── resume.tsx
│   └── upload.tsx
│
├── constants/
│   └── index.ts
│
├── app.css
├── root.tsx
└── routes.ts
Workflow
1. Upload Resume

User enters:

Company Name
Job Title
Job Description
Resume PDF

File is uploaded using:

window.puter.fs.upload()
2. PDF Conversion

Resume PDF is converted into an image using:

pdfjs-dist

This image is used for preview purposes.

3. AI Analysis

Prompt is generated using:

prepareInstructions()

AI evaluates:

ATS compatibility
Content quality
Structure
Skills match
Tone & Style

Response is returned as JSON.

4. Save Data

Resume information is stored inside Puter KV:

resume_<uuid>

Example:

resume_a3fb2eea-0c0a-4c01-9de1-ec77f7a9d685

Stored object:

{
  "id": "",
  "companyName": "",
  "jobTitle": "",
  "jobDescription": "",
  "resumePath": "",
  "imagePath": "",
  "feedback": {}
}
5. Dashboard

Home page fetches all resumes:

kv.list("resume_*", true)

Displays:

Resume cards
Company name
Job title
Overall score
Resume preview
6. Resume Details Page

Displays:

Summary
Overall score
ATS score
Content score
Structure score
Skills score
Tone & Style score
Detailed Suggestions

Each category contains:

{
  "score": 55,
  "tips": [
    {
      "type": "improve",
      "tip": "",
      "explanation": ""
    }
  ]
}

Categories:

ATS
Content
Structure
Skills
Tone & Style
Installation

Clone repository:

git clone <repo-url>

Install dependencies:

npm install

Run development server:

npm run dev
Important Dependencies
{
  "react": "^19",
  "typescript": "^5",
  "vite": "^7",
  "react-router": "^7",
  "tailwindcss": "^4",
  "pdfjs-dist": "^5.3.93"
}
Key Components
FileUploader

Handles PDF uploads.

pdf2img.tsx

Converts PDF to image using pdfjs-dist.

upload.tsx

Responsible for:

Uploading files
Converting PDFs
Calling AI
Saving data to KV
home.tsx

Displays all analyzed resumes.

resume.tsx

Loads:

PDF
Image preview
Feedback data
Summary.tsx

Displays score breakdown.

ATS.tsx

Displays ATS suggestions and improvement tips.

Accordion.tsx

Expandable suggestion cards.

Future Enhancements
Resume templates.
Download improved resume.
Cover letter generator.
LinkedIn profile analyzer.
Resume comparison.
Multi-page PDF preview.
Export reports to PDF.
AI resume rewriting.
Job matching engine.
Application tracker.


AI Resume Score Checker

Built with React + TypeScript + Puter AI + Tailwind CSS.
