---
title: Social Signal AI
emoji: 🌊
colorFrom: blue
colorTo: purple
sdk: static
pinned: false
app_file: dist/index.html
app_build_command: npm install && npm run build
---

# 🌊 Social Signal AI (formerly First Convo Starter)

Stop sending "Hey." Start sending messages that actually get replies.

Social Signal is a React-based AI application that generates unique, polite, and context-aware conversation starters. Unlike generic chatbots, it analyzes **relationship dynamics** (Stranger vs. Partner) and uses **Multimodal Vision AI** to scan uploaded images for conversation hooks.

### 🚀 Key Features
* **Relationship Context Engine:** Tailors tone strictly based on safety and closeness (e.g., prevents flirting with "Unknown" connections).
* **Visual Analysis:** Upload a photo, and the AI identifies background details (books, locations, pets) to ask smart questions.
* **Anti-Cringe Guard:** Specifically prompted to avoid generic pickup lines and boring small talk.
* **Privacy First:** Stateless processing—no images are stored.

### 🛠️ Tech Stack
* **Frontend:** React + TypeScript (Vite)
* **AI Model:** Google Gemini 1.5 Flash (via Gemini API)
* **Styling:** CSS / Tailwind
