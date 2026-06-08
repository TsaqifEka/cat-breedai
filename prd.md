Product Requirement Document (PRD) — CatBreedScanAI
1. Project Overview
CatBreedScanAI is a Computer Vision web application designed to classify cat images by breed using a pre-trained Deep Learning model (EfficientNetB0 trained on the Oxford-IIIT Pet Dataset via transfer learning). The system features a two-stage Machine Learning pipeline: first detecting whether an uploaded image contains a cat at all, then identifying the specific breed from seven target classes.
The backend is a Python Flask API serving two Keras models. The frontend is a lightweight, modern React.js Single Page Application (SPA) designed for both desktop and mobile users.
Problem Statement
Existing pet identification apps are either too generic ("this is a cat") or overloaded with features. There is no lightweight, fast, and accurate tool specifically for identifying common cat breeds from a simple photo upload, with clear rejection of non-cat images.
Objective
Build a complete full-stack AI product with a React.js frontend and Flask backend, deployable on Vercel (frontend) and any cloud platform (backend), that delivers instant cat breed classification with a polished, premium user experience.


2. Target Audience & Personas
Cat Owners & Adopters: People who found a stray cat and want to know its breed before adopting or visiting a vet.
Pet Shop Enthusiasts: Buyers verifying if a claimed "Persian" or "Maine Coon" kitten is genuine.
Mobile Users: Users on the spot wanting to quickly snap a photo of a cat using their phone camera and get an instant classification.
Veterinary Students: Learners using the app as a visual reference tool for breed identification training.


