# BMW · El Placer de Conducir

Página web interactiva de BMW con modelos 3D, línea de tiempo, galería y sección de especificaciones. Proyecto universitario.

## Características

- Visualizador 3D inmersivo con Three.js (BMW i8 de fondo)
- Carrusel 3D de modelos BMW (M4 Competition, M5 CS, M5 G90, BMW i8)
- Sección de historia con línea de tiempo interactiva
- Galería de imágenes
- Especificaciones técnicas de modelos destacados
- Acabados BMW Individual
- Diseño responsive

## Requisitos

- Navegador web moderno con soporte para WebGL
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
├── script.js               # Lógica JavaScript + Three.js
├── three.min.js            # Librería Three.js
├── GLTFLoader.js           # Cargador de modelos GLTF/GLB
├── *.glb                   # Modelos 3D de vehículos
├── servir.bat              # Script para servir localmente (Windows)
├── servir.ps1              # Script para servir localmente (PowerShell)
└── .gitignore
```

## Tecnologías

- [Three.js](https://threejs.org/) - Visualización 3D
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) - Tipografía
- [Unsplash](https://unsplash.com/) - Imágenes de galería
