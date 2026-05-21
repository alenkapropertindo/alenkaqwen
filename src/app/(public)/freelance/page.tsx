import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Home,
  Users,
  TrendingUp,
  Gift,
  ArrowRight,
  Star,
  Zap,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";
import CountdownTimer from "@/components/countdown-timer";

export const dynamic = "force-dynamic";

export default async function FreelancePage() {
  const userCount = await prisma.user.count({
    where: {
      role: UserRole.USER,
    },
  });

  const currentPrice = 48 + Math.max(1, userCount);
  return (
    <div className="min-h-screen clay-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="clay-card-yellow text-[#63490b] px-4 py-2 rounded-full text-sm font-semibold">
              🔥 Program Affiliate Terbaru
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold clay-text-title mb-6 leading-tight">
            Dapatkan{" "}
            <span className="text-[#d64560] drop-shadow-sm">
              Fee Jutaan Rupiah
            </span>
            <br />
            Tanpa Harus Jualan!
          </h1>

          <p className="text-xl md:text-2xl clay-text-muted font-bold mb-12 max-w-3xl mx-auto leading-relaxed">
            Hanya dengan Merekomendasikan Teman, Keluarga, atau Siapa Saja yang
            Ingin Beli Rumah!
          </p>

          <div className="clay-panel p-1 mb-12 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 p-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl clay-card bg-white/40 border-white hover:bg-white/60 transition-all duration-500 group">
                <div className="clay-card-pink p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 clay-text-title font-bold" />
                </div>
                <h3 className="text-2xl font-bold clay-text-title mb-3">
                  Tanpa Jualan
                </h3>
                <p className="clay-text-muted font-bold">
                  Kamu tidak perlu jadi agen properti atau door to door ke calon
                  pembeli!
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl clay-card bg-white/40 border-white hover:bg-white/60 transition-all duration-500 group">
                <div className="clay-card-pink p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 clay-text-title font-bold" />
                </div>
                <h3 className="text-2xl font-bold clay-text-title mb-3">
                  Tim Kami yang Follow-Up
                </h3>
                <p className="clay-text-muted font-bold">
                  Setelah kamu rekomendasikan target konsumen, tim kami yang
                  akan menghubungi, presentasi, antar ceklokasi hingga closing.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl clay-card bg-white/40 border-white hover:bg-white/60 transition-all duration-500 group">
                <div className="clay-card-pink p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="h-8 w-8 clay-text-title font-bold" />
                </div>
                <h3 className="text-2xl font-bold clay-text-title mb-3">
                  Fee Langsung Setelah Akad Kredit
                </h3>
                <p className="clay-text-muted font-bold">
                  Begitu terjadi akad kredit, kamu langsung dapat fee hingga
                  jutaan rupiah per unit!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center">
            {/* Premium Price Box */}
            <div className="mb-10 relative inline-flex flex-col items-center w-full max-w-sm md:max-w-md">
              {/* Glowing Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff8fa3] via-[#ffb3c6] to-[#ff8fa3] rounded-[40px] blur-xl opacity-60 animate-pulse"></div>

              {/* Main Premium Card */}
              <div className="relative w-full clay-panel pt-8 pb-10 px-8 md:px-12 rounded-[40px] border border-white/50 bg-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(255,143,163,0.4)] flex flex-col items-center overflow-hidden">

                {/* Dynamic Shimmer Effect */}
                <div className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_infinite] rotate-12 pointer-events-none"></div>

                {/* VIP Badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 text-yellow-900 text-[10px] md:text-xs font-black px-6 py-1.5 rounded-b-2xl shadow-lg uppercase tracking-widest flex items-center gap-1 z-10 border-b border-x border-yellow-200">
                  <span className="text-sm">💎</span> PENAWARAN EKSKLUSIF
                </div>

                <h3 className="text-sm md:text-base font-black text-white/90 mb-4 mt-2 uppercase tracking-[0.3em] text-center drop-shadow-md">
                  Gabung Komunitas Sekarang
                </h3>

                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 relative w-full">
                  {/* Normal Price */}
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-sm md:text-base font-bold text-white/90 uppercase tracking-widest mb-[-2px]">Harga Normal</span>
                    <span className="text-6xl md:text-7xl font-black text-white/90 line-through decoration-red-500 decoration-[6px] drop-shadow-md">
                      499K
                    </span>
                  </div>

                  {/* Divider - Hidden on mobile, visible on desktop */}
                  <div className="hidden md:block h-16 w-px bg-white/30 rounded-full"></div>

                  {/* Current Price */}
                  <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
                    <span className="text-xs md:text-sm font-bold text-[#ffb3c6] uppercase tracking-widest mb-[-2px] animate-pulse">Hari Ini Saja</span>
                    <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#ff8fa3] drop-shadow-[0_0_25px_rgba(255,143,163,0.8)]">
                      {currentPrice}K
                    </span>
                  </div>
                </div>

                {/* Scarcity Indicator */}
                <div className="mt-6 flex items-center justify-center gap-2 bg-black/20 rounded-full px-4 py-2 border border-white/10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-xs md:text-sm font-bold text-white/80">Slot Promo Tersisa: <span className="text-[#ffb3c6] text-sm md:text-base font-black">12 Orang</span></span>
                </div>
              </div>
            </div>
            <CountdownTimer />
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="clay-card-pink hover:from-purple-700 hover:to-pink-700 clay-text-title font-bold text-2xl px-12 py-8 rounded-full shadow-[0_0_40px_#8b5cf6] hover:shadow-[0_0_50px_#8b5cf6] transition-all duration-300 transform hover:scale-105 font-bold"
              >
                GABUNG SEKARANG <ArrowRight className="ml-3 h-8 w-8" />
              </Button>
            </Link>
            <p className="clay-text-muted font-bold mt-6 text-xl">
              harga naik setiap kali member bergabung
            </p>
          </div>

        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-[#aae4ee]/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold clay-text-title font-extrabold mb-2">
                1JT+
              </div>
              <div className="clay-text-muted font-bold">Fee per Unit</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold clay-text-title font-extrabold mb-2">
                ∞
              </div>
              <div className="clay-text-muted font-bold">Potensi Penghasilan</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold clay-text-title font-extrabold mb-2">
                0%
              </div>
              <div className="clay-text-muted font-bold">Modal Awal</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold clay-text-title font-extrabold mb-2">
                24/7
              </div>
              <div className="clay-text-muted font-bold">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold clay-text-title mb-6">
              💡 Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-xl clay-text-muted font-bold max-w-2xl mx-auto">
              Proses yang mudah dan sederhana untuk memulai penghasilan tambahan
              Anda
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="clay-panel">
              <CardContent className="p-8">
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 clay-card-pink rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold clay-text-title font-bold">
                      1
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <h3 className="text-2xl font-bold clay-text-title mb-3">
                        Daftar Sekarang di program affiliate kami
                      </h3>
                      <p className="clay-text-muted font-bold text-lg">
                        Buka menu customers dan masukan nomor telepon teman,
                        keluarga atau prospek yang ingin membeli rumah
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 clay-card-pink rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold clay-text-title font-bold">
                      2
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <h3 className="text-2xl font-bold clay-text-title mb-3">
                        Kamu tinggal duduk manis dan Tim Kami yang Akan
                        Menghubungi Calon Pembeli
                      </h3>
                      <p className="clay-text-muted font-bold text-lg">
                        Tim profesional kami akan melakukan follow-up,
                        presentasi, hingga closing
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 clay-card-pink rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold clay-text-title font-bold">
                      3
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <h3 className="text-2xl font-bold clay-text-title mb-3">
                        Kamu Dapat Fee Jutaan Rupiah Setelah Akad!
                      </h3>
                      <p className="clay-text-muted font-bold text-lg">
                        Setelah terjadi akad kredit, fee langsung masuk ke
                        rekening kamu
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Who Is This For */}
      <div className="py-24 bg-[#c4ebf2]/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold clay-text-title mb-6">
              🎯 Siapa yang Cocok Ikut Program Ini?
            </h2>
            <p className="text-xl clay-text-muted font-bold max-w-2xl mx-auto">
              Program ini terbuka untuk siapa saja yang memiliki jaringan sosial
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="clay-card transition-all duration-300">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#d64560] mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg clay-text-muted font-bold">
                      Siswa, Mahasiswa atau karyawan yang ingin penghasilan
                      tambahan
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#d64560] mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg clay-text-muted font-bold">
                      Ibu rumah tangga
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#d64560] mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg clay-text-muted font-bold">
                      Influencer, content creator, blogger
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#d64560] mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg clay-text-muted font-bold">
                      Siapa pun yang punya jaringan atau kenalan yang ingin beli
                      rumah
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clay-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl clay-text-title font-bold flex items-center">
                  <Home className="h-8 w-8 text-[#d64560] mr-3" />
                  Proyek yang Tersedia:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold clay-text-title font-bold">
                      Rumah subsidi
                    </h3>
                    <p className="clay-text-muted font-bold mt-1">
                      Harga terjangkau, legalitas terjamin
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold clay-text-title font-bold">
                      Banyak pilihan promo
                    </h3>
                    <p className="clay-text-muted font-bold mt-1">
                      Lokasi strategis, dp akad rendah
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/40">
                  <p className="clay-text-muted font-bold flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Legalitas pasti aman & terpercaya
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold clay-text-title mb-6">
              🌟 Sukses Mitra Kami
            </h2>
            <p className="text-xl clay-text-muted font-bold max-w-2xl mx-auto">
              Dengarkan pengalaman dari mitra yang sudah bergabung
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="clay-card">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-400 mb-4 flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="clay-text-muted font-bold mb-4">
                  "Saya dapat fee 2 juta hanya dengan merekomendasikan teman.
                  Sangat mudah dan tanpa repot!"
                </p>
                <p className="clay-text-title font-extrabold font-bold">
                  - Siti, Ibu Rumah Tangga
                </p>
              </CardContent>
            </Card>

            <Card className="clay-card">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-400 mb-4 flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="clay-text-muted font-bold mb-4">
                  "Sebagai mahasiswa, ini adalah penghasilan tambahan yang luar
                  biasa. Tidak perlu modal sama sekali!"
                </p>
                <p className="clay-text-title font-extrabold font-bold">- Budi, Mahasiswa</p>
              </CardContent>
            </Card>

            <Card className="clay-card">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-400 mb-4 flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="clay-text-muted font-bold mb-4">
                  "Fee yang saya dapatkan sudah melebihi penghasilan sampingan
                  saya sebelumnya. Sangat direkomendasikan!"
                </p>
                <p className="clay-text-title font-extrabold font-bold">
                  - Andi, Content Creator
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fee & Bonus */}
      <div className="py-24 bg-[#fed277]/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold clay-text-title mb-6">
              💸 Fee Mulai dari 1 Juta
            </h2>
            <p className="text-xl clay-text-muted font-bold max-w-2xl mx-auto mb-12">
              Setiap penjualan dari referensi kamu bisa menghasilkan fee tanpa
              repot!
            </p>

            <Card className="clay-panel max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl clay-text-title font-bold flex items-center justify-center">
                  <Gift className="h-10 w-10 mr-3 clay-text-muted font-bold" />
                  Bonus Khusus untuk Pendaftar Hari Ini!
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="clay-text-muted font-bold text-xl mb-8">
                  Daftar hari ini dan dapatkan bimbingan 1 on 1 + tips cara mudah
                  closing lebih cepat 🚀
                </p>
                <div className="clay-panel p-6 rounded-2xl border border-white/40">
                  <h3 className="text-2xl font-bold clay-text-title mb-3">
                    Apa yang Anda Dapatkan:
                  </h3>
                  <ul className="text-left space-y-2 clay-text-muted font-bold">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />{" "}
                      Materi promosi siap pakai
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />{" "}
                      Bimbingan cara closing lebih cepat
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />{" "}
                      Bimbingan langsung cara beriklan di media sosial
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />{" "}
                      Support eksklusif 24/7
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="mt-16 flex flex-col items-center">
              {/* Premium Price Box */}
              <div className="mb-10 relative inline-flex flex-col items-center w-full max-w-sm md:max-w-md">
                {/* Glowing Aura */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff8fa3] via-[#ffb3c6] to-[#ff8fa3] rounded-[40px] blur-xl opacity-60 animate-pulse"></div>

                {/* Main Premium Card */}
                <div className="relative w-full clay-panel pt-8 pb-10 px-8 md:px-12 rounded-[40px] border border-white/50 bg-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(255,143,163,0.4)] flex flex-col items-center overflow-hidden">

                  {/* Dynamic Shimmer Effect */}
                  <div className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_infinite] rotate-12 pointer-events-none"></div>

                  {/* VIP Badge */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 text-yellow-900 text-[10px] md:text-xs font-black px-6 py-1.5 rounded-b-2xl shadow-lg uppercase tracking-widest flex items-center gap-1 z-10 border-b border-x border-yellow-200">
                    <span className="text-sm">💎</span> PENAWARAN EKSKLUSIF
                  </div>

                  <h3 className="text-sm md:text-base font-black text-white/90 mb-4 mt-2 uppercase tracking-[0.3em] text-center drop-shadow-md">
                    Gabung Komunitas Sekarang
                  </h3>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 relative w-full">
                    {/* Normal Price */}
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest mb-[-2px]">Harga Normal</span>
                      <span className="text-3xl md:text-4xl font-black text-white/40 line-through decoration-red-500/80 decoration-[3px]">
                        499K
                      </span>
                    </div>

                    {/* Divider - Hidden on mobile, visible on desktop */}
                    <div className="hidden md:block h-16 w-px bg-white/30 rounded-full"></div>

                    {/* Current Price */}
                    <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
                      <span className="text-[10px] md:text-xs font-bold text-[#ffb3c6] uppercase tracking-widest mb-[-2px] animate-pulse">Hari Ini Saja</span>
                      <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#ff8fa3] drop-shadow-[0_0_25px_rgba(255,143,163,0.8)]">
                        {currentPrice}K
                      </span>
                    </div>
                  </div>

                  {/* Scarcity Indicator */}
                  <div className="mt-6 flex items-center justify-center gap-2 bg-black/20 rounded-full px-4 py-2 border border-white/10">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-xs md:text-sm font-bold text-white/80">Slot Promo Tersisa: <span className="text-[#ffb3c6] text-sm md:text-base font-black">12 Orang</span></span>
                  </div>
                </div>
              </div>
              <CountdownTimer />
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="clay-card-pink hover:from-purple-700 hover:to-pink-700 clay-text-title font-bold text-2xl px-12 py-8 rounded-full shadow-[0_0_40px_#8b5cf6] hover:shadow-[0_0_50px_#8b5cf6] transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  GABUNG SEKARANG <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
              </Link>
              <p className="clay-text-muted font-bold mt-6 text-xl">
                harga naik setiap kali member bergabung
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold clay-text-title mb-6">
              ❓ Pertanyaan Umum
            </h2>
            <p className="text-xl clay-text-muted font-bold mb-16">
              Masih punya pertanyaan? Kami siap membantu Anda
            </p>

            <div className="clay-panel p-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-2xl clay-text-muted font-bold mb-4">
                    Hubungi Admin Kami:
                  </p>
                  <a
                    href="https://wa.me/6285299756674"
                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 clay-text-title font-bold font-bold px-8 py-4 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg
                      className="h-6 w-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    085299756674
                  </a>
                </div>
              </div>
            </div>

            <p className="text-3xl font-bold text-[#d64560] drop-shadow-sm mt-16">
              Ubah Jaringanmu Jadi Uang Sekarang!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


