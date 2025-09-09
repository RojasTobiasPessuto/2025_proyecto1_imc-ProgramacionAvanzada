1. Preparación inicial

En primera instancia, se procedió a clonar los repositorios provistos por el docente a cargo de la asignatura.
Posteriormente, se creó un nuevo repositorio en GitHub con el nombre:

2025_proyecto1_imc

Finalmente, se subieron los archivos del proyecto a dicho repositorio.

2. Instalación de dependencias

Tanto en el backend como en el frontend, fue necesario instalar las dependencias iniciales mediante el siguiente comando:

npm install

3. Ejecución local de pruebas

Con el objetivo de comprobar el correcto funcionamiento del sistema de forma local, se abrieron dos terminales independientes:

Backend

npm run start:dev


Frontend

npm run dev


La aplicación respondió de manera adecuada, confirmando la correcta interacción entre ambos componentes en entorno local.

4. Despliegue del frontend en Vercel

Para el despliegue del frontend se optó por la plataforma Vercel, siguiendo los pasos que se enumeran a continuación:

Se vinculó el repositorio en la plataforma.

Se especificó la carpeta frontend como directorio de despliegue.

Se configuraron los parámetros principales:

Framework: Vite

Build command: npm run build

A efectos de realizar pruebas previas a un despliegue definitivo, se creó la rama test, en la cual se llevaron a cabo las siguientes acciones:

Creación del archivo .env en la carpeta frontend para alojar la URL de la API del backend.

Modificación del código en los archivos main.tsx e ImcForm.tsx, incorporando la llamada a la API.

5. Despliegue del backend en Render

El despliegue del backend se realizó en la plataforma Render. El procedimiento contempló:

Vinculación del repositorio con Render.

Configuración del servicio para que se enfocara en la carpeta backend.

Se presentó inicialmente un inconveniente: Render estaba configurado por defecto para desplegar la rama main, mientras que los cambios efectuados se encontraban en la rama test.
Tras identificar esta situación, se ajustó la configuración para que el servicio utilizara la rama correcta. Una vez realizado el cambio, el despliegue funcionó satisfactoriamente.

6. Resultados obtenidos

El sistema quedó desplegado con el frontend en Vercel y el backend en Render, funcionando de manera integrada.
Se realizaron pruebas manuales sobre la aplicación desplegada, las cuales confirmaron el correcto funcionamiento de la solución propuesta.