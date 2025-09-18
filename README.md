# Adform Frontend Assignment – Campaign Manager

A simple React + Redux Toolkit application that displays a list of campaigns, allows filtering by name and date range, and supports adding new campaigns interactively.

Built with **React 18, Redux Toolkit, Material-UI (MUI)**, and tested with **Jest + React Testing Library**.

---

## Features

- 📋 **Campaign Table** showing:

  - Campaign Name
  - Start & End Dates
  - Active status (green/red based on current date)
  - Budget (formatted in USD)
  - Associated User name (resolved from external API, or `Unknown User`)

- **Search campaigns** by name (instant filtering).
- **Filter campaigns** by start and end date with validation (end ≥ start).
- **Add new campaigns** via a modal form with validation.
- **Global function** `window.AddCampaigns([...])` available in browser console to append new campaigns dynamically.
- **User data fetched** from [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users) (via Redux Thunk).
- **Loading & error handling** states for API calls.
- **Unit & integration tests** with Jest.

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/adform-assignment.git
cd adform-assignment

2. Install dependencies
npm install

3. Run the app
npm run dev


4. Run all tests:
npm run test


Tests include:
Reducer unit test (campaignsSlice)
Integration test (open modal, add campaign, verify in table)

```
