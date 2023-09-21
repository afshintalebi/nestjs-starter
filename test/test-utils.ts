import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import generalConfig from '@/shared/configs/app.config';
import envValidationSchema from '@/shared/configs/env.validation.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { UtilsModule } from '@/common/utils/utils.module';
import { UserController } from '@/common/user/controllers/user.controller';
import { UserService } from '@/common/user/services/user.service';
import { UserAdminService } from '@/common/user/services/user.admin.service';

export function getDefaultImportsOfAppModule() {
  return [
    ConfigModule.forRoot({
      load: [generalConfig],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('i18n.fallbackLanguage'),
        loaderOptions: {
          path: `src/${configService.get('i18n.srcDir')}/`,
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['accept-language']),
      ],
      inject: [ConfigService],
    }),
  ];
}

export function getUserModuleTestConfigs() {
  return {
    imports: [...getDefaultImportsOfAppModule(), CqrsModule, UtilsModule],
    controllers: [UserController],
    providers: [UserService, UserAdminService],
  };
}
