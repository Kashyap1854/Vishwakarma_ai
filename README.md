# Vishwakarma AI

Vishwakarma AI is a modern web application built using React and Vite. This project aims to provide a fast and efficient development environment for building scalable and interactive user interfaces.

## Features

- **React + Vite**: Combines the power of React with the speed of Vite for a seamless development experience.
- **Hot Module Replacement (HMR)**: Instant updates during development.
- **ESLint Integration**: Ensures code quality and consistency.
- **Scalable Architecture**: Designed for easy extension and maintenance.

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/vishwakarma-ai.git
   ```

2. Navigate to the project directory:

   ```bash
   cd vishwakarma-ai
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
├── public/          # Static assets
├── server/          # Backend server files
├── src/             # Frontend source code
│   ├── assets/      # Images, fonts, etc.
│   ├── App.jsx      # Main React component
│   ├── main.jsx     # Entry point
│   └── styles/      # CSS files
├── package.json     # Project metadata and scripts
├── vite.config.js   # Vite configuration
└── README.md        # Project documentation
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ by the Vishwakarma AI team.

# Vishwakarma

Indian Monument Recognition AI for monument recognition from images using CLIP embeddings, FAISS similarity search, and a Streamlit interface.

## Overview

Vishwakarma predicts an Indian monument from an uploaded image and shows:

- Monument name
- Structured metadata (architecture, built period, builder, location)
- Short Wikipedia-based description

The system uses an image retrieval approach:

- CLIP ViT-B/32 generates image embeddings
- FAISS searches nearest embeddings in the monument index
- The top match label is returned as the prediction

## Features

- Monument recognition from uploaded images
- Fast similarity search with FAISS
- Pre-collected dataset structure for multiple Indian monuments
- Metadata lookup from JSON
- Optional local LLM utility for extracting structured metadata from free text

## Tech Stack

- Python
- PyTorch
- CLIP (clip-anytorch)
- FAISS
- Streamlit
- Pillow, NumPy

## Project Structure

- app.py: Streamlit app UI and prediction display
- search.py: Query image embedding + FAISS nearest-neighbor search
- extract_features.py: Build embeddings and create FAISS index
- download_dataset.py: Download broad monument image dataset
- build_dataset.py: Curated keyword-based dataset building
- llm_extractor.py: Optional Ollama-based structured metadata extraction
- req.txt: Python package list
- requirements.json: Monument metadata database (not pip dependencies)
- dataset/: Monument image folders
- monument_index.faiss: Serialized FAISS index
- labels.npy: Label mapping aligned to FAISS vectors

## Installation

Create and activate a virtual environment.

Install dependencies:

```bash
pip install -r req.txt
```

Install additional packages used by scripts (if missing in your environment):

```bash
pip install faiss-cpu icrawler wikipedia ollama
```

## Quick Start

If index files are not present, generate them from dataset images:

```bash
python extract_features.py
```

This will create two files - features.npy, labels.npy

Run the web app:

```bash
streamlit run app.py
```

Open the local Streamlit URL shown in terminal, upload an image, and view prediction results.

## Dataset Workflow

You can use either script depending on your strategy:

Broad collection:

```bash
python download_dataset.py
```

Curated keyword collection:

```bash
python build_dataset.py
```

Rebuild embeddings and index after dataset updates:

```bash
python extract_features.py
```

## Inference Flow

1. User uploads image in the Streamlit app.
2. The image is preprocessed with CLIP transforms.
3. CLIP encoder generates a feature vector.
4. FAISS returns the nearest indexed vector.
5. Predicted label is mapped to monument name.
6. Metadata is loaded from requirements.json.
7. Wikipedia summary is fetched and displayed.

## Optional: Local LLM Metadata Extraction

llm_extractor.py uses Ollama with a local Mistral model to extract:

- Architecture
- Built
- Builder
- Location

Example setup:

Install Ollama.

Pull a model:

```bash
ollama pull mistral
```

Run extraction utility from Python code where needed.

## Notes

- requirements.json is a monument info database, not a dependency file.
- The app expects monument labels from FAISS to align with keys/normalized names used in metadata lookup.
- If prediction name formatting differs from metadata keys, details may show as not found.

## Troubleshooting

Missing module errors:
Install the missing package with pip and rerun.

FAISS index read error:
Regenerate index with (results in creating monument_index.faiss file):

```bash
python extract_features.py
```

Empty or poor predictions:
Verify dataset quality and ensure index was rebuilt after dataset changes.

Wikipedia summary not available:
This is handled in app fallback; prediction still works.

## Future Improvements

- Add top-k predictions with confidence-like similarity scores
- Add evaluation metrics on a held-out test split
- Improve label normalization between predicted class names and metadata keys
- Add Docker support and reproducible setup scripts
