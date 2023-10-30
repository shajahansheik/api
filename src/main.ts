import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(bodyParser.json({limit: "10mb"}));
  app.use(bodyParser.urlencoded({limit: "10mb", extended: true}));
  app.use(morgan('tiny'))

  const options = new DocumentBuilder()
      .setTitle("API Documentation")
      .setDescription("Swagger based API docs for each endpoint")
      .setVersion("1.0")
      .addTag("API")
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  // @ts-ignore
  app.set('json spaces', 2);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