3. Key Functional Requirements
FR-1: Image Input Methods
Drag-and-Drop / File Picker: Desktop and mobile users can select any image file (PNG, JPG, JPEG) to classify.
Camera Integration:
Desktop: Access the user's webcam with a live preview stream and capture button.
Mobile: Automatically launch the system camera using the rear lens (environment) by default.
FR-2: Two-Stage AI Classification Pipeline
Stage 1 — Cat Detector: Binary classification (Cat vs Not-Cat). If the input is not a cat, the system must immediately reject it with a clear message: "It's not a cat, please input a cat."
Stage 2 — Breed Classifier: Multi-class classification across 7 target breeds. Only executes if Stage 1 passes with confidence ≥ 60%.
Dual-Gate Safety: Stage 2 must also have a minimum confidence threshold (≥ 50%) to prevent dogs that sneak past Stage 1 from receiving fake breed labels.
FR-3: Bilingual Interface (EN / ID)
Default language toggle in the header to switch between English (EN) and Indonesian (ID) instantly across all labels, descriptions, and results.
Language strings mapping:
Persian ➔ Persian (Kucing Persia)
Bengal ➔ Bengal (Kucing Bengal)
British Shorthair ➔ British Shorthair (Kucing British)
Siamese ➔ Siamese (Kucing Siam)
Maine Coon ➔ Maine Coon (Kucing Maine Coon)
Sphynx ➔ Sphynx (Kucing Sphynx)
Ragdoll ➔ Ragdoll (Kucing Ragdoll)
FR-4: Classification Execution & Result Display
Send the selected/captured image to the /predict API route via a POST request containing a multipart file form.
Loading State: Provide a smooth skeleton loading screen or spinner with changing cat facts while waiting for the response.
Result Presentation:
Clean card styling showing the classification label.
An animated circular gauge or percentage ring showing the prediction confidence.
Custom themed backgrounds: soft emerald green for fluffy breeds (Persian, Ragdoll, Maine Coon), soft blue for sleek breeds (Siamese, Sphynx), warm amber for spotted breeds (Bengal, British Shorthair).
A "Scan Another" action button to reset the view.
Top-3 predictions displayed as confidence bars for transparency.
FR-5: Non-Cat Rejection UX
When a non-cat image is detected, display a friendly rejection card with a red theme.
Show the Stage 1 confidence score (e.g., "Cat confidence: 2%") to explain why it was rejected.
Do not attempt breed classification on rejected images.
4. User Interface & Design Guidelines
Theme: Deep Forest / Eco Dark Mode
Primary Background: #081310 (Extremely dark teal-green)
Secondary Card Surfaces: #0e201b
Accents:
#34d399 (Emerald green) — for fluffy breeds and interactive elements
#38bdf8 (Sky blue) — for sleek breeds and secondary actions
#f59e0b (Amber) — for spotted/mixed breeds
#ef4444 (Red) — for non-cat rejection states
Typography: Outfit or Plus Jakarta Sans via Google Fonts.
Micro-interactions: Hover expansions, smooth transition fades, scale animations on card actions, and circular gauge animations on result display.
Responsive Breakpoints
Mobile: 320px – 768px (full-width cards, stacked layout)
Tablet: 768px – 1024px (2-column grid for results)
Desktop: 1024px+ (centered max-width 600px layout)
5. Technical Specifications
Frontend Stack
Framework: React 18+ via Vite (extremely fast development and build times)
Language: JavaScript (ES6+) or TypeScript (optional)
Styling: Custom CSS with CSS variables for complete flexibility and visual excellence. No heavy UI frameworks (keep it lightweight).
HTTP Client: Axios for API communication
State Management: React useState and useContext (no Redux needed for a single-page app)
Icons: Lucide React or Heroicons
Deployment: Vercel (static site hosting)
CORS: Vite dev server proxy configuration targeting http://localhost:5000 to avoid local cross-origin blocks during development.
Backend Stack
Language: Python 3.11+
Framework: Flask web framework
Dependencies: tensorflow, keras, pillow, numpy, flask-cors
Models: Two Keras .keras files:
stage1_cat_detector.keras — Binary classifier (EfficientNetB0, frozen)
stage2_breed_classifier.keras — 7-class classifier (EfficientNetB0, frozen)
Endpoint: POST /predict returning JSON (see Section 6)
Health Check: GET /health for deployment monitoring
Deployment: Can run on any VPS, AWS EC2, Google Cloud Run, or Render.com. Vercel is frontend-only and cannot host Python Flask.
Machine Learning Specifications
Dataset: Oxford-IIIT Pet Dataset (3,680 train + 3,669 test images, 37 pet breeds)
Target Breeds (7 classes): Persian, Bengal, British Shorthair, Siamese, Maine Coon, Sphynx, Ragdoll
Architecture: EfficientNetB0 with ImageNet weights, fully frozen base
Input Shape: 224 × 224 × 3
Preprocessing: tf.image.resize + tf.cast(image, tf.float32) (EfficientNetB0 has built-in rescaling)
Stage 1 Accuracy: ~99.6% (binary: cat vs not-cat)
Stage 2 Validation Accuracy: ~85–97% (7-class fine-grained)
Inference Time: ~200–400ms per image on CPU, ~50–100ms on GPU
6. API Specification
POST /predict
Content-Type: multipart/form-data
Request:
plain
file: <image_file>  (PNG, JPG, JPEG; max 16MB)
Success Response (Cat Detected):
JSON
{
  "success": true,
  "is_cat": true,
  "message": "This is a Persian cat",
  "cat_confidence": 98.5,
  "breed": "Persian",
  "breed_confidence": 87.3,
  "top_3_predictions": [
    {"breed": "Persian", "confidence": 87.3},
    {"breed": "Ragdoll", "confidence": 8.1},
    {"breed": "British_Shorthair", "confidence": 3.2}
  ]
}
Success Response (Not a Cat):
JSON
{
  "success": true,
  "is_cat": false,
  "message": "It's not a cat, please input a cat",
  "cat_confidence": 2.1,
  "breed": null,
  "breed_confidence": null,
  "top_3_predictions": null
}
Error Response:
JSON
{
  "success": false,
  "error": "No file uploaded"
}
GET /health
Response:
JSON
{
  "status": "ok",
  "models_loaded": true
}
7. User Experience Flow
plain
┌────────────────────────────────────────────────────────┐
│           1. User lands on CatBreedScanAI              │
│      - Views dark-themed scan dashboard               │
│      - Toggle language (EN ⇄ ID) if preferred          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            2. Input Choice selection                   │
│       ┌──────────────────┴──────────────────┐          │
│       ▼                                     ▼          │
│  [Upload Photo]                     [Capture Camera]   │
│  - Drag & drop image                - Direct camera      │
│  - File selector fallback           - Mobile rear capture│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                3. Image Processing                     │
│           - Fast transition image preview              │
│           - POST request trigger to Flask /predict     │
│           - Loading animation + random cat facts       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│         4. Dynamic Classification Result               │
│           ┌──────────────────┴──────────────────┐      │
│           ▼                                     ▼      │
│     [Cat Detected]                        [Not a Cat]    │
│  - Color-coded breed card              - Red rejection │
│  - Confidence ring gauge               - Explanation   │
│  - Top-3 prediction bars               - "Try Again"   │
│  - "Scan Another" button               - "Scan Another"│
└────────────────────────────────────────────────────────┘
8. Deployment Architecture
plain
┌─────────────────┐         ┌──────────────────┐
│   Vercel (FE)   │ ──────▶ │  Flask API (BE)  │
│  React + Vite   │   CORS  │  Python + TF     │
│  Static Hosting │         │  VPS / Cloud Run │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Model Files     │
                            │  .keras (x2)     │
                            │  metadata.json   │
                            └──────────────────┘
