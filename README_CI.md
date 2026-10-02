# CI con Jenkins — Proyecto `axyso` (pasos manuales)

El **entorno de código ya está listo** (pruebas, Jenkinsfile, npm estandarizado).
Solo faltan los pasos manuales de GitHub y Jenkins. Aquí la guía.

## Lo que ya quedó listo en el código
- `Jenkinsfile` declarativo con 3 etapas: **Checkout → Build (`next build`) → Unit Tests (Vitest)** + reporte JUnit y post-actions.
- Prueba unitaria `lib/utils.test.ts` (4 casos sobre la utilidad `cn()`).
- `vitest.config.ts` que genera `test-results/junit.xml`.
- Proyecto estandarizado en **npm** (se generó `package-lock.json`; se quitaron los lockfiles de pnpm).
- Verificado localmente: `npm test` ✅ (4 passed) y `npm run build` ✅.

---

## Paso 1 — Repositorio en GitHub (manual)
1. Crea un repo **vacío** en https://github.com/new (sin README, sin .gitignore, sin licencia). Público es lo más simple.
2. En la terminal, dentro de `axyso/`:
   ```bash
   git init -b main
   git add -A
   git commit -m "Proyecto axyso con CI en Jenkins"
   git remote add origin https://github.com/TU_USUARIO/axyso.git
   git push -u origin main
   ```

## Paso 2 — Ajustar el Jenkinsfile
- Abre `Jenkinsfile` y en la etapa **Checkout** reemplaza
  `https://github.com/TU_USUARIO/axyso.git` por la URL real de tu repo.
- Haz commit y push de ese cambio.

## Paso 3 — Jenkins (http://localhost:8180)
1. **Plugins** (Manage Jenkins > Plugins): asegúrate de tener **NodeJS** y **Pipeline**.
2. **Herramienta Node** (Manage Jenkins > Tools > NodeJS installations):
   debe existir una instalación llamada **exactamente `NodeJs`** con *Install automatically*.
   > ⚠️ El nombre debe coincidir con el del Jenkinsfile (`nodejs 'NodeJs'`). Si el tuyo
   > se llama distinto, cambia uno de los dos para que coincidan.
3. **Crear el Pipeline**: New Item → nombre (ej. `axyso`) → tipo **Pipeline** → OK.
4. En la config del job, sección **Pipeline**:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git** · Repository URL: la de tu repo
   - Branch: **`*/main`** · Script Path: **`Jenkinsfile`**
   - Save.

## Paso 4 — Ejecutar
- **Build Now** y revisa el **Console Output**, el **Test Result** y los artefactos.

---

## ⚠️ Gotcha conocido (Apple Silicon / arm64)
Si el Build falla con `node: error while loading shared libraries: libatomic.so.1`,
instala la librería en el contenedor de Jenkins (una sola vez):
```bash
docker exec -u 0 jenkins bash -c "apt-get update && apt-get install -y libatomic1"
```
Luego vuelve a ejecutar el pipeline.
