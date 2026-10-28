import { Task } from '../models/task.model';
import { User } from '../models/user.model';

export const SEED_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Ana Ribeiro',
    email: 'ana@fluxboard.dev',
    password: 'ana123',
    avatarColor: '#5b8def',
    initials: 'AR',
    role: 'admin'
  },
  {
    id: 'u-2',
    name: 'Marcos Lima',
    email: 'marcos@fluxboard.dev',
    password: 'marcos123',
    avatarColor: '#c084fc',
    initials: 'ML',
    role: 'member'
  },
  {
    id: 'u-3',
    name: 'Helena Costa',
    email: 'helena@fluxboard.dev',
    password: 'helena123',
    avatarColor: '#3dcc8a',
    initials: 'HC',
    role: 'member'
  },
  {
    id: 'u-4',
    name: 'Pedro Alves',
    email: 'pedro@fluxboard.dev',
    password: 'pedro123',
    avatarColor: '#f0b429',
    initials: 'PA',
    role: 'member'
  }
];

export const SEED_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Mapear fluxo de autenticacao',
    description: 'Documentar o login fake, guards e persistencia da sessao no localStorage.',
    status: 'todo',
    priority: 'high',
    labels: ['docs', 'feature'],
    assigneeId: 'u-1',
    createdBy: 'u-1',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
    dueDate: '2026-11-02',
    order: 0
  },
  {
    id: 't-2',
    title: 'Desenhar colunas do board',
    description: 'Definir estados TODO, IN PROGRESS e DONE com contagem de cards.',
    status: 'todo',
    priority: 'medium',
    labels: ['feature'],
    assigneeId: 'u-2',
    createdBy: 'u-1',
    createdAt: '2026-10-21T09:00:00.000Z',
    updatedAt: '2026-10-21T09:00:00.000Z',
    dueDate: '2026-11-04',
    order: 1
  },
  {
    id: 't-3',
    title: 'Corrigir overflow do card longo',
    description: 'Titulos extensos estao quebrando o layout da coluna em telas menores.',
    status: 'todo',
    priority: 'urgent',
    labels: ['bug'],
    assigneeId: 'u-3',
    createdBy: 'u-2',
    createdAt: '2026-10-22T14:30:00.000Z',
    updatedAt: '2026-10-22T14:30:00.000Z',
    dueDate: '2026-10-30',
    order: 2
  },
  {
    id: 't-4',
    title: 'Filtro por prioridade',
    description: 'Permitir filtrar cards por baixa, media, alta e urgente.',
    status: 'in-progress',
    priority: 'high',
    labels: ['feature'],
    assigneeId: 'u-1',
    createdBy: 'u-1',
    createdAt: '2026-10-18T11:00:00.000Z',
    updatedAt: '2026-10-26T16:00:00.000Z',
    dueDate: '2026-10-31',
    order: 0
  },
  {
    id: 't-5',
    title: 'Pesquisa por titulo e descricao',
    description: 'Busca instantanea no header, destacando o termo encontrado no card.',
    status: 'in-progress',
    priority: 'medium',
    labels: ['improvement'],
    assigneeId: 'u-4',
    createdBy: 'u-1',
    createdAt: '2026-10-19T08:15:00.000Z',
    updatedAt: '2026-10-27T09:40:00.000Z',
    dueDate: '2026-11-05',
    order: 1
  },
  {
    id: 't-6',
    title: 'Drag and drop entre colunas',
    description: 'Mover cards com Angular CDK e persistir o novo status.',
    status: 'in-progress',
    priority: 'urgent',
    labels: ['feature'],
    assigneeId: 'u-2',
    createdBy: 'u-1',
    createdAt: '2026-10-17T13:00:00.000Z',
    updatedAt: '2026-10-27T18:20:00.000Z',
    dueDate: '2026-10-29',
    order: 2
  },
  {
    id: 't-7',
    title: 'Modal de criacao de tarefa',
    description: 'Formulario reativo com validacao de titulo, prioridade e responsavel.',
    status: 'done',
    priority: 'high',
    labels: ['feature'],
    assigneeId: 'u-3',
    createdBy: 'u-1',
    createdAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-24T12:00:00.000Z',
    dueDate: '2026-10-25',
    order: 0
  },
  {
    id: 't-8',
    title: 'Guards de rota',
    description: 'Proteger o board para usuarios autenticados e o login para visitantes.',
    status: 'done',
    priority: 'medium',
    labels: ['feature', 'docs'],
    assigneeId: 'u-1',
    createdBy: 'u-1',
    createdAt: '2026-10-10T09:00:00.000Z',
    updatedAt: '2026-10-23T11:30:00.000Z',
    dueDate: '2026-10-24',
    order: 1
  },
  {
    id: 't-9',
    title: 'Pagina de membros',
    description: 'Listar usuarios do time com quantidade de tarefas por status.',
    status: 'done',
    priority: 'low',
    labels: ['improvement'],
    assigneeId: 'u-4',
    createdBy: 'u-2',
    createdAt: '2026-10-11T15:00:00.000Z',
    updatedAt: '2026-10-22T17:00:00.000Z',
    dueDate: null,
    order: 2
  },
  {
    id: 't-10',
    title: 'Ajustar contraste dos labels',
    description: 'Labels de bug e docs precisam de mais contraste no tema escuro.',
    status: 'todo',
    priority: 'low',
    labels: ['bug', 'improvement'],
    assigneeId: null,
    createdBy: 'u-3',
    createdAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-25T10:00:00.000Z',
    dueDate: '2026-11-08',
    order: 3
  },
  {
    id: 't-11',
    title: 'Persistir ordem dos cards',
    description: 'Salvar a posicao relativa de cada card apos o rearrange na mesma coluna.',
    status: 'in-progress',
    priority: 'medium',
    labels: ['improvement'],
    assigneeId: 'u-2',
    createdBy: 'u-1',
    createdAt: '2026-10-23T12:00:00.000Z',
    updatedAt: '2026-10-27T12:00:00.000Z',
    dueDate: '2026-11-03',
    order: 3
  },
  {
    id: 't-12',
    title: 'README de onboarding',
    description: 'Explicar arquitetura, fluxo de dados e como subir o projeto localmente.',
    status: 'done',
    priority: 'low',
    labels: ['docs'],
    assigneeId: 'u-1',
    createdBy: 'u-1',
    createdAt: '2026-10-08T08:00:00.000Z',
    updatedAt: '2026-10-21T08:00:00.000Z',
    dueDate: null,
    order: 3
  }
];
