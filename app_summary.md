*Struktur Folder
/src
  /app
    /api
      /auth/[...all]/route.ts     # Better Auth endpoint
      /customers/route.ts         # API customers
      /products/route.ts          # API products
      /users/route.ts             # API users (admin only)
    /dashboard
      page.tsx                    # Dashboard utama
      /products
        page.tsx                  # Halaman produk
        /[id]                     # Edit produk
      /customers
        page.tsx                  # Halaman customers
        /[id]                     # Edit customer
      /account
        page.tsx                  # Halaman akun
      /users
        page.tsx                  # Halaman users (admin only)
    /auth
      login/page.tsx              # Halaman login
      signup/page.tsx             # Halaman signup
    layout.tsx                    # Root layout
    page.tsx                      # Homepage public
  /components
    /ui                           # Shadcn components
    /dashboard                    # Komponen dashboard
    /home                         # Komponen homepage
  /lib
    auth.ts                       # Konfigurasi Better Auth
    db.ts                         # Koneksi Prisma
    utils.ts                      # Utility functions


    *Design Requirements
Visual Style & Theme:

modern dark gradient interface with neon purple accent colors

Futuristic, clean, and energetic aesthetic

Inspired by Superlist, Raycast, and Spline

Minimalistic and techy design language

Fully responsive across all device sizes (mobile, tablet, desktop)

Smooth animations and micro-interactions

Header Section:

Top navigation bar with clean, accessible design

Right side: Login and Signup buttons with hover effects

Sticky/fixed navigation

Hero Section:

Heading: "Alenka Properti Kendari" (modern, bold typography)

Primary CTA button: "Cari rumah murah seputar kota Kendari" with engaging hover animation

Animated home icon (subtle pulse/move)

Bottom right: clickable text "Hubungi Kami: 0852-4204-9550"

Product Cards Section:

Grid layout of property cards

Each card includes:

Image

Title (property name)

Location

Price (highlighted)

Short description

Hubungi Admin → links WhatsApp wa.me/6285242049550

Lihat Video → links TikTok profile

Smooth hover/transition effects

Footer:

Copyright: "© 2025 Alenka Properti – Semua Hak Dilindungi"

Mini nav: Home | Lokasi Terbaru | Hubungi Admin

Technical Specifications:

Fast loading, smooth performance
