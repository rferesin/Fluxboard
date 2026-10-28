# Fluxboard

Kanban estilo Trello em Angular 19 para praticar estado, componentes standalone, Reactive Forms, guards, interceptors e organizacao de uma aplicacao maior.

Nome do repositorio Git sugerido: `fluxboard`

## Stack

- Angular 19 (standalone components, signals)
- Angular CDK Drag and Drop
- Reactive Forms
- HttpClient com interceptor fake (sem backend real)
- SCSS

## Arquitetura

```text
src/app/
  core/                 regras globais e estado
    data/               seed de usuarios e tarefas
    guards/             protecao de rotas
    interceptors/       auth header + API fake
    models/             contratos (User, Task, Auth)
    services/           Auth, Task, User, Modal, Storage
  shared/               pecas reutilizaveis
    components/         avatar, task-card, modal
    directives/         autofocus, click-outside
    pipes/              priority, status, initials, relative-date
  features/             dominios da aplicacao
    auth/               login fake
    board/              colunas e drag and drop
    tasks/              formulario reativo do card
    users/              membros e carga de trabalho
  layout/               header, sidebar, shell autenticado
  app.routes.ts
```

Cada pasta tem uma responsabilidade:

- `core` nao renderiza UI. Guarda modelos, persistencia e regras de acesso.
- `shared` so recebe dados e emite eventos. Nao conhece rotas.
- `features` orquestra um caso de uso (login, board, membros).
- `layout` monta o chrome autenticado e abre o modal global.

## Fluxo da aplicacao

1. O usuario acessa `/login`. O `guestGuard` impede quem ja esta autenticado.
2. O formulario reativo envia `POST /api/auth/login`.
3. O `fakeApiInterceptor` valida email/senha contra o seed e devolve token + usuario.
4. O `AuthService` persiste a sessao no `localStorage` e redireciona para `/board`.
5. O `ShellComponent` carrega usuarios e tarefas via HttpClient.
6. O `authInterceptor` anexa `Authorization: Bearer <token>` em toda request.
7. O `TaskService` mantem o estado em signals: lista, filtros, agrupamento por coluna.
8. Cards podem ser criados/editados no modal, pesquisados no header, filtrados na sidebar e movidos com drag and drop.
9. Mutacoes voltam pelo interceptor, que grava no `localStorage`. Recarregar a pagina preserva o board.

```text
LoginComponent
  -> HttpClient POST /api/auth/login
  -> fakeApiInterceptor
  -> AuthService.persist()
  -> Router /board

ShellComponent
  -> UserService.load() + TaskService.load()
  -> BoardPageComponent
       -> BoardColumnComponent (CDK drop)
            -> TaskCardComponent
  -> TaskFormComponent (Reactive Forms + ModalService)
```

## Login fake

| Nome          | Email                  | Senha      |
| ------------- | ---------------------- | ---------- |
| Ana Ribeiro   | ana@fluxboard.dev      | ana123     |
| Marcos Lima   | marcos@fluxboard.dev   | marcos123  |
| Helena Costa  | helena@fluxboard.dev   | helena123  |
| Pedro Alves   | pedro@fluxboard.dev    | pedro123   |

## Como rodar na maquina

Requisitos: Node.js 18+ e npm.

```bash
git clone <url-do-repositorio> fluxboard
cd fluxboard
npm install
npm start
```

Abra `http://localhost:4200`.

Outros comandos:

```bash
npm run build
npm test
```

O `ng serve` escuta em `0.0.0.0:4200` e aceita hosts `*.monkeycode-ai.live` para preview remoto.

## Persistencia

Chaves no `localStorage`:

- `fluxboard.session` sessao autenticada
- `fluxboard.users` lista de membros
- `fluxboard.tasks` cards do board

Para resetar o seed, limpe essas chaves no DevTools e recarregue.

## Funcionalidades

- Login fake com contas de demo
- Board com TODO, IN PROGRESS e DONE
- Cards com prioridade, labels, prazo e responsavel
- Drag and drop entre colunas e reordenacao
- Filtros por prioridade, membro e label
- Pesquisa por titulo e descricao
- Modal de criar/editar com Reactive Forms
- Pagina de membros com carga por status
- Guards de autenticacao e de visitante
