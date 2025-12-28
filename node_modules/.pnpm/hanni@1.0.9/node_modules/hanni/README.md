# Hanni.js 🐰

**Hanni.js** adalah framework web minimalis, modern, dan sangat cepat untuk **Bun runtime**. Didesain dengan filosofi **"Developer Experience"** yang utama, Hanni js menyediakan fitur built-in seperti **Swagger & Scalar Documentation otomatis**, routing yang fleksibel, dan dukungan penuh untuk **ES Modules**.

---

## 🚀 Fitur Utama

- **⚡ Bun Optimized**: Dibangun khusus untuk Bun, memanfaatkan performa tinggi dari runtime ini.
- **📄 Auto Docs**: Dokumentasi API otomatis dengan dukungan **Swagger UI** (Premium Dark Mode) dan **Scalar**.
- **🎨 Modern UI**: Antarmuka dokumentasi yang elegan dan dapat dikustomisasi.
- **📂 Static File Serving**: Middleware built-in untuk menyajikan file statis dengan mudah.
- **🛣️ Flexible Routing**: Dukungan untuk grouping route (router), parameter dinamis, dan query parameters.
- **🔌 Middleware Support**: Sistem middleware yang familiar (seperti Express/Koa) untuk auth, logging, dll.
- **📦 CORS Built-in**: Konfigurasi CORS yang mudah dan siap pakai.

---

## 📦 Instalasi

Pastikan kamu sudah menginstall [Bun](https://bun.sh/). Kemudian buat project baru dan install Hanni.js:

```bash
bun init
bun add hanni
```

---

## 🏁 Memulai Cepat (Quick Start)

Buat file `src/index.js`:

```javascript
import { Hanni, Static } from 'hanni';

// 1. Inisialisasi App
const app = Hanni({
    cors: true, // Aktifkan CORS
    
    // Opsi 1: Gunakan Swagger UI
    swagger: {
        title: 'My Awesome API',
        version: '1.0.0',
        description: 'Swagger Docs',
        path: '/docs',         
        favicon: '/favicon.ico' 
    },

    // Opsi 2: Gunakan Scalar (Alternatif Modern)
    /*
    scalar: {
        title: 'My Awesome API',
        path: '/reference',
        description: 'Scalar API Reference',
        favicon: '/favicon.ico'
    }
    */
});

// 2. Middleware Static Files (Contoh: folder ./public)
app.use(Static({
    path: '/',       // URL path
    root: './public' // Folder fisik
}));

// 3. Route Sederhana
app.get('/', (c) => {
    return c.text('Hello World from Hanni! 🐰');
});

// 4. Route dengan JSON & Metadata Swagger
app.get('/hello/:name', (c) => {
    const { name } = c.params;
    return c.json({
        message: `Hello, ${name}!`,
        timestamp: new Date()
    });
}, {
    // Metadata untuk Dokumentasi (Swagger/Scalar)
    meta: {
        summary: 'Sapa User',
        description: 'Endpoint untuk menyapa user berdasarkan nama.',
        tags: ['Greeting'],
        response: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                timestamp: { type: 'string' }
            }
        }
    }
});

// 5. Jalankan Server
app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
    console.log('📚 Swagger Docs at http://localhost:3000/docs');
});
```

Jalankan aplikasi:

```bash
bun run src/index.js
```

---

## 📚 Pilihan Dokumentasi

Hanni.js mendukung dua jenis tampilan dokumentasi API:

### 1. Swagger UI (Default & Premium Dark Mode)
Desain klasik yang ditingkatkan dengan tema gelap premium dan glassmorphism.

```javascript
const app = Hanni({
    swagger: {
        title: 'API Docs',
        path: '/docs', // Akses di /docs
        favicon: '/favicon.ico'
    }
})
```

### 2. Scalar (Modern API Reference)
Tampilan dokumentasi yang lebih modern, bersih, dan interaktif.

```javascript
const app = Hanni({
    scalar: {
        title: 'API Reference',
        path: '/reference', // Akses di /reference
        description: 'Dokumentasi menggunakan Scalar',
        favicon: '/favicon.ico'
    }
})
```

> **Catatan:** Anda bisa mengaktifkan keduanya sekaligus jika diinginkan!

---

## 🛣️ Menggunakan Router (Modular)

Untuk aplikasi yang lebih besar, pisahkan route menggunakan `Router`.

**File: `src/routes/users.js`**
```javascript
import { Router } from 'hanni';

const router = new Router();

router.get('/', (c) => c.json({ users: [] }), {
    meta: {
        summary: 'Get All Users',
        tags: ['Users']
    }
});

router.post('/', async (c) => {
    const body = await c.jsonBody();
    return c.json({ created: true, data: body }, 201);
}, {
    meta: {
        summary: 'Create User',
        tags: ['Users'],
        // Definisi Request Body untuk Docs
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                email: { type: 'string' }
            },
            required: ['username']
        }
    }
});

export default router;
```

**File: `src/index.js`**
```javascript
import userRouter from './routes/users.js';

// Mount router ke path /users
app.route('/users', userRouter);
```

---

## 🛠️ API Reference

### `Hanni(config)`
Membuat instance aplikasi.
- `config.cors`: Boolean atau object konfigurasi CORS.
- `config.swagger`: Object konfigurasi Swagger UI.
- `config.scalar`: Object konfigurasi Scalar UI.

### `app.get(path, handler, [meta])`
Mendaftarkan route GET. Tersedia juga untuk `post`, `put`, `delete`, `patch`, `all`.

### `app.use(middleware)`
Mendaftarkan global middleware atau static file server.

### `Static({ path, root })`
Helper untuk menyajikan file statis.
- `path`: URL prefix (misal `/assets`).
- `root`: Direktori fisik (misal `./public`).

### `Context (c)`
Object yang diterima di setiap handler:
- `c.req`: Request asli Bun.
- `c.params`: Path parameters (misal `/user/:id` -> `c.params.id`).
- `c.query`: Query string object.
- `c.body`: Raw body (jika sudah diparsing middleware).
- `c.json(data, status?)`: Return JSON response.
- `c.text(string, status?)`: Return Text response.
- `c.jsonBody()`: Parse JSON body dari request (async).

---

## 📄 Lisensi

MIT License © 2025 Hanni.js Team