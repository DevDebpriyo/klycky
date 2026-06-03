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

1. **8008** — Grey and pink classic keycap colorway
2. **80s After Dark** — Neon cyber vibes under a dark sky
3. **9009** — Vintage office beige and green keycaps style
4. **Aether** — Dark cosmic palette with deep orange accents
5. **Alduin** — Dark, dragon-inspired tones from Skyrim
6. **Alpine** — Crisp, clean mountain air and ice-blue shades
7. **Anti Hero** — Moody, dark theme with high contrast highlights
8. **Arch** — Minimalist grey and blue inspired by Arch Linux
9. **Aurora** — Cool northern lights color palette
10. **Beach** — Sandy beige and ocean blue notes
11. **Bento** — Warm red, blue, and clean white tones
12. **Bingsu** — Creamy red beans and ice-cold white
13. **Bliss** — Soft, calming pastel color palette
14. **Blue Dolphin** — Deep oceanic blues and playful highlights
15. **Blueberry Dark** — Deep violet and berry accents on a dark base
16. **Blueberry Light** — Fresh berry tones on a bright background
17. **Botanical** — Leafy greens and wooden tones
18. **Bouquet** — Soft florals and sweet lavender hues
19. **Breeze** — Refreshing light blue tones
20. **Bushido** — Deep red and steel grey warrior tones
21. **Café** — Warm coffee and cream palette
22. **Camping** — Forest green and campfire orange
23. **Carbon** — Clean dark grey and orange accents
24. **Catppuccin Frappé** — Muted pastels on a mid-tone base
25. **Catppuccin Mocha** — Warm pastel colors on a dark background
26. **Chaos Theory** — Vibrant green and purple accents
27. **Cheesecake** — Sweet strawberry pink and cream tones
28. **Cherry Blossom** — Soft cherry blossom pink highlights
29. **Comfy** — Cozy home tones with warm accents
30. **Copper** — Metallic brown and warm rust accents
31. **Creamsicle** — Orange and vanilla cream highlights
32. **Cy Red** — High-contrast neon red accents
33. **Cyberspace** — Deep tech cyber green and dark navy
34. **Dark Magic Girl** — Magical violet and pink accents on dark
35. **Dark Note** — Clean grey note-taking aesthetic
36. **Darling** — Soft pink and white anime-inspired tones
37. **Deku** — Heroic green, red, and white palette
38. **Desert Oasis** — Sand dunes and warm blue pools
39. **Dev** — Classic terminal code editor color scheme
40. **Diner** — Vintage neon diner sign vibes
41. **Dino** — Forest floor greens and prehistoric tones
42. **Discord** — Cozy chat app blue-purple and dark grey
43. **Dmg** — Retro handheld console grey and purple accents
44. **Dollar** — Wealthy green notes and dark cash register tones
45. **Dracula** — Bold purples and vivid greens
46. **Drowning** — Deep blue and teal underwater shades
47. **Dualshot** — Classic console controller grey and accent colors
48. **Earthsong** — Natural green and brown woodsy tones
49. **Everblush** — Cozy dark green and soft blush accents
50. **Evil Eye** — Mystical dark blue and gold notes
51. **Ez Mode** — High-readability basic neon highlights
52. **Fire** — Hot orange and red embers on black
53. **Fledgling** — Soft bird-feather grey and blue tones
54. **Fleuriste** — Parisian flower shop greens and rose tones
55. **Floret** — Muted botanical greens and soft cream
56. **Froyo** — Cool yogurt white and fruit topping colors
57. **Frozen Llama** — Playful purple and cyan llama tones
58. **Fruit Chew** — Bright fruit candy pink and yellow highlights
59. **Fundamentals** — Clean, basic high-contrast developer tones
60. **Future Funk** — Vibrant retro-wave magenta and cyan
61. **Github** — Clean default GitHub styling
62. **GitHub Dark** — Clean, modern dark theme
63. **Godspeed** — Space exploration yellow and blue-grey
64. **Graen** — Organic green and cool dark tones
65. **Grand Prix** — Racing green and yellow track stripes
66. **Grape** — Sweet deep purple grape tones
67. **Gruvbox Dark** — Retro warm color scheme
68. **Gruvbox Light** — Warm sandy paper background with retro accents
69. **Hammerhead** — Dark oceanic navy and neon blue shark tones
70. **Hanok** — Traditional Korean wooden architecture tones
71. **Hedge** — Manicured lawn green and dark stone
72. **Honey** — Sweet gold and amber honey highlights
73. **Horizon** — Warm sunset orange and purple sky
74. **Husqy** — Arctic sled-dog grey and ice blue
75. **Iceberg Dark** — Frosty deep blue iceberg under dark night
76. **Iceberg Light** — Clean polar glacier white and cold blue
77. **Incognito** — Stealthy monochrome shades of grey
78. **Ishtar** — Ancient Mesopotamian gold and clay tones
79. **Iv Clover** — Lucky green and white clover patch
80. **Iv Spade** — Dark royal card game aesthetic
81. **Joker** — Villainous green and purple comic vibes
82. **Laser** — Cyberpunk retro magenta laser beams
83. **Lavender** — Calming light purple floral shades
84. **Leather** — Rich brown and tan saddle tones
85. **Lil Dragon** — Cute cartoon purple and gold highlights
86. **Lilac Mist** — Morning mist over lavender fields
87. **Lime** — Sour green citrus fruit tones
88. **Luna** — Moonlit blue and soft night sky shades
89. **Macroblank** — Minimal vaporwave aesthetics
90. **Magic Girl** — Pastel magical girl pink and mint
91. **Mashu** — Cozy lavender and warm grey shield tones
92. **Matcha Moccha** — Green tea matcha and creamy espresso tones
93. **Material** — Google material design standard palette
94. **Matrix** — Classic falling digital rain green-on-black
95. **Menthol** — Cool, minty fresh light green notes
96. **Metaverse** — Digital magenta and high-tech blue
97. **Metropolis** — Art deco dark steel and golden window lights
98. **Miami** — Retro neon pink and bright teal vibes
99. **Miami Nights** — Dark synthwave neon pink and blue
100. **Midnight** — Deep dark blue and starry highlights
101. **Milkshake** — Soft strawberry, vanilla, and cherry highlights
102. **Mint** — Fresh mint green and cool white notes
103. **Mizu** — Clean spring water blue and clear white
104. **Modern Dolch** — Sleek modern grey and teal keycaps
105. **Modern Dolch Light** — Clean light grey with modern teal accents
106. **Modern Ink** — Calligraphy brush black and ink bottle tones
107. **Monokai Pro** — Classic vibrant syntax colors
108. **Moonlight** — Cool night shadows and pale yellow moonbeams
109. **Mountain** — Foggy peaks and cold granite grey
110. **Mr Sleeves** — Warm beige and soft pink fabric tones
111. **Ms Cupcakes** — Sweet bakery frosting pink and blue pastels
112. **Muted** — Subdued tones for distraction-free typing
113. **Nautilus** — Deep sea submarine navy and yellow accent
114. **Nebula** — Far space cosmic purples and pinks
115. **Night Runner** — Dark streets with running yellow safety stripes
116. **Nord** — Arctic-inspired color palette
117. **Nord Light** — Frosty clean light white and pastel accents
118. **Norse** — Mythological cold sea and dark wood tones
119. **Oblivion** — Classic grey code editor look
120. **Olive** — Earthy greens and natural tones
121. **Olivia** — Elegant rose gold and charcoal grey
122. **Onedark** — Atom editor inspired coding theme
123. **Our Theme** — Warm community-built cozy color scheme
124. **Pale Nimbus** — Soft raincloud grey and blue sky notes
125. **Paper** — Vintage notebook paper and dark ink
126. **Passion Fruit** — Rich purple skin and bright gold seed accents
127. **Pastel** — Sweet candy shop multi-color pastels
128. **Peach Blossom** — Soft pink blossoms and green leaf notes
129. **Peaches** — Juicy warm peach orange and cream
130. **Pink Lemonade** — Refreshing sweet pink and yellow citrus
131. **Pulse** — High contrast neon blue pulse waves
132. **Purpleish** — Soft violet tones for calm typing
133. **Rainbow Trail** — Colorful rainbow spectrum highlights
134. **Red Dragon** — Fiery red and dark dragon scales
135. **Red Samurai** — Deep red and golden armor accents
136. **Repose Dark** — Subdued warm charcoal for restful typing
137. **Repose Light** — Soft warm cream for clean typing
138. **Retro** — Warm vintage terminal green and brown
139. **Retrocast** — Old-school TV yellow and soft blue
140. **Rosé Pine** — Soho vibes with muted rose tones
141. **Rose Pine Dawn** — Soft morning sun over pine forests
142. **Rose Pine Moon** — Cool moonlit evening pine forest tones
143. **Rudy** — Deep blue and retro red football highlights
144. **Ryujinscales** — Mystic golden-scaled dragon green and gold
145. **Serika** — Cozy workspace yellow and dark slate
146. **Serika Dark** — Monkeytype-inspired dark gold accent
147. **Serika Light** — Monkeytype-inspired light variant
148. **Sewing Tin** — Retro cookie tin blue and sewing needles
149. **Sewing Tin Light** — Clean light blue sewing basket tones
150. **Shoko** — Soft blue and cream school uniform tones
151. **Slambook** — Fun teenage journal pink and bright blue
152. **Snes** — Classic 16-bit console grey and purple buttons
153. **Soaring Skies** — Flying high blue sky and white cloud tones
154. **Solarized Dark** — Ethan Schoonover's precision palette
155. **Solarized Light** — High-precision clean solarized light paper
156. **Solarized Osaka** — Warm Japanese sunset solarized theme
157. **Sonokai** — High-contrast warm neon coding colors
158. **Spiderman** — Heroic web-slinger red and blue accents
159. **Stealth** — Matte black and ultra-dark grey stealth mode
160. **Strawberry** — Ripe sweet red strawberry tones
161. **Striker** — Champion blue and white sports vibe
162. **Suisei** — Sparkly idol blue and starry highlights
163. **Sunset** — Golden hour orange and dusky purple sky
164. **Superuser** — Classic hacker terminal green-on-black
165. **Sweden** — Flag-inspired blue and yellow notes
166. **Tangerine** — Sweet orange peel and fresh cream
167. **Taro** — Creamy purple sweet potato root tones
168. **Terminal** — Default classic high contrast terminal style
169. **Terra** — Warm clay, soil, and earth tones
170. **Terrazzo** — Stone speckle mosaic grey and brown
171. **Terror Below** — Murky ocean deep green and warning green
172. **Tiramisu** — Coffee espresso and cocoa powder brown
173. **Tokyo Night** — Cool blue and purple tones
174. **Trackday** — Racing asphalt grey and red-line indicator
175. **Trance** — Neon electronic music festival vibes
176. **Tron Orange** — Futuristic neon orange grid lines
177. **Vaporwave** — 80s pink, purple, and retro-tech cyan
178. **Vesper** — Minimalist dark charcoal with warm orange pop
179. **Vesper Light** — Clean bright paper with warm orange accent
180. **Viridescent** — Lush botanical garden green tones
181. **Voc** — Dark theme with bright warning accents
182. **Vscode** — Default VS Code dark editor layout colors
183. **Watermelon** — Fresh juicy red melon and green rind
184. **Wavez** — Dynamic oceanic teal waves
185. **Witch Girl** — Magical witchy dark violet and neon green

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
