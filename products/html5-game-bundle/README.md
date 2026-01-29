# 🎮 HTML5 Casual Game Bundle

**10 Premium Mobile-Ready Games | Vanilla JS | No Dependencies**

---

## 📦 What's Included

| Game | Genre | Description |
|------|-------|-------------|
| **Crystal Match** | Match-3 | Classic gem matching with power-ups and combos |
| **Screw Sort Factory** | Puzzle | Sort colored screws into matching slots |
| **Bubble Defense** | Tower Defense | Pop bubbles with strategic tower placement |
| **Dungeon Run** | Roguelike | Navigate procedural dungeons, fight monsters |
| **Slime Survivor** | Survivor | Survive waves of enemies, auto-attack combat |
| **Polygon Dungeon** | Action RPG | Geometric dungeon crawler |
| **Zombie Survivor** | Survival | Last as long as you can against zombie hordes |
| **Zen Tile Match** | Mahjong | Relaxing 3D tile matching puzzle |
| **Pixel Defense** | Tower Defense | Retro-style strategic defense |
| **Micro Factory** | Idle/Tycoon | Build and automate your factory |

---

## ✨ Features

- ✅ **Single HTML File** - Each game is one self-contained file
- ✅ **No Dependencies** - Pure vanilla JavaScript, no frameworks
- ✅ **Mobile Ready** - Touch controls, responsive design
- ✅ **Monetization Ready** - Easy ad integration points
- ✅ **Sound Effects** - Web Audio API implementation
- ✅ **Progress Saving** - LocalStorage persistence
- ✅ **MIT License** - Use commercially, modify freely

---

## 🚀 Quick Start

1. Open any game's `index.html` in a browser
2. That's it! No build process, no server needed

### Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main
# Enable Pages in repo settings
```

### Add AdMob/AdSense
Look for these comments in the code:
```javascript
// AD_SLOT: banner
// AD_SLOT: interstitial
// AD_SLOT: rewarded
```

---

## 📱 Mobile App Wrapping

### Capacitor (Recommended)
```bash
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
# Copy game files to www/
npx cap sync
```

### Cordova
```bash
cordova create myGame
cd myGame
cordova platform add ios android
# Copy game files to www/
cordova build
```

---

## 🎨 Customization

Each game uses CSS variables for easy theming:
```css
:root {
  --primary-color: #4CAF50;
  --background: #1a1a2e;
  --text-color: #ffffff;
}
```

---

## 📄 License

**MIT License** - You can:
- ✅ Use commercially
- ✅ Modify and rebrand
- ✅ Distribute and sell
- ✅ Use in client projects

---

## 🤝 Support

Questions? Email: support@eastsea.monster

---

Made with 💜 by [eastsea.monster](https://eastsea.monster)
