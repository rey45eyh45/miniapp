# 📋 Telegram Mini App - Vazifalar Ro'yxati (To-Do List)

Telegram ichida ishlaydigan foydali vazifalar ro'yxati (To-Do List) ilovasi.

![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini%20App-blue?logo=telegram)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Imkoniyatlar

- ✅ Yangi vazifa qo'shish
- ✅ Vazifalarni bajarilgan deb belgilash
- ✅ Vazifalarni o'chirish
- ✅ Filtrlash (Hammasi / Faol / Bajarilgan)
- ✅ Bajarilgan vazifalarni tozalash
- ✅ Ma'lumotlar saqlanishi (localStorage)
- ✅ Telegram tema rang-lari bilan moslik
- ✅ Haptic feedback (tebranish)
- ✅ Responsive dizayn (mobil qurilmalarga moslashgan)

## 🛠 Texnologiyalar

- **HTML5** - Sahifa strukturasi
- **CSS3** - Zamonaviy stillar va animatsiyalar
- **Vanilla JavaScript** - Ilova mantiqi
- **Telegram WebApp SDK** - Telegram integratsiyasi

## 📁 Loyiha Strukturasi

```
miniapp/
├── index.html          # Asosiy HTML fayl
├── css/
│   └── styles.css      # Stillar
├── js/
│   └── app.js          # JavaScript kodi
├── .github/
│   └── copilot-instructions.md
└── README.md           # Hujjat
```

## 🚀 Ishga tushirish

### Lokal serverda test qilish

1. VS Code da **Live Server** extension'ni o'rnating
2. `index.html` faylini oching
3. O'ng tugmani bosing va **"Open with Live Server"** ni tanlang
4. Brauzerda ilova ochiladi

### Telegram'da test qilish

1. Ilovani hosting'ga joylashtiring (GitHub Pages, Vercel, Netlify)
2. [@BotFather](https://t.me/BotFather) orqali yangi bot yarating
3. `/newapp` buyrug'i bilan mini app qo'shing
4. URL manzilini kiriting

## 🌐 Deploy qilish

### GitHub Pages

1. GitHub repository yarating
2. Fayllarni push qiling
3. Settings → Pages → Source: main branch
4. URL: `https://username.github.io/repository-name`

### Vercel

1. [vercel.com](https://vercel.com) ga kiring
2. GitHub repository'ni import qiling
3. Deploy tugmasini bosing

### Netlify

1. [netlify.com](https://netlify.com) ga kiring
2. Fayllarni drag & drop qiling
3. URL manzilini oling

## 🤖 Telegram Bot sozlash

1. [@BotFather](https://t.me/BotFather) ga yozing
2. `/newbot` - yangi bot yarating
3. `/newapp` - mini app qo'shing
4. Bot nomini tanlang
5. Web App URL manzilini kiriting (HTTPS bo'lishi kerak!)

## 📱 Telegram WebApp SDK

Ilova quyidagi Telegram WebApp funksiyalaridan foydalanadi:

```javascript
// Telegram WebApp ob'ekti
const tg = window.Telegram.WebApp;

// Ilovani tayyorlash
tg.ready();

// To'liq ekranga kengaytirish
tg.expand();

// Haptic feedback
tg.HapticFeedback.impactOccurred('light');

// Tema rang-lari
tg.themeParams.bg_color
tg.themeParams.text_color
```

## 🎨 Mavzular

Ilova Telegram'ning yorug' va qorong'u mavzularini avtomatik qo'llab-quvvatlaydi.

CSS o'zgaruvchilari:
- `--tg-theme-bg-color` - Fon rangi
- `--tg-theme-text-color` - Matn rangi
- `--tg-theme-button-color` - Tugma rangi
- `--tg-theme-secondary-bg-color` - Ikkilamchi fon

## 📝 Litsenziya

MIT License - Erkin foydalanishingiz mumkin.

## 👨‍💻 Muallif

Telegram Mini App loyihasi

---

⭐ Agar loyiha yoqsa, GitHub'da yulduzcha qo'ying!
