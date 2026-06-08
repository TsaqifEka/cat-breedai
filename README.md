# Feline Breed Analyzer 🐾

An advanced, AI-powered web application that accurately identifies cat breeds from user-uploaded images or live camera captures. Built with a responsive, modern glassmorphism UI.

## Features ✨

* **Dual Input Modes:** Effortlessly toggle between uploading images (drag & drop or browse) and using a live webcam to snap a photo directly from your device.
* **Smart Camera Fallback:** On mobile devices, seamlessly opens your native camera app for high-quality photos. On desktop, instantly grabs your active webcam stream.
* **Bilingual Support (EN/ID):** Instantly toggle between English and Indonesian interfaces.
* **Animated & Earthy UI:** Features a warm cream, caramel, and yellow earth-tone palette with an animated, floating paw-print background for a delightful user experience.
* **Real-time AI Inference:** Built to connect seamlessly with a Python/Flask backend that processes images through a custom-trained Keras/TensorFlow model (`stage1_local.h5` and `stage2_local.h5`).

## Tech Stack 🛠️

**Frontend:**
* React (Vite)
* Vanilla CSS with CSS Variables & Keyframe Animations
* Lucide-React (Icons)

**Backend / Model (Not included in this repo directly):**
* Python / Flask
* TensorFlow / Keras (CNN for breed classification)

## Getting Started 🚀

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cat-breed-analyzer.git
   cd cat-breed-analyzer/cat-breed-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view the app in your browser!

### Connecting the Backend
This frontend is configured to proxy API requests to `http://localhost:5000`. Ensure your Python Flask API is running locally on port 5000 to enable the breed prediction endpoint (`/predict`).

## License 📄
This project is licensed under the MIT License.
