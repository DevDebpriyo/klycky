# Contributing to Klycky ⌨️

Thank you for your interest in contributing to Klycky! We welcome all contributions, from bug fixes and documentation improvements to new typing modes, themes, and configuration options.

This document outlines the guidelines and standards to keep the development process smooth and the codebase high-quality.

---

## 📌 Table of Contents

1. [Getting Started](#getting-started)
2. [How to Contribute](#how-to-contribute)
3. [Standards and Guidelines](#standards-and-guidelines)
4. [Theme Guidelines](#theme-guidelines)
5. [Language Guidelines](#language-guidelines)
6. [Quote Guidelines](#quote-guidelines)
7. [Layout Guidelines](#layout-guidelines)
8. [Questions](#questions)

---

## 🚀 Getting Started

To set up Klycky locally for development, follow these steps:

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/klycky.git
   cd klycky
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   Compile TypeScript files to the `dist/` directory:
   ```bash
   npm run build
   ```

4. **Run the App Locally**
   ```bash
   npm start
   ```

5. **Development Watch Mode**
   Automatically recompile TypeScript files whenever you make edits:
   ```bash
   npm run dev
   ```

---

## 🤝 How to Contribute

We follow a typical open-source pull request workflow:

1. **Find or Create an Issue**: Before starting work, check the issues or open one to discuss the changes you'd like to make.
2. **Create a Feature Branch**: Work on a clean branch off `main` (e.g., `feature/new-theme-nord`).
3. **Commit Your Changes**: Write clear, descriptive commit messages.
4. **Test Your Changes**: Verify that the build succeeds (`npm run build`) and the application starts correctly.
5. **Submit a Pull Request (PR)**: Provide a detailed explanation of your changes in the PR description.

---

## 🎨 Standards and Guidelines

To keep the application highly performant and clean, please adhere to the following responsibilities based on the file layout:

- **Engine & Logic (`src/engine/`, `src/stats/`)**: High-performance, low-overhead algorithms for buffer handling, typing events, and WPM/Accuracy/Consistency math.
- **Rendering & UI (`src/renderer/`, `src/modes/`)**: Avoid flicker by using minimal terminal escape sequences and region-based redrawing. Always check layouts on typical Terminal sizes (minimum width 80 columns).
- **Theming & Aesthetics (`src/themes/`)**: All themes must follow the predefined `KlyckyTheme` interface.
- **Configuration & CLI (`src/config/`, `src/commands/`)**: Keep settings storage and command routing robust, error-tolerant, and fully offline.

---

## 🎨 Theme Guidelines

Themes are defined as `KlyckyTheme` objects in `src/themes/themes.ts`. When creating a new theme:

1. Ensure the color names match the schema keys:
   - `background`: Main app background color.
   - `foreground`: Unselected text color.
   - `dimmed`: Completed/unvisited letters.
   - `active`: Current word/active elements.
   - `accent`: Primary visual highlights.
   - `error` & `extra`: Typing errors.
   - `caret`: Cursor highlight.
   - `statusBg` & `statusFg`: UI backgrounds (e.g. status lists, panels).
2. Set the `variant` key to `'dark'` or `'light'` based on background luminance.
3. Export your theme object and register it inside the `THEMES` object map.
4. Add the theme export to `src/themes/index.ts`.

---

## 📝 Language Guidelines

Word generation list keys are stored in `src/engine/wordGenerator.ts`.
- Language files or word generators must use clean, lowercase, common words.
- Avoid offensive words, profanity, or complex jargon unless they are in a specific technical dictionary.
- Keep standard word lists balanced in length for realistic typing metrics.

---

## 💬 Quote Guidelines

Quotes are located in `src/modes/quoteMode.ts`.
- Quotes should be inspiring, educational, or fun (particularly relating to programming, technology, philosophy, or design).
- Keep length classifications consistent:
  - **Short**: < 100 characters.
  - **Medium**: 100 to 250 characters.
  - **Long**: > 250 characters.
- Ensure correct spelling, punctuation, and proper attribute names.

---

## 📐 Layout Guidelines

Klycky is a grid-based terminal application.
- All dimensions must respect `calculateLayout()` in `src/renderer/layout.ts`.
- Do not hardcode column or row positions. Use the dynamic offsets computed from terminal size.
- Maintain a minimum required console size warning (typically 80x24 characters) to ensure the interface is always readable and doesn't crash on resize.

---

## ❓ Questions

Have questions or need help?
- Check out existing [GitHub Issues](https://github.com/DevDebpriyo/klycky/issues).
- Open a new discussion or issue on GitHub for architectural decisions or technical blockers.
