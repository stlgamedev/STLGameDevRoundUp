# Development Container Setup

This project uses a devcontainer for consistent development environments.

## What gets installed automatically

When you open this project in a devcontainer (GitHub Codespaces, VS Code Dev Containers, etc.), the following will be automatically installed:

- **Hugo Extended** (latest version) - Static site generator
- **Node.js & npm** - JavaScript runtime and package manager
- **Dart Sass** - SCSS/Sass compiler required by Hugo
- **Bootstrap** - JavaScript files copied to `assets/js/`
- All npm dependencies from `package.json`

## Setup script

The setup is handled by `.devcontainer/setup.sh`, which runs automatically when the container is created.

## Troubleshooting

If you encounter issues:

1. **Rebuild the container**: In VS Code, press `Cmd/Ctrl+Shift+P` and select "Dev Containers: Rebuild Container"
2. **Manually run setup**: Execute `.devcontainer/setup.sh` in the terminal
3. **Check Hugo**: Run `hugo version` to verify Hugo extended is installed
4. **Check Sass**: Run `sass --version` to verify Dart Sass is available

## Development Commands

- `hugo server` - Start development server
- `hugo` - Build the site
- `npm run watch:css` - Watch SCSS files for changes
