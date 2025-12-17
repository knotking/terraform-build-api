# TerraForge AI 🛠️☁️

**TerraForge AI** is an intelligent, AI-powered development environment designed specifically for **Terraform** Infrastructure as Code (IaC). Built with React and powered by Google's **Gemini 2.5 Flash** model, it streamlines the process of creating, refactoring, and auditing cloud infrastructure.

![TerraForge AI](https://placehold.co/800x400/0f172a/22c55e?text=TerraForge+AI)

## 🚀 Key Features

*   **✨ Generate Infrastructure**: Describe your desired infrastructure in plain English (e.g., "AWS VPC with an EKS cluster"), and TerraForge will generate valid, production-ready HCL code.
*   **🔄 Edit & Refactor**: Paste existing Terraform code and provide natural language instructions to modify it (e.g., "Upgrade instance types to t3.medium and add tags").
*   **🛡️ Security Analysis**: specialized analysis mode that scans your code for security vulnerabilities, cost implications, and best practice deviations.
*   **📜 Session History**: Automatically saves your generation and analysis sessions locally, allowing you to review and restore previous work.
*   **⚡ Real-time Stream**: Leverages Gemini 2.5 Flash for high-speed inference.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash via `@google/genai` SDK
*   **Icons**: Lucide React
*   **Markdown Rendering**: `react-markdown`

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/terraforge-ai.git
    cd terraforge-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    TerraForge AI requires a Google Gemini API Key.
    Create a `.env` file in the root directory (or configure your environment variables):
    ```env
    API_KEY=your_gemini_api_key_here
    ```
    *Note: Get your key from [Google AI Studio](https://aistudio.google.com/).*

4.  **Run the application**
    ```bash
    npm start
    ```

## 📖 Usage Guide

### 1. Generation Mode
Select the **Hammer** icon in the sidebar.
*   **Input**: "Create a GCP storage bucket with versioning enabled and a lifecycle policy to delete objects after 30 days."
*   **Action**: Click "Generate Code".
*   **Result**: Complete `main.tf` configuration.

### 2. Edit Mode
Select the **Edit** icon.
*   **Input**: Paste your existing Terraform code.
*   **Instructions**: "Change the region to us-east-1 and ensure all S3 buckets have encryption enabled."
*   **Action**: Click "Apply Changes".

### 3. Analyze Mode
Select the **Shield** icon.
*   **Input**: Paste Terraform code.
*   **Action**: Click "Run Analysis".
*   **Result**: A detailed Markdown report highlighting Security risks (Critical/High/Low), Cost estimates, and Style guide violations.

### 4. History
Select the **Clock** icon.
*   View a timeline of your interactions.
*   Click any history item to restore the workspace to that state.

## 📂 Project Structure

```
terraforge-ai/
├── components/          # React UI components
│   ├── CodeViewer.tsx   # Syntax highlighting & Markdown renderer
│   ├── HistoryView.tsx  # History list & management
│   └── Sidebar.tsx      # Application navigation
├── services/            # Logic & API integration
│   ├── geminiService.ts # Google GenAI SDK integration
│   └── historyService.ts# LocalStorage management
├── types.ts             # TypeScript definitions
├── App.tsx              # Main application layout
├── index.tsx            # Entry point
└── styles.css           # Global styles (if any)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.