# Robô Crawler

Prova de conceito para um robô crawler com Cheerio e Puppeteer

## Getting Started

Essas instruções fornecerão uma cópia do projeto rodando na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

Você vai precisar dos seguintes softwares instalados na sua máquina
- [Node.js](https://nodejs.org/en/download/) (>= 8.1.3 obrigatório)

### Instalação

Clone o repositório

```
git clone https://github.com/IuryPiva/crawler-robot.git
```

Navegue até a pasta criada

```
cd crawler-robot
```

Instale as dependências do projeto

```
npm install
```

Inicie o servidor
```
npm start
```

O servidor está pronto para receber requisições, exemplo:
```
curl -d '{"checkin":"27102019", "checkout":"28102019"}' -H "Content-Type: application/json" -X POST http://localhost:3000/buscar
```

## Construído com

* [Cheerio](https://github.com/cheeriojs/cheerio) - Implementation of core jQuery designed specifically for the server.
* [Express](https://expressjs.com/) - Minimalist web framework for Node.js.
* [Puppeteer](https://developers.google.com/web/tools/puppeteer) - A Node library which provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol.

## Autor

* **Iury Dias Piva** - [IuryPiva](https://github.com/iurypiva)
