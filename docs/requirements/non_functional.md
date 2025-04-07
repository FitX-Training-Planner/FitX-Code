# Requisitos Não Funcionais (RNF)

Requisitos não funcionais são propriedades que descrevem como o sistema se comporta, como desempenho, segurança e usabilidade. Abaixo, estão listados e explicados todos os requisitos não funcionais do FitX.

## RNF01. Responsividade

O sistema deve ser responsivo e funcionar corretamente em dispositivos móveis, tablets e desktops.

## RNF02. Segurança

- Os dados pessoais dos usuários devem ser armazenados de forma segura utilizando criptografia e hash.

- O sistema deve utilizar HTTPS para comunicação segura.

- O acesso a informações deve respeitar os níveis de permissão (ex: um cliente não pode editar treino de outro cliente).

- Os serviços do aplicativo devem ser disponibilizados somente para usuários autenticados.

## RNF03. Escalabilidade

O sistema deve ser projetado para poder ser escalado facilmente caso o número de usuários cresça.

## RNF04. Usabilidade

- A interface deve ser intuitiva e acessível para usuários com pouco conhecimento técnico.

- Deve haver instruções claras para uso das principais funcionalidades.

- O aplicativos deve ter duas opções de linguagem, sendo uma o português e a outra o inglês.

- Deve haver um tema claro e outro escuro para o app, disponíveis para o usuário alternar quando desejar.

## RNF05. Compatibilidade

O sistema deve ser compatível com os navegadores modernos: Chrome, Firefox, Edge e Safari.

## RNF06. Manutenibilidade

O código deve seguir padrões e boas práticas para facilitar manutenção e atualização futura.