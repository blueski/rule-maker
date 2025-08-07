# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. If you have questions at any point don't hesitate to ask them.

## Repository Overview

This repository is for a web app that analyzes credit card transaction data and creates rules to detect fradulent transactions (with a minimum of false positives).

All code should be well structured and modular, to allow easy changes and additions by AI and human editors.

Components
- The Data Explorer tab allows the user to view the transaction data and filter it.
- The Rules tab allows the user to create and manage fraud rules to detect fraudulent transactions.

It should be styled as a polished financial analysis SaaS app.

Same data is provided as a CSV dataset (`data.csv`) with financial transaction data for fraud detection and rule tuning analysis. The dataset is approximately 9MB and contains transaction records with fields including user IDs, transaction details, merchant information, and fraud indicators.

## Data Structure

The main dataset (`data.csv`) contains transaction records with the following key fields:
- Transaction identifiers (user_id, transaction_id, txn_date_time)
- Transaction details (state, action, type, amounts, currencies)
- Merchant information (merchant_id, merchant_name, mcc, merchant_country)
- Fraud detection fields (fraud, rule_1-rule_5, decline, outcome)
- Payment methods and processing codes

## Working with the Data

When analyzing the dataset:
- The file is large (9MB) - use offset/limit parameters when reading with the Read tool
- Use Grep tool to search for specific patterns or values within the dataset
- The dataset appears to contain synthetic financial transaction data for fraud detection research
- Key outcome indicators are in the 'fraud', 'decline', and 'outcome' columns

## Development Setup

To run the development server:
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
npm run preview
```

## Architecture

The application is built with:
- **React 18** with Vite for fast development and building
- **Tailwind CSS** for styling with custom component classes
- **Papa Parse** for efficient CSV parsing
- **Lucide React** for modern icons

### Component Structure
- `App.jsx` - Main application with data management and state
- `Header.jsx` - Navigation header component
- `StatsCards.jsx` - Dashboard statistics display
- `FilterControls.jsx` - Search and filter interface
- `DataTable.jsx` - Paginated data table with sorting

### Key Features
- Responsive design optimized for financial SaaS applications
- Real-time filtering and search across all transaction fields
- Column sorting with visual indicators
- Pagination for large datasets (50 records per page)
- Color-coded status badges for fraud detection
- Professional styling with Tailwind CSS custom classes

## Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality