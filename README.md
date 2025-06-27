# Projeto FIAP M05 Hackaton

Este projeto contém quatro microfrontends desenvolvidos em React, para o Hackaton do módulo 5 da pós em Front-End Engineering.

## Estrutura do Projeto

```
/fiap-hackaton-web (root)
└── packages
   ├── host
   ├── remote_goals
   ├── remote_login
   ├── remote_sales
   └── remote_stock
```

### Descrição dos Serviços

1. **Host**
   - Local: `packages/host`
   - Descrição: Microfrontend em React que orquestra os demais microfrontends..
   - Porta: `5000`

2. **Remote Login**
   - Local: `packages/remote_login`
   - Descrição: Microfrontend em React que fornece a tela de login.
   - Porta: `5001`
   
2. **Remote Sales**
   - Local: `packages/remote_sales`
   - Descrição: Microfrontend em React que fornece o painel de vendas.
   - Porta: `5002`
   
2. **Remote Stock**
   - Local: `packages/remote_stock em React que fornece o painel de estoque.
   - Porta: `5003`
   
2. **Remote Goals**
   - Local: `packages/remote_goals`
   - Descrição: Microfrontend em React que fornece o painel de metas.
   - Porta: `5004`

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados no seu sistema:

- [PNPM](https://pnpm.io/pt/)

## Como Executar o Projeto

### 1. Clonar o Repositório

Clone este repositório e navegue até o diretório raiz:

```bash
git clone https://github.com/Gabsato02/fiap-hackaton-web
cd packages
```

### 2. Construir e Executar os Serviços

Para desenvolvimento, executar na raiz `pnpm install` e depois `pnpm build`. Ou, se quiser executar individualmente, executar `pnpm run build` na pasta do microfrontend.

### 3. Verificar os Serviços

Acesse os serviços nos seguintes endereços:

- **Host**: [http://localhost:5000](http://localhost:5000)
- **Remote Login**: [http://localhost:5001](http://localhost:5001)
- **Remote Sales**: [http://localhost:5002](http://localhost:5002)
- **Remote Stock**: [http://localhost:5003](http://localhost:5003)
- **Remote Goals**:: [http://localhost:5004](http://localhost:5004)


## Notas

- Certifique-se de que as portas necessárias (`5000`, `5001`, `5002`, `5003`, `5004`) estão livres no seu sistema.
