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
  `dashboard.tsx`, `beli-emas.tsx`.
- **React Context** untuk state management, dipisah per domain agar clean dan
  mudah di-test:
  - `src/context/auth-context.tsx` — status login, mock `login()`/`logout()`.
  - `src/context/gold-context.tsx` — saldo emas, harga realtime (simulasi),
    dan aksi `buyGold(nominal)` yang mengunci harga saat transaksi (mirip
    FR-012 "Lock harga").
- **Route guard**: `dashboard.tsx` dan `beli-emas.tsx` melakukan redirect ke
  `/login` bila user belum login (lihat penggunaan `<Redirect />` dari
  `expo-router`).
- `src/utils/format.ts` — helper format Rupiah & gram, dipakai bersama di
  seluruh halaman (DRY, clean code).

> Catatan: Tidak ada backend nyata pada scope test ini. Login menerima email
> valid + kata sandi minimal 4 karakter (mock, dengan delay untuk simulasi
> network call). Harga emas & saldo disimpan di memori (React state), reset
> setiap kali aplikasi dibuka ulang.

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

## Struktur Folder Relevan

```
src/
  app/
    _layout.tsx      # Root stack + AuthProvider/GoldProvider
    index.tsx         # Redirect awal berdasarkan status login
    login.tsx          # Halaman Login
    dashboard.tsx       # Halaman Dashboard
    beli-emas.tsx        # Halaman Beli Emas
  context/
    auth-context.tsx
    gold-context.tsx
  utils/
    format.ts
  components/          # Komponen UI dasar (ThemedText, ThemedView, dll.)
  constants/theme.ts   # Warna, spacing, brand color
```

## Sumber

Dibangun di atas starter [`create-expo-app`](https://www.npmjs.com/package/create-expo-app)
(Expo SDK 57 / Expo Router).
