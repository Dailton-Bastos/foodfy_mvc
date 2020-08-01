<h1 align="center">
  <img src=".github/logo.png" alt="Chef Foodfy" width="350px">
</h1>

<h1 align="center">Foodfy</h1>

<p align="center">
  O Foodfy é um site completo com as melhores receitas culinárias, dos melhores chefs de cozinha do mundo.
</p>

<p align="center">
  <a href="#technologies">Tecnologias</a> |
  <a href="#about">Sobre o projeto</a> |
  <a href="#how-to-use">Como usar</a>
</p>

![Image][home-site]

<a id="technologies"></a>

## :rocket: Tecnologias

Este projeto é um dos desafios proposto pela [**Rocketseat**][rocketseat-url] e foi desenvolvido com as tecnologias:

- [Node.js][nodejs]
- [Express]
- [Express-session]
- [Nunjucks]
- [Bcrypt.js][bcryptjs]
- [Multer]
- [PostgreSQL][postgre]
- [Connect-pg-simple][cpsimple]
- [Method-override][m-override]
- [Redis]
- [Bee-Queue][bee]
- [Nodemailer]
- [Nodemon]
- [Browser-sync]
- [VS Code][vscode] com [EditorConfig][editor-config], [ESlint][lint] e [Prettier - Code formatter][prettier]

<a id="about"></a>

## :heart_eyes: Sobre o projeto

O **Foodfy** é um sistema completo, onde é possível, criar, atualizar e remover receitas culinárias, chefes de cozinha e usuários, tudo isso é feito pela área administrativa do sistema.

![Image][login-gif]

**Novo usuário**

Apos o cadastro o novo usuário receberá via email a senha de acesso ao sistema.

![Image][user-new]

**Listagem de todos os usuários cadastrados**

![Image][user-list]

**Listagem de todas receitas cadastradas**

![Image][recipe-list]

**Listagem de todos chefs cadastrados**

![Image][chef-list]

**As listagem** de receitas e chefs continuam acessíveis a todos, tanto para usuários do sistema como para visitantes do site.

![Image][chef-info]

<a id="how-to-use"></a>

## :information_source: Como usar

É preciso ter o [Git], [Node.js v10.16][nodejs] ou superior + [Yarn v1.13][yarn] ou superior instalados em seu computador,
para **persistência de dados** é preciso ter o [PostgreSQL][postgre] e o [Redis][redis].

Tanto o PostgreSQL e o Redis podem ser instalados facilmente via [**Docker**](https://www.docker.com/)

```bash
# Instalando o banco de dados

$ docker run --name myDB -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

```bash
# Instalando o Redis

$ docker run --name redisfoodfy -p 6379:6379 -d -t redis:alpine
```

```bash
# Baixando o repositório

$ git clone https://github.com/Dailton-Bastos/foodfy_mvc.git
```

Crie o banco de dados a partir do arquivo `foodfy.sql`

Renomeie o arquivo `.env.example` para `.env` e adicione suas variáveis de ambiente.

```bash
# Instale as dependências do projeto

$ cd foodfy_mvc

$ yarn install

# Para iniciar o servidor

$ yarn dev
```

Aplicação estará disponível em `http://localhost:3000` em seu navegador.

---

Feito com :heart: por **Dailton Bastos**

[home-site]: .github/assets/home.png
[login-gif]: .github/assets/login.gif
[user-new]: .github/assets/user.png
[user-list]: .github/assets/user-list.png
[recipe-list]: .github/assets/adm-recipes.png
[chef-list]: .github/assets/chefs-list.png
[recipes-site]: .github/assets/recipes-site.png
[chef-info]: .github/assets/chef-info.png
[rocketseat-url]: https://github.com/Rocketseat/bootcamp-launchbase-desafios-02/blob/master/desafios/02-foodfy.md
[nodejs]: https://nodejs.org/en/
[express]: https://www.npmjs.com/package/express
[express-session]: https://www.npmjs.com/package/express-session
[nunjucks]: https://www.npmjs.com/package/nunjucks
[bcryptjs]: https://www.npmjs.com/package/bcryptjs
[multer]: https://www.npmjs.com/package/multer
[postgre]: https://www.postgresql.org/
[cpsimple]: https://www.npmjs.com/package/connect-pg-simple
[m-override]: https://www.npmjs.com/package/method-override
[redis]: https://redis.io/
[bee]: https://github.com/bee-queue/bee-queue
[nodemailer]: https://www.npmjs.com/package/nodemailer
[nodemon]: https://www.npmjs.com/package/nodemon
[browser-sync]: https://www.npmjs.com/package/browser-sync
[vscode]: https://code.visualstudio.com/
[editor-config]: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
[lint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[yarn]: https://yarnpkg.com/
[git]: https://git-scm.com/
