# Petualangan Pintu Bilangan Bulat

Game petualangan edukasi untuk **siswa SMP kelas VII** yang melatih **operasi hitung bilangan bulat**: penjumlahan, pengurangan, perkalian, dan pembagian, termasuk operasi campuran dan tanda kurung.

## File dalam paket ini

- `index.html` — struktur game: layar mulai, petunjuk, permainan, dan layar akhir.
- `style.css` — tampilan game, responsif dan ramah sentuhan.
- `script.js` — logika game: pembuat soal, skor, nyawa, level, dan umpan balik.
- `README.md` — berkas ini.

Ketiga berkas `index.html`, `style.css`, dan `script.js` harus tetap berada dalam satu folder yang sama, karena `index.html` memuat `style.css` dan `script.js` dari folder tersebut.

## Cara menjalankan

### Cara 1: Buka langsung (paling mudah, offline)

1. Buka folder game ini di perangkatmu.
2. Klik dua kali `index.html`.
3. Game akan terbuka di browser dan langsung bisa dimainkan, tanpa internet.

### Cara 2: Lewat server lokal (opsional)

Jika browser membatasi pembukaan berkas lokal, jalankan dari dalam folder game:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

## Cara bermain

1. Di layar mulai, baca petunjuk, lalu tekan **Mulai Petualangan**.
2. Setiap level memiliki **5 pintu**. Jawab soal untuk membuka pintu berikutnya.
3. Pilih satu dari 4 pilihan jawaban.
4. **Jawaban benar**: pintu terbuka, skor bertambah, dan kamu maju.
5. **Jawaban salah**: nyawa berkurang 1, pintu tetap terkunci, dan kamu mendapat soal baru untuk pintu yang sama. Pembahasan jawaban yang benar langsung ditampilkan.
6. Selesaikan 5 pintu untuk naik ke level berikutnya.
7. Selesaikan Level 5 untuk menang.

## Aturan skor, nyawa, dan menang/kalah

- **Nyawa:** 3 hati di awal permainan.
- **Skor:** jawaban benar = **+10 poin**.
- **Bonus:** setiap 3 jawaban benar berturut-turut = **+5 poin**.
- **Jawaban salah:** tidak mengurangi skor, hanya mengurangi 1 nyawa.
- **Menang:** menyelesaikan semua 5 level (25 pintu).
- **Kalah:** nyawa habis sebelum semua level selesai.
- **Bermain lagi:** tombol **Bermain Lagi** atau **Ulangi dari Awal** akan mengulang permainan dari Level 1 dengan skor dan nyawa baru.
- **Tidak ada batas waktu** per soal, agar siswa dapat berpikir teliti tentang tanda positif dan negatif.

## 5 level dan kenaikan kesulitan

| Level | Dunia | Materi |
| --- | --- | --- |
| 1 | Hutan Tambah-Kurang | Penjumlahan dan pengurangan bilangan bulat sederhana (sekitar −20 sampai 20). |
| 2 | Gua Kali-Bagi | Perkalian dan pembagian bilangan bulat. Pembagian dibuat selalu menghasilkan bilangan bulat. |
| 3 | Jembatan Campuran | Operasi campuran sederhana dan tanda kurung. |
| 4 | Menara Tanda Kurung | Operasi campuran bertingkat dengan bilangan lebih besar dan dua tanda kurung. |
| 5 | Istana Bilangan Bulat | Operasi campuran kompleks, tantangan akhir. |

Soal dibuat secara acak setiap permainan, sehingga setiap pengulangan tidak sama persis. Pengecoh jawaban dipilih dari kesalahan yang umum, misalnya salah tanda atau selisih kecil, agar siswa belajar memeriksa kembali pekerjaannya.

## Fitur lain

- Umpan balik langsung setiap jawaban, lengkap dengan pembahasan langkah demi langkah.
- Jalur petualangan dan penanda pintu yang menunjukkan kemajuan di setiap level.
- Tombol suara (bunyi Web Audio sederhana, tanpa berkas eksternal) yang bisa dimatikan.
- Tampilan responsif: tombol besar untuk sentuhan di ponsel, tetap nyaman diklik di komputer.

## Asumsi rancangan

Asumsi berikut hanya untuk hal teknis dan rancangan permainan, bukan untuk fakta atau data siswa:

- Setiap level berisi 5 soal (5 pintu), sehingga total 25 pintu.
- Permainan dimulai dengan 3 nyawa.
- Tidak ada batas waktu per soal.

## Yang perlu diisi guru

Bagian ini sengaja tidak diisi dengan data yang belum tersedia:

- Nama sekolah, nama kelas, dan nama guru: **[PERLU DIISI GURU]**
- Tujuan pembelajaran resmi dan kode capaian pembelajaran: **[PERLU DIISI GURU]**
- Nilai ketuntasan atau target skor kelas, bila guru ingin menetapkannya: **[PERLU DIISI GURU]**

Guru dapat menambahkan informasi tersebut di lembar tugas pendamping tanpa mengubah kode game ini.

## Mengubah game (opsional, untuk guru yang familiar dengan kode)

- Jumlah pintu per level: ubah `DOORS_PER_LEVEL` di `script.js` (perlu disesuaikan juga dengan tampilan pintu di `style.css` bila jumlahnya jauh berbeda).
- Jumlah nyawa awal: ubah nilai `lives: 3` pada fungsi `startGame()` di `script.js`.
- Poin per jawaban benar: ubah `state.score += 10` di `script.js`.
