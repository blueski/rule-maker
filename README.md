# RuleTune

A professional fraud detection analysis platform for credit card transaction data. RuleTune provides comprehensive tools for analyzing transaction patterns, creating fraud detection rules, and monitoring financial data with enterprise-grade security and user experience.

## Features

### 🔍 Data Explorer
- **Interactive Data Analysis**: Browse and analyze large datasets of financial transactions
- **Advanced Filtering**: Search across all fields with real-time filtering capabilities
- **Smart Statistics**: Overview cards showing fraud rates, decline statistics, and key metrics
- **Professional Data Table**: Sortable columns, pagination, and responsive design

### 📋 Rules Management
- **Dynamic Rule Builder**: Create complex fraud detection rules with intuitive UI
- **Conditional Logic**: Support for AND/OR logic between multiple filter conditions
- **Rule Templates**: Duplicate and modify existing rules for efficiency
- **Persistent Storage**: Rules are saved locally and persist across sessions

### 🔐 Security & Quality
- **Authentication Required**: Basic authentication protects access to sensitive financial data
- **Session Management**: Persistent login state with secure credential validation
- **Error Boundaries**: Graceful error recovery with detailed debugging information
- **Comprehensive Testing**: 24+ unit tests covering services and utilities
- **Error Handling**: Professional user notifications and retry logic

### 🎨 Professional Design
- **Financial SaaS Styling**: Black/white contrast design optimized for clarity
- **Responsive Layout**: Works seamlessly across desktop and mobile devices
- **Accessibility Focus**: Professional typography and interaction patterns

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast development and optimized production builds
- **Tailwind CSS** - Professional styling with custom design system
- **Papa Parse** - Efficient CSV data processing
- **Lucide React** - Modern icon library
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rjm-ruletune.git
cd rjm-ruletune
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`


## Data Format

The application expects CSV data with the following key fields:
- Transaction identifiers (user_id, transaction_id, txn_date_time)
- Transaction details (state, action, type, amounts, currencies)
- Merchant information (merchant_id, merchant_name, mcc, merchant_country)
- Fraud indicators (fraud, rule_1-rule_5, decline, outcome)

Place your CSV data file as `public/data.csv` for automatic loading.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run deploy` - Deploy to GitHub Pages

## Deployment

### GitHub Pages
The project is configured for GitHub Pages deployment:

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings (Source: GitHub Actions)
3. The app will automatically deploy on pushes to the main branch

### Manual Deployment
```bash
npm run build
npm run deploy
```

## Project Structure

```
src/
├── components/          # React UI components
├── contexts/           # Global state management (toasts, etc.)
├── hooks/              # Custom React hooks (useDataTable, useRules)
├── services/           # Data access layer (API calls, localStorage)
├── utils/              # Pure utility functions
└── test/               # Test setup and utilities
```

For detailed architecture information and development guidance, see:
- **[Engineer's Guide](./engineer-intro.md)** - Comprehensive introduction for developers
- **[Architecture Documentation](./architecture.md)** - Technical architecture details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the GitHub repository.