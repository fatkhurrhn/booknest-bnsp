import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6">Tentang <span className="text-indigo-600">BookNest</span></h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600 mx-auto mb-8 rounded-full"></div>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          BookNest merupakan proyek uji kompetensi BNSP untuk sertifikasi kompetensi di bidang pengembangan web, menghadirkan pengalaman berbelanja buku online yang modern dan intuitif.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Project Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 transition-all hover:shadow-xl">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl p-8 shadow-inner">
                <i className="ri-award-fill text-7xl text-indigo-600"></i>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Proyek Sertifikasi BNSP</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  BookNest dikembangkan sebagai bagian dari uji kompetensi BNSP (Badan Nasional Sertifikasi Profesi)
                  untuk mendapatkan sertifikasi di bidang pengembangan web. Proyek ini mencakup semua aspek pengembangan
                  website toko buku online modern dengan fitur lengkap.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Dibangun dengan pendekatan <span className="font-semibold text-indigo-600">fullstack development</span>, proyek ini menampilkan antarmuka pengguna yang responsif,
                  sistem manajemen produk, dan alur pembelian yang lengkap.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Seluruh pengerjaan proyek ini dilakukan oleh <span className="font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">M Fatkhurrohman</span>
                  sebagai peserta uji kompetensi, mulai dari desain, pengembangan, hingga pengujian sistem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 transition-all hover:shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Tentang Pengembang</h2>
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Profile Image */}
            <div className="md:w-1/3 flex justify-center">
              <div className="relative h-56 w-56">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full shadow-inner animate-pulse"></div>
                <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-full shadow-sm overflow-hidden">
                  <img
                    src='https://media.licdn.com/dms/image/v2/D5603AQFJuxRd08BTDA/profile-displayphoto-shrink_400_400/B56ZZjELo4GUAg-/0/1745418765811?e=1750896000&v=beta&t=i1ZNfsrYPkUAFxxiEEUeOn-bMfdWqMai0l537FX3LvI'
                    alt="M Fatkhurrohman"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.className = 'hidden';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="md:w-2/3">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">M Fatkhurrohman</h3>
                <p className="text-indigo-600 font-medium mb-4">Fullstack Developer & Peserta Uji Kompetensi BNSP</p>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-gray-700 leading-relaxed">
                    <i className="ri-double-quotes-l text-indigo-300 text-xl"></i>
                    I'm an Information Systems student passionate about Front-End Development. I love turning ideas into interactive, user-friendly experiences with clean and efficient code. Always exploring new web technologies, I enjoy building innovative projects and sharing knowledge to make a real impact.
                    <i className="ri-double-quotes-r text-indigo-300 text-xl"></i>
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Keahlian:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">React.js</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">PHP</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">MySQL</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">UI/UX Design</span>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Hubungi Saya:</h4>
                <div className="flex space-x-4">
                  <a href="https://github.com/fatkhurrhn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors shadow-sm">
                      <i className="ri-github-fill text-2xl"></i>
                    </div>
                  </a>
                  <a href="https://linkedin.com/in/fatkhurrhn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors shadow-sm">
                      <i className="ri-linkedin-fill text-2xl"></i>
                    </div>
                  </a>
                  <a href="mailto:your.email@example.com" className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors shadow-sm">
                      <i className="ri-mail-fill text-2xl"></i>
                    </div>
                  </a>
                  <a href="https://fatkhurrhn.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors shadow-sm">
                      <i className="ri-global-line text-2xl"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all hover:shadow-xl">
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <i className="ri-code-s-slash-line text-3xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Teknologi yang Digunakan</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">
                  <span className="font-medium">Frontend:</span> React.js dengan Tailwind CSS, React Router, Context API
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">
                  <span className="font-medium">Backend:</span> PHP Native dengan MySQL, RESTful API
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">
                  <span className="font-medium">Tools:</span> Git, VS Code, Postman, Laragon
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all hover:shadow-xl">
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <i className="ri-list-check-2 text-3xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Fitur Utama</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">Sistem autentikasi pengguna (login/register)</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">Manajemen produk buku dengan kategori dan pencarian</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">Sistem keranjang belanja dan checkout multi-step</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <span className="ml-3 text-gray-600">Dashboard admin untuk manajemen konten</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-10 text-center text-white shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Terima Kasih Telah Mengunjungi</h3>
          <p className="text-indigo-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            BookNest dikembangkan dengan sepenuh hati sebagai bukti kompetensi dalam pengembangan web.
            Setiap komponen dibangun dengan memperhatikan aspek fungsionalitas, keamanan, dan pengalaman pengguna.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm transition-all">
              <i className="ri-home-line mr-2"></i> Kembali ke Beranda
            </a>
            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-all">
              <i className="ri-mail-line mr-2"></i> Hubungi Saya
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;