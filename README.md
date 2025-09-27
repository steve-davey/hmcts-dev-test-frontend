# HMCTS Case Management Frontend

Modern web frontend for the HMCTS Case Management System built with Express.js, TypeScript, and the GOV.UK Design System. Provides an intuitive interface for caseworkers to manage legal cases efficiently.

## Features

- **Professional UI** using GOV.UK Design System components
- **Full CRUD Operations** for case management with real-time feedback
- **Responsive Design** works on desktop, tablet, and mobile devices
- **Form Validation** with client-side and server-side validation
- **Search Functionality** to find specific cases by ID
- **Status Management** with color-coded case status indicators
- **Real-time Updates** with automatic data refresh
- **Accessibility** built to WCAG 2.1 AA standards

## Tech Stack

- **Node.js 18+** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript development
- **Nunjucks** - Templating engine for server-side rendering
- **GOV.UK Frontend 4.8.0** - Government design system
- **Webpack** - Module bundling and asset compilation
- **Sass** - CSS preprocessing
- **Jest** - JavaScript testing framework
- **Codecept.js** - End-to-end testing with Playwright

## Quick Start

### Prerequisites
- Node.js 18+ with npm/yarn
- Backend service running on port 4000

### Installation and Setup

```bash
# Clone the repository
git clone https://github.com/steve-davey/hmcts-dev-test-frontend.git
cd hmcts-dev-test-frontend

# Install dependencies
yarn install

# Start development server
yarn start:dev
```

The application will be available at **http://localhost:3100**

### Available Scripts

```bash
# Development
yarn start:dev          # Start with hot-reload and file watching
yarn start              # Start production build

# Building
yarn build              # Build for development
yarn build:prod         # Build for production with optimizations

# Testing
yarn test               # Run unit tests
yarn test:coverage      # Run tests with coverage report
yarn test:routes        # Test API route handlers
yarn test:functional    # Run end-to-end tests

# Code Quality
yarn lint               # Check code style and errors
yarn lint:fix           # Fix automatically fixable issues
```

## Application Structure

### Page Structure

The application uses a tabbed interface with three main sections:

1. **All Cases Tab**
   - View all cases in a sortable table
   - Color-coded status indicators
   - Edit and delete actions for each case
   - Real-time data loading

2. **Create Case Tab**
   - Form to create new cases
   - Real-time validation feedback
   - Switches to edit mode when editing existing cases
   - All required and optional fields

3. **Search Cases Tab**
   - Search for specific cases by ID
   - Displays individual case results
   - Clear results functionality

### Directory Structure

```
src/
├── main/
│   ├── app.ts              # Main Express application setup
│   ├── server.ts           # Server startup configuration
│   ├── development.ts      # Development mode configuration
│   ├── assets/
│   │   ├── js/
│   │   │   ├── index.ts    # Main JavaScript entry point
│   │   │   └── case-management.js  # Case management logic
│   │   └── scss/
│   │       └── main.scss   # Main stylesheet
│   ├── modules/
│   │   └── nunjucks/       # Nunjucks templating setup
│   ├── routes/
│   │   └── home.ts         # Route handlers
│   └── views/
│       ├── template.njk    # Base template
│       ├── home.njk        # Main application page
│       ├── error.njk       # Error page
│       ├── not-found.njk   # 404 page
│       └── webpack/        # Webpack asset templates
├── test/
│   ├── functional/         # End-to-end tests
│   ├── routes/            # Route testing
│   ├── steps/             # Test step definitions
│   └── unit/              # Unit tests
```

## Case Management Features

### Case Form Fields

- **Case Number**: Unique alphanumeric identifier (required, 3-20 chars, A-Z 0-9)
- **Title**: Case name (required, 5-100 characters)
- **Description**: Detailed information (optional, max 500 characters)
- **Due Date**: Completion deadline (required, must be future date)
- **Status**: Current state with options:
  - **Open** (blue) - Ready for work
  - **In Progress** (yellow) - Being processed
  - **Closed** (green) - Completed
  - **Cancelled** (red) - Cancelled

### User Interface Features

- **Form Validation**: Real-time client-side validation with error messages
- **Auto-formatting**: Case numbers automatically converted to uppercase
- **Confirmation Dialogs**: Delete confirmations to prevent accidental data loss
- **Success/Error Messages**: Toast notifications for user actions
- **Responsive Tables**: Mobile-friendly case listing
- **Accessibility**: Screen reader support and keyboard navigation

