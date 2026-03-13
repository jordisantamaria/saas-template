# Custom Themes

To create a theme for a client project, create a CSS file that overrides the primary color variables.

## How to use

In your app's CSS file:

```css
@import "@nyxidiom/ui/globals.css";
@import "@nyxidiom/ui/themes/fintech.css"; /* or your custom theme */
```

## How to create a new theme

1. Copy one of the existing theme files
2. Replace the OKLCH color values for `--color-primary` and related variables
3. Use https://oklch.com to pick colors

## Variables to override

| Variable | Purpose |
|----------|---------|
| `--color-primary` | Main brand color (buttons, links, focus rings) |
| `--color-primary-foreground` | Text on primary background |
| `--color-ring` | Focus ring color |
| `--color-sidebar-primary` | Active item in sidebar |
| `--color-sidebar-primary-foreground` | Text on sidebar active item |
| `--color-chart-1` | Primary chart color |

## Tips

- Always provide both `:root` (light) and `.dark` (dark mode) variants
- Use OKLCH for consistent perceptual brightness across themes
- Keep primary-foreground as white or near-black for contrast
