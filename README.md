# BMW · El Placer de Conducir

Página web interactiva de BMW con videos inmersivos, línea de tiempo, galería y sección de especificaciones. Proyecto universitario.

## Características

- Video background inmersivo con rotación automática
- Sección de historia con línea de tiempo interactiva
- Galería de imágenes
- Especificaciones técnicas de modelos destacados
- Acabados BMW Individual
- Diseño responsive

## Requisitos

- Navegador web moderno
- Python 3.x (para servir localmente)

## Cómo ejecutar

```bash
# Opción 1: Python
python -m http.server 8080

# Opción 2: PowerShell (Windows)
./servir.ps1

# Opción 3: Batch (Windows)
./servir.bat
```

Luego abre `http://localhost:8080` en tu navegador.

## Estructura del proyecto

```
├── index.html              # Página principal
├── style.css               # Estilos
├── script.js               # Lógica JavaScript
├── servir.bat              # Script para servir localmente (Windows)
├── servir.ps1              # Script para servir localmente (PowerShell)
├── videos/                 # Videos del sitio
└── .gitignore
```

## Tecnologías

- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) - Tipografía
- [Unsplash](https://unsplash.com/) - Imágenes de galería
