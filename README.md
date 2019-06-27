#Instalação

```npm i``` no seu terminal

De posse de uma instalação do MySQL ou MariaDB, faça ```CREATE DATABASE nomequedesejar;```; depois ```USE nomequedesejar;``` e então 
```CREATE TABLE users(login varchar(255) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY (login));```.

Crie um arquivo chamado ```config.js``` baseado no ```config-example.js```, preenchendo com as devidas informações do seu
bd.

Após isso, crie um arquivo chamado ```.env``` baseado no ```.env.example```, contendo a sua chave (quaisquer caracteres) de encriptação para o JWT.

#Iniciar

Em seu terminal, ```npm run dev```.

#Pra que?
Baseado nos requisitos aqui[https://github.com/yanzmtbr/full-stack-test/blob/master/README.md] mostrados.