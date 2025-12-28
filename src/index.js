import { Hanni, Static } from 'hanni';

const app = Hanni({
    cors: true,
    scalar: {
        title: 'Hanni.js API',
        path: '/docs',
        description: "A minimalist, high-performance web framework for Bun. Built for speed, ease of use, and modern developer experience.",
        favicon: '/favicon.ico'
    }
})

import router from './routes/api.js';
app.route('/api', router);

app.use(Static({
    path: '/',
    root: './public'
}));

app.get('/', c => {
    return new Response(Bun.file('./views/index.html'));
}, {
    hidden: true
})

app.listen(3000, () => {
    console.log('Server running → http://localhost:3000')
    console.log('Swagger docs → http://localhost:3000/docs')
})