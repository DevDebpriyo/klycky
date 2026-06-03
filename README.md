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

1. **8008**
2. **80s After Dark**
3. **9009**
4. **Aether**
5. **Alduin**
6. **Alpine**
7. **Anti Hero**
8. **Arch**
9. **Aurora**
10. **Beach**
11. **Bento**
12. **Bingsu**
13. **Bliss**
14. **Blue Dolphin**
15. **Blueberry Dark**
16. **Blueberry Light**
17. **Botanical**
18. **Bouquet**
19. **Breeze**
20. **Bushido**
21. **Café**
22. **Camping**
23. **Carbon**
24. **Catppuccin Frappé**
25. **Catppuccin Mocha**
26. **Chaos Theory**
27. **Cheesecake**
28. **Cherry Blossom**
29. **Comfy**
30. **Copper**
31. **Creamsicle**
32. **Cy Red**
33. **Cyberspace**
34. **Dark Magic Girl**
35. **Dark Note**
36. **Darling**
37. **Deku**
38. **Desert Oasis**
39. **Dev**
40. **Diner**
41. **Dino**
42. **Discord**
43. **Dmg**
44. **Dollar**
45. **Dracula**
46. **Drowning**
47. **Dualshot**
48. **Earthsong**
49. **Everblush**
50. **Evil Eye**
51. **Ez Mode**
52. **Fire**
53. **Fledgling**
54. **Fleuriste**
55. **Floret**
56. **Froyo**
57. **Frozen Llama**
58. **Fruit Chew**
59. **Fundamentals**
60. **Future Funk**
61. **Github**
62. **GitHub Dark**
63. **Godspeed**
64. **Graen**
65. **Grand Prix**
66. **Grape**
67. **Gruvbox Dark**
68. **Gruvbox Light**
69. **Hammerhead**
70. **Hanok**
71. **Hedge**
72. **Honey**
73. **Horizon**
74. **Husqy**
75. **Iceberg Dark**
76. **Iceberg Light**
77. **Incognito**
78. **Ishtar**
79. **Iv Clover**
80. **Iv Spade**
81. **Joker**
82. **Laser**
83. **Lavender**
84. **Leather**
85. **Lil Dragon**
86. **Lilac Mist**
87. **Lime**
88. **Luna**
89. **Macroblank**
90. **Magic Girl**
91. **Mashu**
92. **Matcha Moccha**
93. **Material**
94. **Matrix**
95. **Menthol**
96. **Metaverse**
97. **Metropolis**
98. **Miami**
99. **Miami Nights**
100. **Midnight**
101. **Milkshake**
102. **Mint**
103. **Mizu**
104. **Modern Dolch**
105. **Modern Dolch Light**
106. **Modern Ink**
107. **Monokai Pro**
108. **Moonlight**
109. **Mountain**
110. **Mr Sleeves**
111. **Ms Cupcakes**
112. **Muted**
113. **Nautilus**
114. **Nebula**
115. **Night Runner**
116. **Nord**
117. **Nord Light**
118. **Norse**
119. **Oblivion**
120. **Olive**
121. **Olivia**
122. **Onedark**
123. **Our Theme**
124. **Pale Nimbus**
125. **Paper**
126. **Passion Fruit**
127. **Pastel**
128. **Peach Blossom**
129. **Peaches**
130. **Pink Lemonade**
131. **Pulse**
132. **Purpleish**
133. **Rainbow Trail**
134. **Red Dragon**
135. **Red Samurai**
136. **Repose Dark**
137. **Repose Light**
138. **Retro**
139. **Retrocast**
140. **Rosé Pine**
141. **Rose Pine Dawn**
142. **Rose Pine Moon**
143. **Rudy**
144. **Ryujinscales**
145. **Serika**
146. **Serika Dark**
147. **Serika Light**
148. **Sewing Tin**
149. **Sewing Tin Light**
150. **Shoko**
151. **Slambook**
152. **Snes**
153. **Soaring Skies**
154. **Solarized Dark**
155. **Solarized Light**
156. **Solarized Osaka**
157. **Sonokai**
158. **Spiderman**
159. **Stealth**
160. **Strawberry**
161. **Striker**
162. **Suisei**
163. **Sunset**
164. **Superuser**
165. **Sweden**
166. **Tangerine**
167. **Taro**
168. **Terminal**
169. **Terra**
170. **Terrazzo**
171. **Terror Below**
172. **Tiramisu**
173. **Tokyo Night**
174. **Trackday**
175. **Trance**
176. **Tron Orange**
177. **Vaporwave**
178. **Vesper**
179. **Vesper Light**
180. **Viridescent**
181. **Voc**
182. **Vscode**
183. **Watermelon**
184. **Wavez**
185. **Witch Girl**

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

## 📋 Requirements

- Node.js >= 18
- A terminal with true-color support (Windows Terminal, iTerm2, Alacritty, Kitty, etc.)

## 🤝 Want to Contribute?

Refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## 💖 Support

If you wish to support further development and feel extra awesome, you can [sponsor me on GitHub](https://github.com/sponsors/DevDebpriyo).


## 📄 License

GPL-3.0 © Klycky Contributors
