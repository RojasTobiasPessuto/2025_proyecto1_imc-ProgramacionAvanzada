##  Calculadora IMC

<<<<<<< HEAD
=======
## Link
https://2025-proyecto1-imc.vercel.app/

>>>>>>> f7dae8528c8c71b715dce570ff78d26675edf8be
## Inicio
En primera instancia, se procedió a clonar los repositorios provistos por el docente a cargo de la asignatura.
Posteriormente, se creó un nuevo repositorio en GitHub con el nombre:

2025_proyecto1_imc

Finalmente, se subieron los archivos del proyecto a dicho repositorio.

## Dependencias
Tanto en el backend como en el frontend, fue necesario instalar las dependencias iniciales mediante el siguiente comando:

"npm install"

## Ejecución local de pruebas
Con el objetivo de comprobar el correcto funcionamiento del sistema de forma local, se abrieron dos terminales independientes:

**Backend**
"npm run start:dev"

**Frontend**
"npm run dev"

La aplicación respondió de manera adecuada, confirmando la correcta interacción entre ambos componentes en entorno local.

## Despliegue de frontend a Vercel
<<<<<<< HEAD
Para el despliegue del frontend se optó por la plataforma Vercel, siguiendo los pasos que se enumeran a continuación:
=======
Para el despliegue del frontend se optó por la plataforma Vercel ya que su plan gratuito cubre las necesidades de  un proyecto academico,nos parecio fácil de usar y además  un compañero ya tenia experiencia utilizándolo.
 Para el despliegue seguimos los pasos que se enumeran a continuación:
>>>>>>> f7dae8528c8c71b715dce570ff78d26675edf8be

Se vinculó el repositorio en la plataforma.

Se especificó la carpeta frontend como directorio de despliegue.

Se configuraron los parámetros principales:

Framework: Vite

Build command: npm run build

A efectos de realizar pruebas previas a un despliegue definitivo, se creó la rama test, en la cual se llevaron a cabo las siguientes acciones:

Creación del archivo .env en la carpeta frontend para alojar la URL de la API del backend.

Modificación del código en los archivos main.tsx e ImcForm.tsx, incorporando la llamada a la API.


## Despliegue de backend a Render
<<<<<<< HEAD
El despliegue del backend se realizó en la plataforma Render. El procedimiento contempló:
=======
El despliegue del backend se realizó en la plataforma Render ya que su plan gratuito permite desplegar el back-end y la base de datos sin costos, nos resultó sencillo de usar y además ofrece buena confiabilidad para mantener el proyecto accesible.
El procedimiento contempló:
>>>>>>> f7dae8528c8c71b715dce570ff78d26675edf8be

Vinculación del repositorio con Render.

Configuración del servicio para que se enfocara en la carpeta backend.

<<<<<<< HEAD
=======
## Problemas 
>>>>>>> f7dae8528c8c71b715dce570ff78d26675edf8be
Se presentó inicialmente un problema: Render estaba configurado por defecto para desplegar la rama main, mientras que los cambios efectuados se encontraban en la rama test.
Tras identificar esta situación, se ajustó la configuración para que el servicio utilizara la rama correcta. Una vez realizado el cambio, el despliegue funcionó correctamente.


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
<<<<<<< HEAD
![sobrepeso](./images/sobrepeso.png)
=======
![sobrepeso](./images/sobrepeso.png) 
>>>>>>> f7dae8528c8c71b715dce570ff78d26675edf8be
