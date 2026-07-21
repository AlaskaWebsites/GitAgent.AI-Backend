# **🗺️ Roadmap de Engenharia: GitAgent.AI (Atualização Técnica 2026/2027)**

Este roadmap foi desenhado para fechar de forma prática e cirúrgica as lacunas do mercado sênior atual. Cada fase foca em transformar a sua capacidade de "fazer dar certo" em **padrões de engenharia documentados e prontos para produção**.

## **🎯 Visão Geral do Sistema**

O **GitAgent.AI** lerá repositórios públicos do GitHub, usará um agente de IA de forma assíncrona para analisar a arquitetura do código e gerará automaticamente documentações (READMEs) e posts técnicos.

## **🛠️ Fase 1: Fundação Local & Arquitetura de Software (Semana 1\)**

*O objetivo aqui é estabelecer um ecossistema TypeScript profissional e à prova de balas no backend, utilizando NestJS 11 e Clean Architecture.*

### **🚀 O que você vai aplicar/aprender:**

* **Clean Architecture no NestJS:** Divisão rigorosa de camadas (Domain, Use Cases, Infrastructure) para garantir que seu código não dependa de frameworks.  
* **Dockerização de Ambiente:** Configurar o ecossistema local sem precisar instalar bancos ou filas diretamente no seu sistema operacional.

### **📋 Checklist de Execução:**

* \[ \] Criar o projeto NestJS 11 com TypeScript estrito.  
* \[ \] Configurar a estrutura de pastas do projeto seguindo Clean Architecture:  
  src/  
  ├── domain/         \# Entidades de negócio puro (Enterprise Business Rules)  
  ├── use-cases/      \# Lógica de aplicação (Application Business Rules)  
  └── infrastructure/ \# Express/Fastify, NestJS, Redis, Database, LLM API

* \[ \] Escrever o arquivo docker-compose.yml para subir um serviço local do Redis na porta 6379\.  
* \[ \] Implementar a validação estrita de variáveis de ambiente usando joi ou zod no NestJS.

## **🧠 Fase 2: O Cérebro \- Integração de IA & Fluxo de Agente (Semana 2\)**

*Aqui você entra de cabeça na Engenharia de IA de 2026\. Em vez de uma chamada de API simples, você criará um agente determinístico com etapas de pensamento (Chain of Thought).*

### **🚀 O que você vai aplicar/aprender:**

* **Google AI Studio (Gemini 1.5 Flash):** Consumir um dos modelos mais rápidos e eficientes do mercado de forma totalmente gratuita.  
* **Prompt Engineering Sênior:** Como instruir a LLM a retornar respostas estruturadas (JSON plano) sem alucinações.

### **📋 Checklist de Execução:**

* \[ \] Criar a sua chave de API gratuita no **Google AI Studio**.  
* \[ \] Criar o serviço de infraestrutura de IA no NestJS usando a SDK oficial do Google.  
* \[ \] Desenhar o pipeline de análise do agente:  
  * **Etapa 1:** Analisar a árvore de arquivos e dependências (package.json).  
  * **Etapa 2:** Analisar arquivos chave de arquitetura (src/main.ts, controladores, etc.).  
  * **Etapa 3:** Consolidar os relatórios e gerar a documentação em Markdown.  
* \[ \] Forçar a LLM a responder em formato JSON Schema estruturado para que seu código consiga ler e parsear a resposta sem quebras.

## **⚡ Fase 3: A Engrenagem de Escala \- Redis & BullMQ (Semana 3\)**

*Esta é a camada que separa o júnior do sênior. Você criará um fluxo assíncrono para que requisições pesadas de IA não travem a API principal ou sofram timeout.*

### **🚀 O que você vai aplicar/aprender:**

* **Arquitetura Orientada a Eventos/Trabalhos:** Desacoplar a requisição HTTP do processamento real.  
* **Gerenciamento de Ciclo de Vida de Jobs com BullMQ:** Controlar estados de filas, retentativas automáticas e prioridades.

### **📋 Checklist de Execução:**

