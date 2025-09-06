<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

 # Ejecutar en desarrollo
 1. Clonar repositorio
 2. Ejecutar 
 ```
 yarn install

 ```

 3. Tener nest cli instalado
 ```
npm i -g @nestjs/cli

 ```
 4. Levantar la base de datos

 ``` 
docker compose up -d

 ```

 5. Clonar el archivo __.envtemplate__ y renombrar la copia a .env

 6. Rellenar las variables de entorno contenidas en el .env

 7. Ejecutar la aplicacion en dev: 
 ```
 yarn start:dev 
 
 ```

 7. Reconstruir la base de datos con la semilla
 ```
 localhost:3000/api/v2/seed
 
 ```

## Stack usado
*Nest
*MongoDB