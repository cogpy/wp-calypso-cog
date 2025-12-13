# Orchestration Workbench

WordPress Autonomous Orchestration Workbench - A unified interface for creating and managing autonomous workflows.

## Overview

The Orchestration Workbench provides a comprehensive platform for WordPress users to:

- Create automated workflows for WordPress site management
- Monitor workflow execution and task completion
- Manage autonomous operations across multiple sites
- Track workflow performance and statistics

## Features

- **Dashboard View**: Overview of active workflows and statistics
- **Workflow Management**: Create, edit, and delete workflows
- **Task Monitoring**: Real-time tracking of task execution
- **Performance Metrics**: Insights into workflow efficiency
- **Multi-site Support**: Orchestrate tasks across multiple WordPress installations

## Development

### Prerequisites

- Node.js ^v22.9.0
- Yarn ^4.0.0

### Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

### Testing

Run tests with:
```bash
yarn test-apps
```

## Architecture

The app follows the standard Calypso app structure:

- `src/app.jsx` - Main entry point
- `src/pages/` - Page components
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions
- `src/styles/` - Global styles and variables

## Technologies

- React 18
- Redux for state management
- WordPress Components (@wordpress/components)
- i18n-calypso for internationalization
- SCSS for styling

## Contributing

Please follow the [Calypso contributing guidelines](../../docs/CONTRIBUTING.md) when making changes to this app.

## License

GPL-2.0-or-later