* \[ \] Instalar o @nestjs/bullmq e bullmq no seu backend.  
* \[ \] Criar uma fila chamada repository-analysis.  
* \[ \] Implementar o **Producer (Produtor):** Um endpoint de API que aceita a URL do GitHub, gera um ID único para a tarefa, cria um job na fila e responde instantaneamente com status: "queued".  
* \[ \] Implementar o **Consumer (Consumidor/Worker):** Um processo isolado que escuta a fila, executa as etapas da Fase 2, e atualiza o estado no Redis.  
* \[ \] Configurar políticas de resiliência: se a API do Gemini der erro, o BullMQ deve tentar novamente até 3 vezes com espaçamento exponencial (backoff).

## **🎨 Fase 4: O Front-end Ultra-Performance \- Nuxt 3 ou Next.js (Semana 4\)**

*Criar uma interface moderna e rápida que mantenha o usuário atualizado em tempo real sobre o processamento do seu job.*

### **🚀 O que você vai aplicar/aprender:**

* **Core Web Vitals na prática:** Otimização real de LCP (Largest Contentful Paint) e CLS usando Tailwind e componentes leves.  
* **Atualização em tempo real:** Como mostrar o progresso do Worker (ex: "Lendo repositório...", "Processando IA...") usando WebSockets ou Server-Sent Events (SSE).

### **📋 Checklist de Execução:**

* \[ \] Iniciar o projeto front-end (Nuxt 3 ou Next.js) focado em performance.  
* \[ \] Criar uma UI limpa usando Tailwind CSS (Layout de página única, input do GitHub e painel de progresso).  
* \[ \] Conectar a interface ao backend para enviar a URL e escutar as atualizações de estado do Job.  
* \[ \] Implementar carregamento condicional de fontes e lazy loading de elementos visuais pesados para garantir pontuação de performance impecável.

## **🧪 Fase 5: Qualidade, Testes e DevOps de Produção (Semana 5\)**

*Garantir a integridade da aplicação com testes automatizados e publicar o sistema inteiro de forma gratuita, mas com robustez de nível enterprise.*

### **🚀 O que você vai aplicar/aprender:**

* **Testes com Vitest:** Testar a lógica de negócios e o fluxo das filas de forma rápida e moderna.  
* **Deploy Multi-Cloud:** Vercel (Front) \+ Render (Back) \+ Redis Cloud (Database/Fila).

### **📋 Checklist de Execução:**

* \[ \] Configurar o **Vitest** no backend e criar testes unitários para a camada de use-cases.  
* \[ \] Criar um banco de dados Redis gratuito no **Redis Cloud** e salvar a string de conexão.  
* \[ \] Realizar o deploy do front-end na **Vercel** apontando para o seu repositório.  
* \[ \] Realizar o deploy do backend NestJS no **Render** (lembrando de configurar as variáveis de ambiente com as chaves do Gemini e credenciais do Redis Cloud).  
* \[ \] Testar o fluxo de ponta a ponta em produção pública.

* [ ] **GitFlow Simplificado:** Configurar o repositório com proteção de branch. A branch main será conectada ao gatilho de deploy automático em produção (Vercel/Render). A branch develop servirá para testes de integração contínua. Todo novo código deve ser desenvolvido em sub-branches (ex: eature/ai-agent) e mesclado na develop via Pull Request.

## **📣 Fase 6: O Marketing de Sênior \- LinkedIn & GitHub (Semana 6\)**

*De nada adianta programar uma obra de arte se ninguém souber que ela existe. Aqui nós geramos o seu valor de marca.*

### **🚀 O que você vai aplicar/aprender:**

* **Documentação de Engenharia (README):** Explicar as escolhas arquiteturais do seu portfólio (Clean Arch, Redis Queue, AI Agents) em vez de apenas listar comandos de instalação.  
* **Autoridade no LinkedIn:** Como criar conteúdo técnico de impacto gerando estrelas no seu repositório.

### **📋 Checklist de Execução:**

* \[ \] Escrever um README excelente no GitHub contendo:  
  * Diagrama de arquitetura do fluxo assíncrono (HTTP \-\> BullMQ \-\> Redis \-\> Worker \-\> Gemini).  
  * Justificativa técnica para o uso do Redis \+ BullMQ (evitar timeouts, gerenciar retentativas).  
  * Instruções de como rodar localmente com docker-compose.  
* \[ \] Gravar um vídeo curto de 1 minuto da tela mostrando o sistema funcionando em tempo real.  
* \[ \] Publicar no LinkedIn um artigo explicativo e focado em engenharia, destacando a migração conceitual do MQTT (seu conhecimento raiz) para o Redis/BullMQ (sua nova skill de escala).
