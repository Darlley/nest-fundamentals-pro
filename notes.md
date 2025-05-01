Para iniciar um novo projeto Nestjs primeiro você deve ter instalado a CLI do Nestjs:

`npm i -g @nestjs/cli`

Crie um novo projeto com `nest new <project-name>` (--strict é opcional) e inicie com `npm run start:dev`

```
src/ 
├── app.controller.ts 
├── app.controller.spec.ts 
├── app.module.ts 
├── app.service.ts 
├── main.ts
```

O projeto inicia por padrão na porta 3000 com uma rota simples de hello world.

Se estiver muito lento use swc: https://docs.nestjs.com/recipes/swc

No NestJS, um módulo é uma classe decorada com @Module() que organiza e agrupa funcionalidades relacionadas, como controladores, serviços e outros provedores. Todo aplicativo NestJS possui pelo menos um módulo raiz (AppModule), definido no arquivo main.ts, que serve como ponto de entrada da aplicação. Um módulo é composto por um controller que recebe as requisições dos usuários, uma service onde realizamos a lógica da aplicação e um provider que é um objeto que pode ser injetado em outros módulos e os DTO que são os dados que serão enviados e recebidos na aplicação, songe todos são configurados no module do recurso e este modulo é composto no módulo principal.

Não é necessário repetir por que a documentação é bem clara. Mas o fluxo de uma requisição geralmente começa com a interceptação por um middleware, que pode realizar tarefas como autenticação, logging ou modificação do request antes de ele alcançar o controller. A requisição então é tratada pelo controller, responsável por mapear rotas e receber os dados enviados, onde geralmente se aplicam validações de formato e tipo por meio de DTOs combinados com pipes como o ValidationPipe, garantindo que apenas dados válidos cheguem à camada de serviço. Em seguida, o controller repassa os dados validados para a service, que executa a lógica de negócio principal — seja realizando cálculos, acessando bancos de dados via repositórios ou interagindo com outros módulos por meio da injeção de dependências. A service pode delegar partes da responsabilidade a outros serviços ou módulos e, após processar os dados, retorna uma resposta ao controller, que por fim envia essa resposta ao cliente. Todo esse fluxo é construído de maneira modular, promovendo reuso e separação de responsabilidades, e o módulo principal (AppModule) é quem orquestra os demais, compondo toda a aplicação a partir da definição feita no main.ts, onde a aplicação é inicializada com NestFactory.


Para criar um novo modulo você pode compor um passo a passo, usando o comando da CLI do nest execute cada comando abaixo e veja o que cada um faz pausadamente:

1. `nest g module songs` (no plural) o comando cria o módulo e ja importa no arquivo `app.module.ts`, caso contrario você teria que importar manualmente.
2. `nest g controller songs` o comando cria o controller e ja importa no arquivo de módulo `songs.module.ts`, com ele você pode iniciar uma nova rota, adicione no arquivo `songs.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('songs')
export class SongsController {
  @Get()
  findAll(): string {
    return 'Hello World!';
  }
}
```

Agora em `localhost:3000/songs` você verá o hello world.

3. `nest g service songs` o comando cria o service e importa ele como um provider também no arquivo de módulo `songs.module.ts`, com ele você pode interagir com o banco de dados, mas aqui vamos apenas importar a service no controller e substituir a mensagem de hello world para ele.

```ts

// CONTROLLER
import { Controller, Get } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  findAll(): string {
    return this.songsService.findAll();
  }
}

// SERVIE
import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  findAll(): string {
    return 'Hello Service!';
  }
}
```


`npm installc class-validator class-transformer` 