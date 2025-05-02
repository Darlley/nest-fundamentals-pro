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

Para validar o corpo da requisição (os dados enviados na body), com mensagens personalizadas para cada tipo de erro de tipo inválido. Para isto vamos criar DTO's. 

Instale `npm install class-validator class-transformer` e eles fornecem decoradores para validação e o ValidationPipe. Mas para usa-los devemos registrar o ValidationPipe globalmente na `main.ts`. Adicione `app.useGlobalPipes(new ValidationPipe());` antes de `await app.listen(3000);` e importe o ValidationPipe.

Crie seus DTO's no módulo especifico dentro da pasta `dto` (`src/songs/dto/songs.dto.ts`). Ele é uma classe com atributos (igual um type ou interface) mas cada atributo recebe um decorator da `class-validator` para validação: 

```ts
import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsString } from 'class-validator';

export class CreateSongDto {
  @IsArray() // o atributo
  @IsString({ each: true }) // cada item do atributo
  @IsNotEmpty()
  readonly artists: string[];

  @IsNotEmpty()
  @IsDateString() // ISO8601 -> YYYY-MM-DD
  readonly releasedDate: string; 

  @IsNotEmpty()
  @IsMilitaryTime() // HH:MM
  readonly duration: string; 
}
```

Para aplicar as validações no controller você deve adicionar o decorator `@Body()` no método desejado e passar o DTO como parâmetro:


```ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';

@Controller('songs')
export class SongsController {
  constructor(...) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto) { .. }
}
```

> [!NOTE]
> Todo o trabalho manual feito até gora pode ser feito via CLI com o comando `nest g resource test`, existem opções para os comandos da CLI do Nest:
> `--dry-run` ele vai retornar o que ele faria sem executar.
> `--no-flat` ele não cria a pasta do recurso, ele cria todos os arquivos na pasta do módulo.
> `--no-spec` ele não cria os arquivos de teste.

### MIDLEWARE

Um middleware é uma classe que implementa a classe nativa do Nestjs `NestMiddleware` e tem o método `use` que recebe o request, response e o next. O middleware é executado antes do controller e pode ser usado para validar requisições, autenticar usuários, etc.

O middleware em `src/common/middleware/logger/logger.middleware.ts` é um exemplo simples de middleware com console.log das requisições e data. Para usar ele você deve importar ele no módulo principal `app.module.ts` (pode especificar se é para uma rota específica ou a para todas) e adicionar ele no `configure` do módulo principal.

Para criar um novo middleware você pode usar o comando da CLI do nest `nest g mi <PATH>/logger --no-spec --no-flat` e ele criará o middleware e importará ele no módulo principal.