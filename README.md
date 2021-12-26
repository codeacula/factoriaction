## Development

### Requirements

- Node
- Docker & Docker Compose

### Recommended VS Code Extensions

- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Sass](https://marketplace.visualstudio.com/items?itemName=Syler.sass-indented)
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Setup

1. Create a `.env` file at the root of the project
1. Add a line inside of `.env` that points `FACTORIACTION_PATH` to the root location of the project. Example: `FACTORIACTION_PATH=/c/Projects/factoriation`

### Steps

1. Run `npm install`
1. Run `docker-compose build` at root
1. Run `docker-compose up`