Frontend Deployment (Vercel)
Push React code to GitHub
Connect repo to Vercel dashboard
Set environment variable: VITE_API_URL=https://your-backend-url.com
Auto-deploy on every git push
Backend Deployment Options
Render.com: Free tier supports Python Flask + persistent disk for model files
Google Cloud Run: Serverless, scales to zero, pay-per-use
AWS EC2: Full control, suitable for GPU inference if needed
Railway.app: Simple deployment with environment variable management
9. File Structure
Frontend (React + Vite)
plain
cat-breed-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Dropzone.jsx
│   │   ├── ResultCard.jsx
│   │   ├── ConfidenceRing.jsx
│   │   ├── TopPredictions.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   └── usePrediction.js
│   ├── context/
│   │   └── LanguageContext.jsx
│   ├── i18n/
│   │   ├── en.json
│   │   └── id.json
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── vercel.json
Backend (Flask)
plain
cat_breed_api/
├── app.py
├── stage1_cat_detector.keras
├── stage2_breed_classifier.keras
├── model_metadata.json
├── uploads/               (temp folder, auto-created)
└── requirements.txt
10. Future Scope & Roadmap Ideas
TensorFlow.js Porting: Run the model client-side in the browser using WebAssembly to eliminate the Python backend entirely, enabling serverless static deployment on Vercel.
Multi-class Expansion: Add more breeds (Abyssinian, Birman, Bombay, Russian Blue, etc.) and support mixed-breed probability scoring.
Cat Health Indicator: Integrate a secondary model that flags potential skin conditions or eye abnormalities from the uploaded image.
Social Sharing: Allow users to share their cat's breed result card directly to Instagram/Twitter with generated image overlays.
Indonesian Local Breeds: Add Kucing Kampung (domestic shorthair) as a class by scraping local Indonesian cat images from social media.
11. Success Metrics
Table
Metric	Target
Stage 1 Accuracy (Cat/Not-Cat)	≥ 95%
Stage 2 Validation Accuracy	≥ 80%
API Response Time	< 500ms
Frontend Load Time	< 2s
Mobile Usability Score	≥ 90/100
User Retention (Scan Another clicks)	≥ 60%
Document Version: 1.0
Last Updated: 2026-06-07
Author: CatBreedScanAI Team