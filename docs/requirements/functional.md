# Requisitos Funcionais (RF)

Requisitos Funcionais são funcionalidades que o sistema deve realizar, ou seja, descrevem o que o sistema faz.
Abaixo, estão listados e explicados todos os requisitos funcionais do FitX.

## RF01. Cadastro e Autenticação de Usuários

- O sistema deve permitir o cadastro de dois tipos de usuários: profissionais com registro no CREF (Conselho Regional de Educação Física) e clientes (usuários comuns).

- O sistema deve permitir login e logout com e-mail ou número de contato e senha.

- Deve haver uma forma do usuário consultar o número do CREF de um profissional em sites oficiais.

## RF02. Criação e Gerenciamento de Treinos

- O profissional deve poder criar, editar e excluir planos de treino para cada cliente.

- O plano deve permitir cadastrar exercícios, definir grupos musculares, séries, repetições, intervalos, observações e outros detalhes sobre os treinos.

## RF03. Registro de Treinos pelo Aluno

- O aluno deve poder registrar o peso utilizado e o número de repetições realizadas em cada exercício.

- O aluno deve poder registrar observações ou críticas a um treino e enviá-las ao profissional.

- O aluno deve poder visualizar o histórico de treinos realizados.

## RF04. Definição de Metas Automáticas

- O sistema deve sugerir metas automáticas com base no desempenho do aluno no treino anterior.

- O profissional deve receber essas metas para aprovação ou edição, antes de serem exibidas ao aluno.

## RF05. Relatórios e Gráficos de Evolução

- O sistema deve gerar relatórios básicos com os dados registrados pelo aluno.

- O sistema deve permitir ao profissional (ou ao aluno) visualizar gráficos com a evolução baseada nos elementos da composição corporal e do desempenho nos treinos:

    - Massa magra

    - Percentual de gordura

    - Massa óssea

    - Água corporal

    - Peso utilizado nas séries

    - Repetições feitas nas séries

**Obs**: Os dados da composição corporal devem ser enviados pelo aluno e validados pelo profissional.

## RF06. Busca e Contratação de Profissionais

- O cliente deve poder pesquisar por profissionais cadastrados no aplicativo.

- Deve ser possível visualizar o perfil e avaliações de cada profissional.

- O cliente pode solicitar a contratação de um profissional diretamente pela plataforma.

## RF07. Pagamentos Integrados

- O sistema deve permitir o pagamento dos serviços diretamente pela plataforma.

- O cliente deve visualizar planos ou pacotes oferecidos pelo profissional.

## RF08. Chatbot de Suporte

O sistema deve disponibilizar um chatbot com respostas baseadas em regras para:

- Dúvidas sobre o uso da plataforma.

- Dúvidas básicas sobre treinos, musculatura ou exercícios.