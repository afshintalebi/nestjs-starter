import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import generalConfig from '@/shared/configs/app.config';
import envValidationSchema from '@/shared/configs/env.validation.schema';

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
    ]
}