# Data Djinn 🧞‍♂️

An AI-powered data analysis platform that helps non-technical users understand their data and generate industry-specific solutions using edge AI (WebLLM).

## Features

- **Upload Any Data**: Support for CSV, Excel, JSON, and text files
- **20+ Industry Verticals**: Comprehensive coverage including:
  - Healthcare & Life Sciences
  - Manufacturing & Industrial
  - E-commerce & Retail
  - Finance & Banking
  - Aerospace & Defense
  - And 15+ more industries
- **Edge AI Processing**: All analysis runs locally using WebLLM - no data sent to external servers
- **Smart Recommendations**: AI suggests additional datasets to enhance analysis
- **Solution Generation**: Creates comprehensive, actionable solutions for your specific use case

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **AI Model**: WebLLM (Llama 3.2 3B running on-device)
- **Database**: Neon Postgres (serverless)
- **Backend**: Netlify Functions
- **File Processing**: PapaParse (CSV), XLSX (Excel)
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Netlify account (for deployment)
- Neon account (optional - for data persistence)

### Local Development

1. Clone the repository:
```bash
cd data-djinn
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env.local
```

If you want data persistence, edit `.env.local` and add your Neon database URL:
```
DATABASE_URL="postgresql://username:password@ep-example.region.aws.neon.tech/dbname?sslmode=require"
```

4. Set up the database (optional):
   - Create a new database in Neon
   - Run: `npm run migrate`

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Deployment to Netlify

1. Push your code to GitHub

2. Connect your GitHub repository to Netlify

3. Configure environment variables in Netlify (optional):
   - `DATABASE_URL`: Your Neon database connection string (only if you want data persistence)

4. Deploy! Netlify will automatically build and deploy your application

**Note**: The app works perfectly without a database. Adding DATABASE_URL enables saving analyses for later viewing.

## Usage Flow

1. **Upload Data**: Drag and drop any supported data file
2. **Select Industry**: Choose from 20+ industry verticals
3. **AI Analysis**: The local AI model analyzes your data and provides insights
4. **Add Datasets**: Upload recommended additional datasets to enhance analysis
5. **Generate Solution**: Get a comprehensive solution tailored to your industry and data

## Project Structure

```
data-djinn/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── FileUpload.tsx     # File upload component
│   ├── VerticalSelector.tsx # Industry selection
│   ├── DataAnalysis.tsx   # Data analysis view
│   ├── DatasetRecommendations.tsx # Dataset recommendations
│   ├── SolutionGenerator.tsx # Solution generation
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utility functions
│   ├── verticals.ts      # Industry verticals data
│   ├── file-parser.ts    # File parsing utilities
│   ├── webllm-client.ts  # WebLLM integration
│   └── database/         # Database schema
├── netlify/              # Netlify functions
│   └── functions/        # Serverless functions
├── store/                # State management
│   └── app-store.ts      # Zustand store
└── public/               # Static assets
```

## Privacy & Security

- **100% Local AI Processing**: All AI analysis happens on your device using WebLLM
- **No Data Upload**: Your data files are never sent to external servers
- **Optional Cloud Storage**: Database storage is optional and only for saving analysis results
- **Secure by Design**: Built with privacy-first principles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.