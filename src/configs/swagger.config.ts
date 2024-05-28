import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initSwagger = (app: INestApplication, name: string): void => {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${name}`)
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: `${name}`,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
    },
  });
};
