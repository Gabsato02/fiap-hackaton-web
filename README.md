# FIAP Farms - Gestão Agrícola com Microfrontends 🚀

## 🎯 Sobre o Projeto

O **FIAP Farms** é uma solução web moderna para gestão no agronegócio, desenvolvida como projeto para o Hackathon do Módulo 5 da Pós-Graduação em Front-End Engineering da FIAP. A aplicação foi construída utilizando uma **arquitetura de microfrontends** com React, Vite e Module Federation.

Esta abordagem permite que cada funcionalidade principal — **Login, Vendas, Estoque/Produção e Metas** — seja um aplicativo independente (remoto), orquestrado por uma aplicação central (host). Isso resulta em um sistema modular, escalável e de fácil manutenção, onde diferentes equipes poderiam trabalhar em funcionalidades de forma paralela.

---

## ✨ Principais Funcionalidades

A plataforma oferece uma experiência integrada em que cada microfrontend, embora independente, consome dados e estado compartilhado, criando um fluxo de trabalho coeso e automatizado.

### 📈 Vendas (`remote_sales`)

Otimiza o controle comercial com ferramentas visuais e de registro.

- **Registro de transações** com dedução automática do inventário, garantindo a consistência dos dados.
- **Histórico de vendas** com filtros dinâmicos e ordenação por nome, quantidade, data ou valor.
- **Dashboard visual** com um gráfico de pizza (`Chart.js`) para análise da performance de cada produto.

### 📦 Estoque e Produção (`remote_stock`)

Gerencia tanto o inventário de produtos prontos quanto o ciclo de vida da produção.

- **Gerenciamento do Catálogo:** Controle total (CRUD) sobre os produtos disponíveis no estoque.
- **Controle de Produção:** Rastreia lotes de produção desde o início até a colheita.
- **Integração total:** A colheita de um lote em "Produção" **automaticamente** atualiza a quantidade do produto correspondente em "Estoque".

### 🏆 Metas e Acompanhamento (`remote_goals`)

Define objetivos estratégicos e monitora o progresso em tempo real.

- **Criação de Metas:** Definição de metas de **Vendas** (baseadas em valor R$) ou de **Produção** (baseadas em quantidade de um produto específico).
- **Acompanhamento de Progresso:** Barras de progresso visuais são atualizadas dinamicamente conforme novas vendas ou colheitas são registradas.
- **Cálculo Automático:** O sistema consulta o Firestore em tempo real para calcular e exibir o avanço de cada meta.

### 🤝 Estado Global Compartilhado (`host` + `zustand`)

Um dos pilares da arquitetura é o gerenciamento de estado centralizado.

- **Fonte Única da Verdade:** A aplicação `host` utiliza **Zustand** para gerenciar o estado global, como dados do usuário e a lista de produtos.
- **Consumo pelos Remotes:** Os microfrontends (`remote_sales`, `remote_stock`, etc.) consomem esse estado compartilhado através do Module Federation, garantindo que toda a aplicação reaja de forma consistente às mudanças.

---

## 🏛️ Arquitetura e Padrões de Projeto

A estrutura do projeto foi desenhada para refletir as melhores práticas de desenvolvimento front-end moderno.

- **Arquitetura de Microfrontends:** Utiliza **Vite Module Federation** para criar um sistema distribuído. A aplicação `host` atua como um "shell", renderizando os `remotes` com base na navegação do usuário. Cada parte opera em sua própria porta (`5000` a `5004`), simulando um ambiente de desenvolvimento com equipes e implantações independentes.

- **Monorepo com PNPM Workspaces:** O código é organizado em um monorepo gerenciado pelo `pnpm`. Isso centraliza as dependências, otimiza a instalação e simplifica a execução de scripts em todos os pacotes simultaneamente.

- **Separação de Responsabilidades:** Dentro de cada microfrontend (`packages/remote_*`), o código é estruturado de forma similar aos princípios da **Clean Architecture**, promovendo desacoplamento e testabilidade:
  - `domain`: Contém as entidades e tipos de negócio.
  - `infrastructure`: Implementa a lógica de acesso a dados (ex: repositórios do Firebase).
  - `presentation`: Camada responsável pela UI (views, componentes, hooks visuais).

A estrutura de diretórios reflete esses conceitos:

```
/fiap-hackaton-web (root)
├── packages/
│   ├── host/               # Orquestrador (Shell) + Store Zustand
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   ├── presentation/
│   │   │   └── store/      # Estado global com Zustand
│   │   └── vite.config.js  # Expõe e consome MFEs
│   │
│   ├── remote_login/       # MFE de Autenticação
│   ├── remote_sales/       # MFE de Vendas
│   ├── remote_stock/       # MFE de Estoque e Produção
│   └── remote_goals/       # MFE de Metas
│
├── pnpm-workspace.yaml     # Configuração do Monorepo
└── package.json            # Scripts para rodar todo o projeto
```

---

## 🛠️ Stack de Tecnologias

#### Core e Frameworks

- **React `18.x`**
- **TypeScript**
- **Vite** como build tool

#### Arquitetura

- **Vite Plugin Federation**: Para implementação de Microfrontends.
- **PNPM Workspaces**: Para gerenciamento do Monorepo.

#### Backend (BaaS)

- **Firebase Auth**: Autenticação de usuários (Google e E-mail).
- **Cloud Firestore**: Banco de dados NoSQL para vendas, produtos e metas.

#### Gerenciamento de Estado

- **Zustand**: Para um estado global, reativo e centralizado no `host`.

#### UI e Visualização de Dados

- **Material-UI (MUI)**: Biblioteca de componentes para a interface.
- **Chart.js**: Gráficos de pizza para o dashboard de vendas.

#### Ferramentas

- **ESLint**: Análise estática de código.
- **Prettier**: Formatador de código.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **[PNPM](https://pnpm.io/pt/installation)**: Certifique-se de ter o PNPM instalado globalmente.

### Passos

1.  **Clone o Repositório**

    ```bash
    git clone https://github.com/Gabsato02/fiap-hackaton-web
    cd fiap-hackaton-web
    ```

2.  **Instale as Dependências**
    Execute o comando na raiz do projeto. O PNPM instalará as dependências para todos os pacotes do workspace.

    ```bash
    pnpm install
    ```

3.  **Execute em Modo de Desenvolvimento**
    Este comando subirá todas as aplicações (host e remotes) simultaneamente em suas respectivas portas.

    ```bash
    pnpm dev
    ```

4.  **Acesse os Serviços**
    Após a execução, os serviços estarão disponíveis nos seguintes endereços:
    - **Aplicação Principal (Host)**: [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)
    - **Login**: [http://localhost:5001](https://www.google.com/search?q=http://localhost:5001)
    - **Vendas**: [http://localhost:5002](https://www.google.com/search?q=http://localhost:5002)
    - **Estoque**: [http://localhost:5003](https://www.google.com/search?q=http://localhost:5003)
    - **Metas**: [http://localhost:5004](https://www.google.com/search?q=http://localhost:5004)

> **Nota**: Para que a aplicação funcione corretamente, todos os serviços precisam estar rodando. O comando `pnpm dev` cuida disso para você.
