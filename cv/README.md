# CV en LaTeX

El archivo fuente es `CV.tex`. Está preparado para compilarse con pdfLaTeX.

`CV.tex` y `CV.pdf` funcionan como CV maestro: conservan el detalle completo de la
trayectoria. Las versiones breves orientadas a cada búsqueda deben derivarse de esta
fuente, sin reemplazarla.

## Organización

- `CV.tex` / `CV.pdf`: CV maestro. `CV.docx` es el documento original del que proviene.
- `postulaciones/<empresa-rol>/`: versiones adaptadas a cada búsqueda, una carpeta por postulación.

## Compilación

Desde la carpeta del `.tex` que se quiera compilar:

En una instalación local de TeX Live o MiKTeX:

```powershell
pdflatex CV.tex
pdflatex CV.tex
```

La segunda ejecución actualiza correctamente los metadatos y enlaces internos.

También puede cargarse `CV.tex` directamente en Overleaf y compilarse con pdfLaTeX.

## Estructura editable

- `\cvsection{...}` crea una sección.
- `\cventry{puesto o título}{empresa o institución}{fechas}` crea una entrada.
- `\project{...}` crea un proyecto dentro de una experiencia.
- Las responsabilidades y los logros usan listas `itemize` normales.

El contenido proviene de `CV.docx`. Se normalizaron mayúsculas, puntuación y nombres de
tecnologías, sin eliminar secciones ni datos.
