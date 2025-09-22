##  Calculadora IMC

## Link
https://2025-proyecto1-imc.vercel.app/

## Inicio
En primera instancia, se procedió a clonar los repositorios provistos por el docente a cargo de la asignatura.
Posteriormente, se creó un nuevo repositorio en GitHub con el nombre:

2025_proyecto1_imc

Finalmente, se subieron los archivos del proyecto a dicho repositorio.

--- 
En la segunda instancia, se nos pidió cambios para realizarle al proyecto, dentro de estas modificaciones se encontraban: 
- Validaciones en el ingreso de datos para el formulario:
    - Validar que el peso sea un número positivo mayor a 0 y menor a 500 kg.
    - Validar que la altura sea un número positivo mayor a 0 y menor a 3 metros.
    - Mostrar mensajes de error amigables en el frontend

- Implementación de persistencia para que los usuarios puedan guardar y recuperar sus resultados, con una interfaz simple
en el frontend para visualizar el historia.

- Establecer la autenticación para asociar cálculos de IMC a usuarios específicos.

## Dependencias
Tanto en el backend como en el frontend, fue necesario instalar las dependencias iniciales mediante el siguiente comando:

"npm install"

## Ejecución local de pruebas
Con el objetivo de comprobar el correcto funcionamiento del sistema de forma local, se abrieron dos terminales independientes:

**Backend**
"npm run start:dev"

**Frontend**
"npm run dev"
---
Segunda entrega:
Empezamos a utilizar taiwind para el frontend por lo que debimos instalarlo "npm install tailwindcss @tailwindcss/vite"


## Despliegue de frontend a Vercel
Para el despliegue del frontend se optó por la plataforma Vercel ya que su plan gratuito cubre las necesidades de  un proyecto academico,nos parecio fácil de usar y además  un compañero ya tenia experiencia utilizándolo.
 Para el despliegue seguimos los pasos que se enumeran a continuación:

Se vinculó el repositorio en la plataforma.

Se especificó la carpeta frontend como directorio de despliegue.

Se configuraron los parámetros principales:

Framework: Vite

Build command: npm run build

A efectos de realizar pruebas previas a un despliegue definitivo, se creó la rama test, en la cual se llevaron a cabo las siguientes acciones:

Creación del archivo .env en la carpeta frontend para alojar la URL de la API del backend.

Modificación del código en los archivos main.tsx e ImcForm.tsx, incorporando la llamada a la API.

---
En cuanto a la segunda entrega el despliegue del frontend a Vercel fue el mismo, solamente que modificamos un "/" de la variable de entorno ya que teníamos problema con la comunicación del backend.

## Despliegue de backend a Render
El despliegue del backend se realizó en la plataforma Render ya que su plan gratuito permite desplegar el back-end y la base de datos sin costos, nos resultó sencillo de usar y además ofrece buena confiabilidad para mantener el proyecto accesible.
El procedimiento contempló:

Vinculación del repositorio con Render.

Configuración del servicio para que se enfocara en la carpeta backend.

---
Para la segunda entrega configuramos Render para que haga los despliegues en la rama de "test" y le cambiamos las variables de entorno para que se pueda comunicar con la base de datos.


## Base de datos
Utilziamos el servicio de SupaBase, el mismo  nos proporcionó las variables de entorno para copiar y pegar en nuestro proyecto así se conectaba con nuestro backend.
Luego creamos las tablas "users" e "imc_records" para poder guardar los datos que se nos había pedido para esta entrega: 
- peso(kg), altura (m), IMC calculado, categoría (bajo peso, normal, sobrepeso, obesidad), y fecha/hora del cálculo
- id, email, password, fecha y hora de creación del usuario

![Base de datos](./images/basededatos.png)


## Problemas 
Se presentó inicialmente un problema: Render estaba configurado por defecto para desplegar la rama main, mientras que los cambios efectuados se encontraban en la rama test.
Tras identificar esta situación, se ajustó la configuración para que el servicio utilizara la rama correcta. Una vez realizado el cambio, el despliegue funcionó correctamente.

---
En la segunda entrega tuvimos problemas específicos, ya que al principio hubo una mala estructuración del proyecto (creamos carpeta de componentes, modulos, auth, etc...). Luego a la hora de conectar la base de datos con el backend tuvimos problemas con los nombres de las entidades ya que había mayúsculas y minúsculas mezcladas por lo que no se podía comunicar correctamente. 

