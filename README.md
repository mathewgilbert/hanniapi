# Hanni.js - Panduan Penggunaan (Bahasa Indonesia)

## Pendahuluan

**Hanni.js** adalah framework ringan untuk membuat API dengan cepat di Node.js menggunakan runtime **Bun**. Hanni dilengkapi dengan dukungan bawaan untuk Swagger UI, penyajian file statis, dan pengaturan router yang mudah.

## Instalasi

```bash
bun add hanni
```

## Struktur Proyek

```
/hannapi
├─ public/           # Folder untuk file statis (HTML, CSS, Gambar)
│   ├─ index.html
│   └─ favicon.ico
├─ src/
│   ├─ routes/
│   │   └─ api.js    # Definisi route API
│   └─ index.js      # Entry point aplikasi
├─ package.json
└─ README.md         # Dokumentasi (ini)
```

## Cara Menjalankan Aplikasi

1. **Pastikan Bun terinstal**.
2. **Jalankan server**:
   ```bash
   bun src/index.js
   ```
3. Buka browser dan akses:
   - API utama: `http://localhost:3000/`
   - Dokumentasi Swagger: `http://localhost:3000/docs`
   - File Statis: `http://localhost:3000/` (disajikan dari folder `./public`)

## Fitur Utama

### 1. Inisialisasi Aplikasi & Swagger
Anda dapat mengatur judul, deskripsi, favicon, dan **Tags** global untuk dokumentasi.
```javascript
import { Hanni } from 'hanni';

const app = Hanni({
    cors: true,
    swagger: {
        title: 'My Cute API',
        path: '/docs',
        description: 'Dokumentasi API saya',
        favicon: '/favicon.ico',
        // Definisi tag global (opsional)
        tags: [
            { name: 'Users', description: 'Operasi manajemen user' },
            { name: 'Admin', description: 'Area admin' }
        ]
    }
});
```

### 2. Menyajikan File Statis
Gunakan fungsi `Static` untuk memetakan folder ke URL.
```javascript
import { Static } from 'hanni';

// Menyajikan folder './public' di root URL '/'
app.use(Static({
    path: '/',
    root: './public'
}));
```

### 3. Mengatur Router
Gunakan `Router` untuk memisahkan logika API Anda.
```javascript
// src/routes/api.js
import { Router } from 'hanni';
const router = new Router();

router.get('/users/:id', c => c.json({ id: c.params.id }), {
    meta: {
        summary: 'Ambil User',
        tags: ['Users'] // Tag ini akan dikelompokkan di Swagger
    }
});

export default router;

// src/index.js
import routerApi from './routes/api.js';
app.route('/api', routerApi);
```

### 4. Metadata Swagger (Fix!)
Sekarang Hanni mendukung penulisan meta secara langsung maupun bersarang:
```javascript
// Cara 1: Langsung
app.get('/test', c => c.text('ok'), { tags: ['Test'] });

// Cara 2: Bersarang (Nesting)
app.get('/test2', c => c.text('ok'), {
    meta: {
        summary: 'Test 2',
        tags: ['Test']
    }
});
```

## Tips
- Gunakan `bun --watch src/index.js` agar server otomatis restart saat Anda mengubah kode.
- Swagger UI otomatis mengenali parameter dari URL (misal: `:id` menjadi `{id}`).

## Lisensi
MIT License – 2025 Rabbit Project.
