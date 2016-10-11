# ASS-Grupo2
GeoChat

Para hacerlo funcionar deben:


PSQL:

Deben instalar psql.

Crear una bd que se llame geochat en psql. Debe estar en el puerto 5432 (puerto default de psql)

Pueden correr en el terminal:

	node database/sql/create.js
	Para crear las tablas necesarias (en este caso es una)

	node database/sql/drop.js
	Borra todo lo que está en la bd pero no la bd.



MONGO:

Deben instalar mongodb.

Yo uso robomongo para ver las bases de datos, lo recomiendo.

Antes de correr el programa debe estar abierta la bd. Para esto hay que correr en el terminal el siguiente comando:
 sudo mongod

Pueden correr:

	node database/mongo/seed.js

Para crear algunos lugares. Hasta el momento solo tienen nombre.


Una vez que este todo listo y las bd abiertas

npm install

y después

npm start
