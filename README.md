# Klycky ⌨️

> A beautiful, terminal-native typing application for developers.

**Klycky** is a minimalist, high-performance CLI typing test and terminal UI designed as a lightweight, offline alternative to Monkeytype for developers. Enhance your typing speed, track your productivity, measure your WPM, and practice touch typing directly in your terminal without any distractions.

![License](https://img.shields.io/badge/license-GPLv3-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![npm](https://img.shields.io/npm/v/klycky)
![downloads](https://img.shields.io/npm/dm/klycky)
![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink)
![Contribute](https://img.shields.io/badge/PRs_Welcome-brightgreen.svg)
![Issues](https://img.shields.io/github/issues/DevDebpriyo/klycky)

## ✨ Features

- **Beautiful Terminal UI** — Cozy, modern, and elegant design with full theming
- **Zero Flickering** — Buffered frame rendering with region-based updates
- **Multiple Typing Modes** — Time (15s/30s/60s), Word Count (25/50/100), Quotes, Custom Text
- **Live Performance Metrics** — WPM sparkline, accuracy meter, flow indicators
- **18 Built-in Themes** — Catppuccin, Dracula, Rosé Pine, Solarized, and more
- **Command Palette** — Floating overlay with slash commands (like VSCode)
- **Fully Offline** — No accounts, no internet, zero runtime dependencies
- **Cross-Platform** — Works on Windows, macOS, and Linux
- **Zero Lag** — Near-instant startup and immediate input response

## 📦 Installation

```bash
npm install -g klycky
```

Or run directly without installing:

```bash
npx klycky
```

## 🚀 Quick Start

```bash
# Start with defaults (30s time mode, Catppuccin theme)
klycky

# Start with a specific theme
klycky --theme nord

# Start in word count mode
klycky --mode words --words 50

# Start with a custom time
klycky --time 60
```

## ⌨️ Controls

| Key | Action |
|---|---|
| Start typing | Begin the test |
| `Space` | Move to next word |
| `Backspace` | Delete last character |
| `Ctrl+Backspace` | Delete entire word |
| `Tab` | Restart / next test |
| `Escape` | Reset (typing) / Quit (idle/results) |
| `/` | Open command palette (when idle) |
| `Ctrl+C` | Force quit |

### Results Screen

After completing a test, results are shown with input protection:
- **Tab** — Start a new test
- **Escape** — Quit

All other keys are ignored to prevent accidental skipping.

## 💬 Command Palette

Press `/` while idle to open the command palette overlay:

| Command | Description |
|---|---|
| `/theme <name>` | Change theme |
| `/themes` | List available themes |
| `/mode <mode>` | Switch typing mode (time, words, quote) |
| `/time <seconds>` | Set session duration |
| `/words <count>` | Set word count target |
| `/restart` | Restart current session |
| `/stats` | View your statistics |
| `/history` | View recent sessions |
| `/best` | Show personal best WPM |
| `/caret <style>` | Change caret (line, block, underline) |
| `/difficulty <level>` | Set difficulty (easy, normal, hard) |
| `/punct` | Toggle punctuation |
| `/numbers` | Toggle numbers |
| `/zen` | Toggle zen mode (minimal UI) |
| `/focus` | Toggle focus mode |
| `/quit` | Exit Klycky |
| `/help` | Show all commands |

## 🎨 Themes

- **Catppuccin Mocha** — Warm pastel colors on dark background
- **Catppuccin Frappé** — Muted pastels on a mid-tone base
- **Tokyo Night** — Cool blue and purple tones
- **Nord** — Arctic-inspired color palette
- **Gruvbox Dark** — Retro warm color scheme
- **Monokai Pro** — Classic vibrant syntax colors
- **GitHub Dark** — Clean, modern dark theme
- **Dracula** — Bold purples and vivid greens
- **Serika Dark** — Monkeytype-inspired dark gold accent
- **Serika Light** — Monkeytype-inspired light variant
- **Solarized Dark** — Ethan Schoonover's precision palette
- **Rosé Pine** — Soho vibes with muted rose tones
- **Carbon** — IBM Carbon design system colors
- **Olive** — Earthy greens and natural tones
- **Bouquet** — Soft florals and lavender hues
- **Café** — Warm coffee and cream palette
- **Cyberspace** — Neon greens and cyberpunk glow

Switch themes instantly with `/theme <name>`.

## 📊 Metrics

- **WPM** — Words per minute (standard: 1 word = 5 characters)
- **Raw WPM** — Total characters per minute (including errors)
- **Accuracy** — Percentage of correct keypresses
- **Consistency** — How steady your typing speed is
- **Streak** — Longest run of correct characters
- **Flow** — Visual indicator of typing rhythm (✦✦✦)

## 🏗️ Architecture

Klycky uses a region-based rendering architecture for flicker-free performance:

```
┌─────────────────────────────────┐
│  ◆ klycky              (logo)  │  ← static, renders once
│  time  ·  28s          (mode)  │  ← timer tick only (200ms)
│  ─────────────────  (separator) │  ← static
│                                 │
│  the quick brown fox   (typing) │  ← keypress only
│  jumps over the lazy            │
│                                 │
│  wpm 67 ▁▂▃▅▆  acc 97%  (stats)│  ← keypress only
│  ─────────────────  (separator) │  ← static
│  tab next  esc quit   (footer)  │  ← state change only
└─────────────────────────────────┘
```

All output is frame-buffered: accumulated into a write buffer and flushed as a single `stdout.write()` call to prevent tearing.

## 🗂️ Data Storage

All data is stored locally in `~/.klycky/`:

- `config.json` — Your settings
- `stats.json` — Aggregate statistics
- `history.json` — Session history

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/yourusername/klycky.git
cd klycky

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start

# Watch mode (auto-rebuild on changes)
npm run dev
```

## 🐭 Mouse Clicks

Klycky listens for raw ANSI mouse packets from your terminal. If clicks do not register:

- Ensure your terminal supports mouse tracking and isn't intercepting clicks.
- In VSCode, try "Terminal: Enable Mouse Reporting" and disable extensions that capture clicks.
- For debugging, run with `KLYCKY_DEBUG_MOUSE=1` to log raw mouse packets.

## 📋 Requirements

- Node.js >= 18
- A terminal with true-color support (Windows Terminal, iTerm2, Alacritty, Kitty, etc.)

## 📄 License

GPL-3.0 © Klycky Contributors