### Data Flow

```
User Action → Frontend Validation → API Request → Backend Processing → Database → Response → UI Update
```

## API Integration

The frontend communicates with the backend REST API running on port 4000:

### Case Operations

```javascript
// Create new case
POST /api/cases
Content-Type: application/json
{
  "caseNumber": "ABC123",
  "title": "Case Title",
  "description": "Description",
  "status": "OPEN",
  "dueDate": "2024-12-31T17:00:00"
}

// Get all cases
GET /api/cases

// Get specific case
GET /api/cases/1

// Update case
PUT /api/cases/1

// Delete case
DELETE /api/cases/1
```

### Error Handling

The frontend handles various error scenarios:
- Network connectivity issues
- Validation errors from backend
- 404 Not Found responses
- Server errors with user-friendly messages

## Styling and Design

### GOV.UK Design System Integration

The application uses official GOV.UK components:
- Form elements (inputs, textareas, selects)
- Buttons and button groups
- Tables with proper markup
- Notification banners for messages
- Tab navigation components
- Status tags with appropriate colors

### Custom Styles

```scss
// Main stylesheet imports GOV.UK base
@import 'govuk-frontend';

// Custom overrides and additional styles added as needed
```

### Responsive Design

- **Desktop**: Full-width layout with sidebar navigation
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Stacked layout with collapsible navigation

## Form Validation

### Client-Side Validation

```javascript
// Example validation for case number
function validateCaseNumber(value) {
  const errors = [];
  if (!value.trim()) {
    errors.push('Case number is required');
  } else if (value.length < 3 || value.length > 20) {
    errors.push('Case number must be between 3 and 20 characters');
  } else if (!/^[A-Z0-9]+$/.test(value)) {
    errors.push('Case number must contain only uppercase letters and numbers');
  }
  return errors;
}
```

### Real-time Validation Features

- Input field validation on blur and input events
- Visual error states with red borders
- Error messages displayed below form fields
- Prevention of form submission when validation fails
- Auto-correction (e.g., case number to uppercase)

## Testing

### Unit Tests (Jest)

```bash
# Run all unit tests
yarn test

# Run with coverage
yarn test:coverage

# Watch mode for development
yarn test --watch
```

### Route Testing

```javascript
// Example route test
describe('Home page', () => {
  test('should return sample home page', async () => {
    await request(app)
      .get('/')
      .expect(res => expect(res.status).to.equal(200));
  });
});
```

### End-to-End Testing (Codecept.js)

```bash
# Run functional tests
yarn test:functional
```

Tests cover:
- Page loading and navigation
- Form submission workflows
- Case creation, editing, and deletion
- Error handling scenarios
- Search functionality

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Frontend server port | 3100 |
| `TEST_URL` | Backend API URL | http://localhost:4000 |

### Development Configuration

```javascript
// development.ts - Webpack dev middleware setup
const setupDev = (app, developmentMode) => {
  if (developmentMode) {
    const webpackDev = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackconfig = require('../../webpack.config');
    const compiler = webpack(webpackconfig);
    app.use(webpackDev(compiler, {
      publicPath: '/',
    }));
  }
};
```

## Accessibility

### WCAG 2.1 AA Compliance

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: Meets minimum contrast ratios
- **Focus Management**: Visible focus indicators
- **Error Handling**: Clear error messages and instructions

### Accessibility Features

- Form labels properly associated with inputs
- Error messages announced to screen readers
- Skip links for keyboard navigation
- Alternative text for visual elements
- High contrast colors for status indicators

## Performance Optimization

### Build Optimization

- **Webpack bundling** for optimal asset loading
- **CSS/JS minification** in production builds
- **Asset compression** for faster downloads
- **Cache headers** for static resources

### Runtime Performance

- **Efficient DOM updates** with targeted changes
- **Debounced search** to reduce API calls
- **Lazy loading** for large datasets
- **Optimized images** and assets

## Security Considerations

### Frontend Security

- **Input sanitization** before display
- **XSS prevention** with proper templating
- **CSRF protection** with token validation
- **Content Security Policy** headers
- **Secure cookie handling**

### API Communication

- **HTTPS enforcement** in production
- **Request validation** before sending to backend
- **Error message sanitization** to prevent information leakage

