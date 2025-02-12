# Backend Coding Challenge

Code Challenge para candidatos Backed en Koibanx.

## Tabla de contenidos

<details open="open">
  <summary>Menú</summary>
  <ol>
    <li>
        <a href="#sobre-el-proyecto">🗂️ Sobre el proyecto</a>
      <ul>
        <li><a href="#contexto">🔍 Contexto</a></li>
        <li><a href="#requerimientos-del-producto">📋 Requerimientos del producto</a></li>
      </ul>
    </li>
    <li><a href="#construido-con">🛠️ Construido con</a></li>
    <li>
      <a href="#comenzando">🚀 Comenzando</a>
      <ul>
        <li><a href="#pre-requisitos">📋 Pre-requisitos</a></li>
        <li><a href="#instalación">🔧 Instalación</a></li>
        <li><a href="#variables-de-entorno">📌 Variables de entorno</a></li>
        <li><a href="#configuracion-de-variables-de-entorno">🛠️ Configuracion de variables de entorno</a></li>
      </ul>
    </li>
    <li><a href="#despliegue">📦 Despliegue y Testing</a></li>
    <li><a href="#documentación">📄 Documentación</a></li>
  </ol>
</details>

## Sobre el proyecto

### Contexto

Se requiere un servicio de carga de planillas de cálculo Excel con validación de formato y notificación de
procesamiento.

### Requerimientos del producto
- 
- El ejercicio debe ser resuelto en NodeJS utilizando Express para la interfaz HTTP y MongoDB como base de datos NoSQL. (Se puede y se recomienda utilizar Mongoose como ORM).
- La API debe respetar formato REST con correcto mapeo de errores.
- Los endpoints deben ser permisionados.
- No se requiere desarrollar un endpoint de login.
- Se evaluará la calidad de código, testing de funcionalidades, diseño de arquitectura, y usabilidad de la API.

## Construido con

* [Nodejs](https://nodejs.org/es)
* [Express](https://expressjs.com/es/)
* [Typestack](https://github.com/typestack)
* [Mongoose](https://mongoosejs.com/)

## Comenzando

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos
de desarrollo y pruebas.

### Prerrequisitos

* [NodeJS latest](https://nodejs.org/en/)
* [Mongodb](https://www.mongodb.com/es)

### Instalación

Clonar el repositorio.

```sh
git clone https://github.com/cristsr/koibanx-challenge
```

Instalar paquetes de NPM.

```sh
npm install
```

### Variables de entorno
Para el correcto funcionamiento de la aplicación se deben definir las siguientes variables de entorno:

| Variable        | Valores por defecto                                  | Descripción                               |
|-----------------|------------------------------------------------------|-------------------------------------------|
| ENV             | local                                                | Ambiente de ejecución                     |
| PORT            | 3000                                                 | Puerto de la app                          | 
| DB_URI          | postgres://postgres:postgres@localhost:5432/postgres | URI de la base de datos                   |


### Configuración de variables de entorno

En la raíz del proyecto se encuentra el archivo **.envexample** el cual se debe duplicar o copiar en un archivo nuevo
que se debe llamar **.env**

En windows:
```sh
$ copy .envexample .env
```

En linux:
```sh
$ cp .envexample .env
```

Una vez que se ha copiado el archivo, se debe editar el archivo **.env** para que contenga los valores de las variables de entorno.

> 🚧 Nota
>
> Por cuestiones de seguridad, la variable de entorno **DB_URI** se proporciona por correo electrónico, junto al enlace del repositorio

## Despliegue y testing

### Despliegue
Ejecutar `npm run dev` en la terminal para iniciar la aplicación.

Adicional se generó la documentación de la api con [Documenter](https://documenter.getpostman.com/view/5594760/2sAYXBGKjq)

También puede importar la colección: [![Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/styven21121/koibanx/collection/n1nyxj4/coinbanx?action=share&source=copy-link&creator=5594760)
