# Carpeta de entrada para importación automática

Cuando el dashboard esté implementado y su GitHub Action habilitada, coloca aquí archivos `.json`, `.jsonl`, `.ndjson`, `.csv` o `.xlsx` y súbelos mediante commit/push al repositorio. El workflow debe detectar nuevas incorporaciones, validar los archivos y registrar la importación sin duplicados.

Por defecto no se procesará este archivo Markdown. No guardar aquí tokens, contraseñas ni datos confidenciales si el repositorio es público.
