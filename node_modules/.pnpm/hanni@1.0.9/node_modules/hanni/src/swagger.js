export function swaggerHTML(jsonPath, cfg = {}) {
  const title = cfg.title || 'Hanni Docs'
  const favicon = cfg.favicon || `https://pomf2.lain.la/f/0qbun5y.png`

  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<link rel="icon" href="${favicon}">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
<style>
/* Premium Dark Mode for Swagger UI */
body.dark { background-color: #0f172a; color: #f8fafc; }
body.dark .swagger-ui { filter: none; }
body.dark .swagger-ui .info .title, 
body.dark .swagger-ui .info li, 
body.dark .swagger-ui .info p,
body.dark .swagger-ui .opblock-tag,
body.dark .swagger-ui .opblock .opblock-summary-path,
body.dark .swagger-ui .opblock .opblock-summary-description,
body.dark .swagger-ui .response-col_status,
body.dark .swagger-ui .parameter__name,
body.dark .swagger-ui .parameter__type,
body.dark .swagger-ui .model-title,
body.dark .swagger-ui .model,
body.dark .swagger-ui .responses-table th,
body.dark .swagger-ui .responses-table td { color: #f1f5f9 !important; }

body.dark .swagger-ui .opblock { background: #1e293b !important; border-color: #334155 !important; }
body.dark .swagger-ui .scheme-container, 
body.dark .swagger-ui section.models { background: #1e293b !important; box-shadow: none !important; border: 1px solid #334155 !important; }
body.dark .swagger-ui select, 
body.dark .swagger-ui input { background: #0f172a !important; color: #f1f5f9 !important; border: 1px solid #475569 !important; }
body.dark .swagger-ui .opblock-section-header { background: #334155 !important; }
body.dark .swagger-ui .tabli button { color: #cbd5e1 !important; }
body.dark .swagger-ui .tabli.active button { color: #38bdf8 !important; }

/* Swagger Buttons Fix (Dark Mode) */
body.dark .swagger-ui .btn {
  color: #e5e7eb !important;
  border: 1px solid #475569 !important;
}
body.dark .swagger-ui .btn:hover {
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
}
/* Try it out */
body.dark .swagger-ui .btn.try-out {
  background-color: #0f172a !important;
  border: 1px dashed #64748b !important;
}
/* Execute */
body.dark .swagger-ui .btn.execute {
  background-color: #064e3b !important;
  border: 1px solid #10b981 !important;
  color: #ecfdf5 !important;
}
/* Cancel */
body.dark .swagger-ui .btn.cancel {
  background-color: #450a0a !important;
  border: 1px solid #ef4444 !important;
  color: #fee2e2 !important;
}

/* Theme Toggle Button */
#theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
</head>
<body class="bg-white text-slate-900 transition-all">
<button id="theme-toggle" class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 hover:scale-105 shadow-md border border-gray-200 dark:border-slate-600">
  <i class="fa-solid fa-moon"></i>
</button>

<div class="pt-16 pb-10">
  <div id="swagger"></div>
</div>

<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>
const btn = document.getElementById('theme-toggle')
const icon = btn.querySelector('i')
function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark')
  icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'
  localStorage.setItem('swagger-theme', theme)
}
setTheme(localStorage.getItem('swagger-theme') || 'light')
btn.onclick = () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark')

SwaggerUIBundle({
  url: '${jsonPath}',
  dom_id: '#swagger',
  deepLinking: true,
  persistAuthorization: true,
  defaultModelsExpandDepth: 1
})
</script>
</body>
</html>
`
}