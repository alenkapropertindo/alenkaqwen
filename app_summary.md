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