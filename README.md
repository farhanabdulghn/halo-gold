# HaloGold — Mobile Technical Test

Aplikasi mobile sederhana (React Native + Expo Router) yang mengimplementasikan
sebagian alur dari **Business Requirement Document (BRD) HaloGold**, sesuai
scope technical test: **Login → Dashboard → Beli Emas**.

## Fitur

| Halaman       | Deskripsi                                                                                                         | Referensi BRD                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Login**     | Form email + kata sandi dengan validasi sederhana                                                                 | FR-003                         |
| **Dashboard** | Saldo emas (gram & estimasi Rupiah), harga emas realtime (disimulasikan berubah setiap 5 detik), tombol Beli Emas | FR-005, FR-006                 |
| **Beli Emas** | Input nominal Rupiah, kalkulasi gram otomatis, quick-amount chip, tombol Konfirmasi yang menambah saldo           | FR-009, FR-010, FR-011, FR-012 |

Sesuai instruksi test case, halaman **payment, profile, dan riwayat transaksi
tidak diimplementasikan**.

## Arsitektur & State Management

- **Expo Router** (file-based routing) — `src/app/_layout.tsx`, `login.tsx`,
  `dashboard.tsx`, `buy-gold.tsx`.
- **Zustand** untuk state management, dipisah per domain agar clean dan
  mudah di-test:
  - `src/store/auth-store.ts` — status login (`isAuthenticated`, `userEmail`),
    serta aksi `login()` (mock, dengan delay untuk simulasi network call dan
    validasi email/kata sandi) dan `logout()`.
  - `src/store/gold-store.ts` — saldo emas (`balanceGram`), harga realtime
    (`pricePerGram`, di-tick otomatis tiap 5 detik lewat `startGoldPriceTicker`),
    dan aksi `buyGold(nominal)` yang mengunci harga saat transaksi dijalankan
    (mirip FR-012 "Lock harga").
- **Route guard**: `dashboard.tsx` dan `buy-gold.tsx` melakukan redirect ke
  `/login` bila user belum login (lihat penggunaan `<Redirect />` dari
  `expo-router`). Guard dipanggil setelah semua hooks selesai dieksekusi agar
  urutan hooks tetap konsisten di setiap render.
- `src/utils/format.ts` — helper format Rupiah & gram, dipakai bersama di
  seluruh halaman (DRY, clean code).

> Catatan: Tidak ada backend nyata pada scope test ini. Login menerima email
> valid + kata sandi minimal 4 karakter (mock, dengan delay untuk simulasi
> network call). Harga emas & saldo disimpan di memori (Zustand store),
> reset setiap kali aplikasi dibuka ulang.

## Menjalankan Aplikasi

1. Install dependencies

   ```bash
   npm install
   ```

2. Jalankan development server

   ```bash
   npx expo start
   ```

3. Buka di:
   - **Expo Go** (scan QR code) — cara tercepat untuk mencoba di HP fisik.
   - **Android emulator** — tekan `a` di terminal, atau `npm run android`.
   - **iOS simulator** (macOS) — tekan `i` di terminal, atau `npm run ios`.
   - **Web** — tekan `w` di terminal, atau `npm run web`.

4. Login menggunakan email apa saja (format valid) dan kata sandi minimal 4
   karakter, misalnya:

   ```
   email: demo@halogold.id
   password: demo1234
   ```

## Build APK (opsional, untuk deliverable)

Menggunakan [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Build preview akan menghasilkan file `.apk` yang bisa diunduh dari dashboard
EAS setelah proses build selesai.

Build terbaru dapat dilihat di sini:
[expo.dev/accounts/farhanabdulghn/projects/halogold/builds/60074339-8027-42ee-abfb-4285e48bf817](https://expo.dev/accounts/farhanabdulghn/projects/halogold/builds/60074339-8027-42ee-abfb-4285e48bf817)

Atau langsung unduh file APK-nya (`application-60074339-8027-42ee-abfb-4285e48bf817.apk`) yang sudah diupload di repo GitHub ini.

## Struktur Folder Relevan

```
src/
  app/
    _layout.tsx      # Root stack, mendaftarkan screen + memicu price ticker
    index.tsx         # Redirect awal berdasarkan status login
    login.tsx          # Halaman Login
    dashboard.tsx        # Halaman Dashboard
    buy-gold.tsx           # Halaman Beli Emas
  store/
    auth-store.ts        # Zustand store: status login, login()/logout()
    gold-store.ts          # Zustand store: saldo, harga, buyGold(), price ticker
  utils/
    format.ts
  components/          # Komponen UI dasar (ThemedText, ThemedView, dll.)
  constants/theme.ts   # Warna, spacing, brand color
```

## Sumber

Dibangun di atas starter [`create-expo-app`](https://www.npmjs.com/package/create-expo-app)
(Expo SDK 57 / Expo Router).