## Deployment

### Production Build

```bash
# Build optimized production assets
yarn build:prod

# Start production server
NODE_ENV=production yarn start
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn build:prod
EXPOSE 3100
CMD ["yarn", "start"]
```

### Environment-Specific Configuration

```javascript
// Proxy configuration for different environments
app.use('/api', createProxyMiddleware({
  target: process.env.API_URL || 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: { '^/api' : '' }
}));
```

## Troubleshooting

### Common Issues

**Port 3100 already in use**:
```bash
# Use different port
PORT=3101 yarn start:dev
```

**Backend API connection errors**:
- Verify backend is running on port 4000
- Check proxy configuration in `app.ts`
- Verify CORS settings on backend

**Asset loading issues**:
- Clear browser cache
- Rebuild assets with `yarn build`
- Check webpack configuration

**Form submission failures**:
- Check network tab for API errors
- Verify form validation is passing
- Check backend logs for detailed errors

### Development Tips

- Use browser dev tools for debugging
- Check console for JavaScript errors
- Monitor network requests for API issues
- Use React/Vue dev tools browser extensions
- Enable verbose logging in development mode

## Browser Support

### Supported Browsers

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Internet Explorer**: Not supported

### Progressive Enhancement

The application is built with progressive enhancement principles:
- Core functionality works without JavaScript
- Enhanced features added with JavaScript
- Graceful degradation for older browsers

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the full test suite (`yarn test && yarn test:functional`)
6. Check code style (`yarn lint`)
7. Commit your changes (`git commit -m 'Add new feature'`)
8. Push to the branch (`git push origin feature/new-feature`)
9. Open a Pull Request

### Code Standards

- **TypeScript**: Use proper typing for all new code
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Testing**: Write tests for all new functionality
- **Accessibility**: Ensure all new features meet accessibility standards
- **Documentation**: Update documentation for significant changes

### Adding New Features

When adding new functionality:

1. **Update Templates**: Modify Nunjucks templates for UI changes
2. **Add JavaScript**: Extend `case-management.js` for new interactions
3. **Style Components**: Add/modify SCSS for visual changes
4. **Write Tests**: Add unit and functional tests
5. **Update Routes**: Modify route handlers if needed
6. **Test Integration**: Verify frontend-backend communication

## Architecture Notes

### Proxy Configuration

The frontend uses `http-proxy-middleware` to forward API requests to the backend:

```javascript
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: { '^/api' : '' },
  logger: console
}));
```

This allows the frontend (port 3100) to make requests to `/api/*` which are forwarded to the backend (port 4000).

### Template Engine

Uses Nunjucks templating with GOV.UK components:

```javascript
// Nunjucks configuration
nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
  autoescape: true,
  watch: this.developmentMode,
  express: app,
});
```

### Asset Pipeline

Webpack handles asset compilation and bundling:
- **Entry Point**: `src/main/assets/js/index.ts`
- **Stylesheets**: `src/main/assets/scss/main.scss`
- **Output**: Compiled assets served by Express

## Monitoring and Debugging

### Debug Logging

Enable detailed logging by setting environment variables:

```bash
DEBUG=express:* yarn start:dev
```

### Performance Monitoring

Monitor key metrics in development:
- Page load times
- API response times
- JavaScript execution time
- Memory usage

### Error Tracking

The application includes comprehensive error handling:
- JavaScript errors caught and logged
- Network errors with user-friendly messages
- Form validation errors with specific guidance
- API errors transformed into actionable messages

## Future Enhancements

### Planned Features

- **Advanced Search**: Filter cases by multiple criteria
- **Bulk Operations**: Select and modify multiple cases
- **Export Functionality**: Download case data as CSV/PDF
- **Real-time Notifications**: WebSocket updates for case changes
- **Dashboard View**: Summary statistics and metrics
- **User Preferences**: Customizable interface options

### Technical Improvements

- **PWA Support**: Offline functionality and app installation
- **Internationalization**: Multi-language support
- **Theme Support**: Light/dark mode options
- **Advanced Caching**: Service worker implementation
- **Performance Monitoring**: Real user monitoring integration

## License

This project is developed for the HMCTS DTS Developer Challenge.

---

For technical questions about the frontend implementation, please check the inline code comments or refer to the backend repository for API-specific questions.