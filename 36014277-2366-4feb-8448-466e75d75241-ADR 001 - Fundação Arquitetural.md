# **Documento de Decisão de Arquitetura (ADR): Fundação Arquitetural do Ecossistema GitAgent.AI**

## **Contexto Restritivo**

O presente Documento de Decisão de Arquitetura (ADR) formaliza o desenho estrutural da Fase 1 do sistema de backend denominado **GitAgent.AI**. Este sistema tem como desígnio primordial a orquestração assíncrona, distribuída e altamente resiliente de agentes de Inteligência Artificial.

Devido à natureza não determinística e de longa duração inerente aos processos de inferência e raciocínio de modelos fundacionais, o imperativo técnico absoluto exige o estabelecimento de um ecossistema TypeScript estrito, intrinsecamente modular e à prova de falhas transitórias. A premissa central de engenharia dita que as regras de negócio corporativas e da aplicação não devem, sob nenhuma circunstância, depender ou ter conhecimento do framework de infraestrutura subjacente (NestJS), garantindo longevidade, testabilidade e portabilidade do núcleo lógico.

O escopo de fronteira define proibições estritas:

* Estão terminantemente vedadas sugestões baseadas em arquiteturas tradicionais MVC (Model-View-Controller).  
* Proibido o acoplamento direto de lógicas de negócio em Controladores ou Serviços utilizando decoradores (como @Injectable()) dentro das camadas de Domínio ou de Casos de Uso.  
* A validação de variáveis de ambiente no momento do *bootstrap* deve ser executada estritamente com a biblioteca **Zod**.

A investigação técnica detalhada neste documento encontra-se fragmentada em três vetores lógicos e isolados: Topologia de diretórios (Clean Arch), Validação de ambiente no arranque, e Otimização da mensageria (Redis/BullMQ).

## **Opções Mapeadas**

### **Vetor 1: Estruturação para Clean Architecture (NestJS 11\)**

* **MVC Tradicional:** Altamente acoplado. Viola a premissa fundamental de isolamento. (Rejeitada)  
* **Arquitetura Hexagonal:** Baixo acoplamento, mas foca mais na separação tecnológica do que na estrita separação entre Regras Corporativas e Regras de Aplicação. (Parcialmente Aderente)  
* **Clean Architecture Ortodoxa com Custom Providers:** Acoplamento nulo. O Domínio e os Casos de Uso são POTO (*Plain Old TypeScript Objects*). O framework atua exclusivamente na camada mais externa através de injeção manual com useFactory. **(Totalmente Aderente)**

### **Vetor 2: Validação Estrita de Variáveis de Ambiente**

* **Joi:** Integração nativa, mas tipagem TypeScript fraca. (Rejeitada)  
* **class-validator / class-transformer:** Requer decoradores experimentais e conversões implícitas. (Rejeitada)  
* **Zod:** Excelente extração estrita de tipos via z.infer. Requer a utilização do ponto de extensão validate() customizado do ConfigModule. **(Totalmente Aderente)**

### **Vetor 3: Alta Performance de Mensageria em Redis para BullMQ**

* **Cache Pura (Eviction Ativada):** Catastrófico. Remoção aleatória corrompe o estado dos trabalhos do BullMQ. (Rejeitada)  
* **Persistência RDB (Snapshots):** Risco severo de perda de dados assíncronos entre os *snapshots*. (Rejeitada)  
* **Persistência AOF (noeviction):** A memória recusa novas inserções em vez de apagar chaves vitais, permitindo que o BullMQ controle o erro (OOM) com reentradas. **(Otimizado e Seguro)**

## **Decisão Adotada**

### **1\. Topologia de Diretórios (Inversão de Controle Manual)**

A estrutura segrega a aplicação em core (agnóstico) e infrastructure (acoplado a tecnologias):

src/  
├── core/                        \# Camada Absolutamente Pura (POTO)  
│   ├── domain/                  \# Regras Corporativas (Enterprise Rules)  
│   │   ├── entities/            \# Modelos puros  
│   │   └── value-objects/       \# Objetos imutáveis  
│   └── application/             \# Regras da Aplicação (Use Cases)  
│       ├── use-cases/           \# Orquestração (sem @Injectable)  
│       └── ports/               \# Interfaces/Contratos (in/out)  
│  
├── infrastructure/              \# NestJS, Redis, Zod, etc.  
│   ├── adapters/                \# Implementações concretas das Portas  
│   │   ├── persistence/  
│   │   └── messaging/           \# BullMQ Adapter  
│   └── framework/               \# Acoplamento exclusivo NestJS 11  
│       ├── config/              \# Validação Zod  
│       ├── http/                \# Controllers/DTOs  
│       └── modules/             \# Configuração de Custom Providers  
└── main.ts

**Implementação do Custom Provider (Isolamento do Framework):**

Utiliza-se Symbol para criar *tokens* de injeção, permitindo que o NestJS instancie a classe pura passando os repositórios concretos.

// infrastructure/framework/modules/agent.module.ts  
export const AGENT\_REPOSITORY\_TOKEN \= Symbol('AGENT\_REPOSITORY\_TOKEN');

@Module({  
  providers: \[  
    { provide: AGENT\_REPOSITORY\_TOKEN, useClass: PostgresAgentRepository },  
    {  
      provide: OrchestrateAgentUseCase,  
      useFactory: (agentRepo: PostgresAgentRepository) \=\> {  
        return new OrchestrateAgentUseCase(agentRepo);  
      },  
      inject: \[AGENT\_REPOSITORY\_TOKEN\],   
    },  
  \],  
})  
export class AgentModule {}

### **2\. Validação de Ambiente (Zod via Fail-Fast)**

Implementação do padrão Fail-Fast no app.module.ts, interceptando o arranque se as credenciais críticas faltarem.

// infrastructure/framework/config/env.validation.ts  
export const envSchema \= z.object({  
  NODE\_ENV: z.enum(\['development', 'production'\]).default('development'),  
  PORT: z.string().default('3000').transform(Number),  
  REDIS\_HOST: z.string().min(1, { message: 'REDIS\_HOST obrigatório.' }),  
});

export function validateEnv(config: Record\<string, unknown\>) {  
  const result \= envSchema.safeParse(config);  
  if (\!result.success) {  
    console.error('❌ Falha Crítica nas Variáveis de Ambiente:');  
    process.exit(1); // Aborta o container  
  }  
  return result.data;  
}

### **3\. Orquestração Redis / BullMQ Local (docker-compose)**

version: '3.8'  
services:  
  gitagent-redis:  
    image: redis:7-alpine  
    container\_name: gitagent-redis-broker  
    ports:  
      \- "6379:6379"  
    command: \>  
      redis-server   
      \--appendonly yes   
      \--appendfsync everysec   
      \--maxmemory-policy noeviction   
      \--tcp-keepalive 300  
    volumes:  
      \- redis\_broker\_data:/data  
volumes:  
  redis\_broker\_data:  
