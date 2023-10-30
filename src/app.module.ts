import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoService } from './app-commons/mongo.service';
import { VisitorsController } from './visitors/visitors.controller';
import { VisitorsService } from './visitors/visitors.service';
import { AuthMiddleware } from './app-commons/auth-middleware';
import { CommunicationController } from './communication/communication.controller';
import { CommunicationService } from './communication/communication.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ApplicationsController } from './applications/applications.controller';
import { ApplicationsService } from './applications/applications.service';
import { CareerController } from './career/career.controller';
import { CareerService } from './career/career.service';
import { SchedulingController } from './scheduling/scheduling.controller';
import { SchedulingService } from './scheduling/scheduling.service';
import { TokenService } from './app-commons/token.service';
import { TemplatesService } from './app-commons/templates.service';
import { AdminsController } from './admins/admins.controller';
import { AdminsService } from './admins/admins.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    VisitorsController,
    CommunicationController,
    UsersController,
    ApplicationsController,
    CareerController,
    SchedulingController,
    AdminsController
  ],
  providers: [
    AppService,
    MongoService,
    VisitorsService,
    CommunicationService,
    UsersService,
    ApplicationsService,
    CareerService,
    SchedulingService,
    TokenService,
    TemplatesService,
    AdminsService
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       {path: "visitors/add", method: RequestMethod.POST},
  //       {path: "users/signup", method: RequestMethod.POST},
  //       {path: "users/verify", method: RequestMethod.POST},
  //       {path: "users/login", method: RequestMethod.POST}
  //     )
  //     .forRoutes(
  //       VisitorsController
  //     )
  // }
}
