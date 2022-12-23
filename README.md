# TEGO APP API 🦷

### Pre-requisitos (recomendados) 📋

* Node v16.15.0.
* MariaDB v10.3.34.
* npm v8.5.5.

### Instalación en ambiente de desarrollo 🛠️
_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo._


**1. Instalación de dependencias**

Una vez clonado el proyecto, se debe instalar las dependencias, para ello se ejecuta el siguiente comando en el direcitorio **/tego-app-api** 

```
npm install
```


**2. Configurar variables de entorno**

Una vez instaladas las dependencias se debe configurar el .env 

**/tego-app-api**

```
PORT=3005
MYSQL_HOST=localhost
MYSQL_USER=nombre_usuario_de_base_de_datos
MYSQL_PASS=clave_usuario_de_base_de_datos
MYSQL_DB=nombre_bd
SECRETORPRIVATEKEY=2b1dfe495657b774eeba5e7853203bda
ALLOWED_ORIGIN=http://localhost:3005
```

**3. Correr el proyecto**

Para correr el proyecto y verificar que la conexión a la base de datos es correcta, en el directorio **/teleodontoapi** ejecuta:

```
npm run dev
```



---
Escrito con 🥳 por [Yayodelmal](https://github.com/yayodelmal)