## Resultados obtenidos manualmente
El sistema quedó desplegado con el frontend en Vercel y el backend en Render, funcionando de manera integrada.
Se realizaron pruebas manuales sobre la aplicación desplegada, las cuales confirmaron el correcto funcionamiento de la solución propuesta.


## Bajo peso
![Bajo peso](./images/bajopeso.png)
## Peso normal
![normal](./images/normal.png)
## Obeso
![obeso](./images/obeso.png)
## Sobrepeso
![sobrepeso](./images/sobrepeso.png) 

---

## Segunda entrega
Finalmente los tests manuales que hicimos para la segunda entrega, fue el registro y login por parte del usuario; luego para ese usuario poder calcular los IMC con los datos que ingresó y guardarlos en un historial. 
También hicimos un test automático para corroborar el registro en la base de datos.

## Registro
![Registro](./images/registro.png)
## Login
![Login](./images/login.png)
## Error login
![Error login](./images/error-inicio-sesion.png)
## Home IMC sin datos
![Home sin datos](./images/home-imc-vacio.png)
## Home IMC con datos guardados
![Home con datos](./images/imc-datos-cargados.png)
## Base de datos
![Base de datos IMC](./images/basededatos-imc.png)
![Base de datos Usuarios](./images/basededatos-user.png)

---

# Migración de Base de Datos: PostgreSQL → MySQL

Esta sección documenta cómo migramos los datos desde PostgreSQL (Supabase) hacia MySQL (Railway) y cómo dejamos el backend listo para usar MySQL. Incluye variables de entorno, comandos, validaciones y una comparación técnica.

## Estado del proyecto y archivos clave
- Script de migración de datos: `backend/src/scripts/migrate-pg-to-mysql.ts`

## Requisitos previos
- Acceso a la base de datos origen (PostgreSQL en Supabase).
- Acceso a la base de datos destino (MySQL en Railway, usar la URL pública).
- Node 20.x y dependencias instaladas en `backend/`.

## Variables de entorno para la migración
Crear un archivo `backend/.env.migration` con las credenciales de ambas bases. Ejemplo:


Notas:
- El script de migración espera exactamente estos nombres de variables para MySQL: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.
- Para Postgres usa: `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASS`, `PG_NAME`, `PG_SSL`.

## Ejecutar la migración de datos
Desde la carpeta `backend/` ejecutar:

```bash
npx dotenv -e .env.migration -- npx ts-node src/scripts/migrate-pg-to-mysql.ts
```

Qué hace el script `migrate-pg-to-mysql.ts`:
- Se conecta a Postgres (lectura) y a MySQL (escritura).
- Crea el esquema en MySQL solo para esta corrida (`synchronize: true` en la conexión del script).
- Copia `users` y luego `imc_records`, preservando IDs y relaciones (`user_id`).
- Ignora inserciones duplicadas si ya existen.
- Imprime conteos finales en MySQL para verificación.

## Configurar el backend para usar MySQL
Archivo: `backend/src/app.module.ts`
- Está configurado con `type: 'mysql'` y `synchronize: false`.
- Variables de entorno a definir en el servicio del backend (Render/Railway) para MySQL:

## Ejecutar ambas tecnologías en paralelo por rama (opcional para la entrega)
- `main` → PostgreSQL (estado original). Repositorio Original
- `main` → MySQL. Repositorio Forkeado del Repo Origina

## Comparativa técnica: PostgreSQL vs MySQL (resumen)
- Postgres
  - Tipos avanzados (JSONB, arrays, `timestamptz`), CTEs.
  - Consistencia fuerte y ecosistema como Supabase.
- MySQL
  - Amplio soporte, costos competitivos, muy usado en OLTP simple.
  - En TypeORM, `numeric` se mapea a `DECIMAL`, `uuid` suele ser `VARCHAR(36)`, timestamps como `TIMESTAMP/DATETIME`. Cambios Efectuados

Justificación: si no se usan features específicas de Postgres y priorizamos el hosting/costo/soporte del proveedor, MySQL es válido. Si se requieren tipos/consultas avanzadas y ya se aprovecha Supabase, Postgres es sólido.

## Solución de problemas (troubleshooting)
- Error de conexión MySQL desde Render: confirmar que NO uses `mysql.railway.internal` (host interno) y sí el host/puerto públicos de Railway. Tampco nos dejaba con el publico. Por esta razon se opto por desplega el back directamente en railway para solucionar el problema de conexion.

## Evidencias sugeridas para la entrega
- Capturas de conteos antes/después de la migración.
- Logs de consola del script mostrando cantidades migradas.
- Pruebas de API contra el backend con MySQL (crear usuario, login, crear/listar IMC).
