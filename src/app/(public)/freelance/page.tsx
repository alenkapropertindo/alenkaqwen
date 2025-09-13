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

export default function FreelancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              🔥 Program Affiliate Terbaru
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Dapatkan <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Fee Jutaan Rupiah</span>
            <br />Tanpa Harus Jualan!
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Hanya dengan Merekomendasikan Teman, Keluarga, atau Siapa Saja yang Ingin Beli Rumah!
          </p>

          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-1 mb-12 border border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.25)] max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 p-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-900/40 hover:bg-purple-900/20 transition-all duration-500 border border-purple-500/20 hover:border-purple-400/40 group">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Tanpa Jualan
                </h3>
                <p className="text-purple-300">
                  Kamu tidak perlu jadi agen properti atau door to door ke calon pembeli. Cukup rekomendasikan saja!
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-900/40 hover:bg-purple-900/20 transition-all duration-500 border border-purple-500/20 hover:border-purple-400/40 group">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Agen Kami yang Follow-Up
                </h3>
                <p className="text-purple-300">
                  Setelah kamu rekomendasikan, tim profesional kami yang akan menghubungi, presentasi, antar ceklokasi hingga closing.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-900/40 hover:bg-purple-900/20 transition-all duration-500 border border-purple-500/20 hover:border-purple-400/40 group">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Fee Langsung Setelah Akad Kredit
                </h3>
                <p className="text-purple-300">
                  Begitu terjadi akad kredit, kamu langsung dapat fee hingga jutaan rupiah per unit!
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-10 py-7 rounded-full shadow-[0_0_30px_#8b5cf6] hover:shadow-[0_0_40px_#8b5cf6] transition-all duration-300 transform hover:scale-105 font-bold"
              >
                GABUNG SEKARANG <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
          <p className="text-purple-400 mt-6 text-lg">Gratis & Tanpa Syarat</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">1JT+</div>
              <div className="text-purple-300">Fee per Unit</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">∞</div>
              <div className="text-purple-300">Potensi Penghasilan</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">0%</div>
              <div className="text-purple-300">Modal Awal</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-purple-300">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              💡 Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Proses yang mudah dan sederhana untuk memulai penghasilan tambahan Anda
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
              <CardContent className="p-8">
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white">
                      1
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Daftar Sekarang di program affiliate kami (Gratis!)
                      </h3>
                      <p className="text-purple-300 text-lg">
                        Buka menu target dan masukan nomor telepon teman, keluarga atau prospek yang ingin membeli rumah
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white">
                      2
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Kamu tinggal duduk manis dan Tim Kami yang Akan Menghubungi Calon Pembeli
                      </h3>
                      <p className="text-purple-300 text-lg">
                        Tim profesional kami akan melakukan follow-up, presentasi, hingga closing
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white">
                      3
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Kamu Dapat Fee Jutaan Rupiah Setelah Akad!
                      </h3>
                      <p className="text-purple-300 text-lg">
                        Setelah terjadi akad kredit, fee langsung masuk ke rekening kamu
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
      <div className="py-24 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🎯 Siapa yang Cocok Ikut Program Ini?
            </h2>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Program ini terbuka untuk siapa saja yang memiliki jaringan sosial
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:shadow-[0_0_50px_rgba(139,92,246,0.25)] transition-all duration-300">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-purple-200">
                      Siswa, Mahasiswa atau karyawan yang ingin penghasilan tambahan
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-purple-200">Ibu rumah tangga</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-purple-200">Influencer, content creator, blogger</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-purple-200">
                      Siapa pun yang punya jaringan atau kenalan yang ingin beli rumah
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:shadow-[0_0_50px_rgba(139,92,246,0.25)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Home className="h-8 w-8 text-purple-500 mr-3" />
                  Proyek yang Tersedia:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Rumah subsidi
                    </h3>
                    <p className="text-purple-300 mt-1">
                      Harga terjangkau, legalitas terjamin
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Banyak pilihan promo
                    </h3>
                    <p className="text-purple-300 mt-1">
                      Lokasi strategis, dp akad rendah
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-500/20">
                  <p className="text-purple-300 flex items-center">
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🌟 Sukses Mitra Kami
            </h2>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Dengarkan pengalaman dari mitra yang sudah bergabung
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-400 mb-4 flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="text-purple-200 mb-4">
                  "Saya dapat fee 2,5 juta hanya dengan merekomendasikan teman. Sangat mudah dan tanpa repot!"
                </p>
                <p className="text-purple-400 font-bold">- Siti, Ibu Rumah Tangga</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-400 mb-4 flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="text-purple-200 mb-4">
                  "Sebagai mahasiswa, ini adalah penghasilan tambahan yang luar biasa. Tidak perlu modal sama sekali!"
                </p>
                <p className="text-purple-400 font-bold">- Budi, Mahasiswa</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-400 mb-4 flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <p className="text-purple-200 mb-4">
                  "Fee yang saya dapatkan sudah melebihi penghasilan sampingan saya sebelumnya. Sangat direkomendasikan!"
                </p>
                <p className="text-purple-400 font-bold">- Andi, Content Creator</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fee & Bonus */}
      <div className="py-24 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              💸 Fee Mulai dari 1 Juta
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-12">
              Setiap penjualan dari referensi kamu bisa menghasilkan fee tanpa repot!
            </p>

            <Card className="bg-gradient-to-br from-purple-900/70 to-pink-900/50 backdrop-blur-xl border-purple-500/40 shadow-[0_0_50px_rgba(139,92,246,0.3)] max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl text-white flex items-center justify-center">
                  <Gift className="h-10 w-10 mr-3 text-purple-300" />
                  Bonus Khusus untuk Pendaftar Hari Ini!
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-purple-100 text-xl mb-8">
                  Daftar hari ini dan dapatkan materi promosi + tips cara mudah closing lebih cepat 🚀
                </p>
                <div className="bg-gradient-to-r from-purple-700/50 to-pink-700/50 p-6 rounded-2xl border border-purple-400/30">
                  <h3 className="text-2xl font-bold text-white mb-3">Apa yang Anda Dapatkan:</h3>
                  <ul className="text-left space-y-2 text-purple-200">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Template promosi siap pakai</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Video tutorial closing</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Materi presentasi profesional</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Support eksklusif 24/7</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="mt-16">
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl px-12 py-8 rounded-full shadow-[0_0_40px_#8b5cf6] hover:shadow-[0_0_50px_#8b5cf6] transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  GABUNG SEKARANG <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
              </Link>
              <p className="text-purple-300 mt-6 text-xl">Gratis & Tanpa Komitmen</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ❓ Pertanyaan Umum
            </h2>
            <p className="text-xl text-purple-300 mb-16">
              Masih punya pertanyaan? Kami siap membantu Anda
            </p>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-2xl text-purple-300 mb-4">Hubungi Admin Kami:</p>
                  <a
                    href="https://wa.me/6282264345250"
                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    082264345250
                  </a>
                </div>
              </div>
            </div>
            
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mt-16">
              Ubah Jaringanmu Jadi Uang Sekarang!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
