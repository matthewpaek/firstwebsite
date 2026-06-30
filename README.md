# Matthew Paek - Portfolio Homepage

A clean, modern portfolio website showcasing UX design and development work. Features a responsive design with dark mode support and an industrial aesthetic.

## Features

- **Responsive Design**: Mobile-first approach that works seamlessly on all device sizes
- **Dark Mode**: Toggle between light and dark themes with persistent user preference storage
- **Industrial Design**: Clean, minimalist aesthetic with neutral color palette
- **Project Showcase**: Featured projects section with project cards, descriptions, and tags
- **Career Timeline**: Interactive timeline on the About page displaying career progression
- **Performance Optimized**: Lightweight, fast-loading pages with smooth transitions
- **Accessibility**: Semantic HTML and ARIA labels for better accessibility

## Project Structure

```
myhomepage/
├── index.html          # Homepage with hero section and featured projects
├── about.html          # About page with career timeline
├── styles.css          # Central stylesheet with CSS variables for theming
├── app.js              # JavaScript for dark mode toggle and weather display
├── README.md           # Project documentation
└── 062-WVq9rEaHPx0.jpeg # Profile photo
```

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: CSS variables, flexbox, grid, and media queries for responsive design
- **JavaScript**: Dark mode toggle with localStorage persistence
- **No External Dependencies**: Pure vanilla implementation

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd myhomepage
```

2. Open in browser:
```bash
# Simply open index.html in your web browser
# Or use a local server (recommended)
python -m http.server 8000  # Python 3
# Navigate to http://localhost:8000
```

## Usage

### Dark Mode Toggle

The dark mode toggle button is located in the top navigation bar. Click the moon/sun icon to switch between light and dark themes. Your preference is automatically saved to browser localStorage.

### Navigation

- **Home**: Click the logo or "Home" link to return to the homepage
- **About**: Learn more about the creator and view the career timeline
- **Get In Touch**: Call-to-action button that navigates to the About page

## Features Explained

### Dark Mode Implementation

Dark mode uses CSS variables that switch between light and dark color schemes:
- **Light Mode**: `--bg-primary: #f5f5f5`, `--text-primary: #2c2c2c`
- **Dark Mode**: `--bg-primary: #1a1a1a`, `--text-primary: #e8e8e8`

The preference is stored in localStorage and restored on page load.

### Responsive Grid

Projects grid uses CSS Grid with `auto-fit` allowing cards to responsively resize based on viewport width:
```css
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
```

### Career Timeline

The timeline features a vertical line with circular markers indicating career stages. Each timeline item includes:
- Date range
- Job title
- Description
- Smooth transition animations

## Color Palette

### Light Mode
- Primary Background: `#f5f5f5`
- Secondary Background: `#ffffff`
- Primary Text: `#2c2c2c`
- Secondary Text: `#666`
- Border Color: `#e0e0e0`

### Dark Mode
- Primary Background: `#1a1a1a`
- Secondary Background: `#262626`
- Primary Text: `#e8e8e8`
- Secondary Text: `#b0b0b0`
- Border Color: `#404040`

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (iOS Safari, Chrome Mobile, etc.)

## Customization

### Adding New Projects

Edit `index.html` and add a new project card to the projects grid:

```html
<div class="project-card">
  <div class="project-image project-4"></div>
  <h3>Your Project Title</h3>
  <p class="project-type">Project Type</p>
  <p class="project-description">Your project description here.</p>
  <div class="project-tags">
    <span class="tag">Tag 1</span>
    <span class="tag">Tag 2</span>
  </div>
</div>
```

Add corresponding CSS in `styles.css`:
```css
.project-4 {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

### Modifying Colors

Update CSS variables in `styles.css`:
```css
:root {
  --bg-primary: #your-color;
  --text-primary: #your-color;
  /* ... more variables */
}
```

## Performance Considerations

- Minimal CSS and JS - no external libraries
- Smooth 0.3s transitions for better UX
- CSS Grid and Flexbox for efficient layouts
- localStorage for instant theme preference loading

## Future Enhancements

- [ ] Contact form integration
- [ ] Blog or articles section
- [ ] Testimonials section
- [ ] Skills/expertise cards
- [ ] Animation library integration
- [ ] Image optimization/lazy loading
- [ ] SEO meta tags optimization

## License

This project is open source and available under the MIT License.

## Author

**Matthew Paek** - UX Designer & Developer

## Contact

For inquiries or collaboration opportunities, visit the About page or use the Get In Touch button.

---

**Last Updated**: June 29, 2026