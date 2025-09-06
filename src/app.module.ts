import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      // obtiene los valores del .env del schema como strings 
      // y permite su transformacion dadoel caso
      load: [EnvConfiguration], 
      // crea un schema del archivo .env y lo procesa, devolviendo valores strings, 
      // es como el paquete envs usado en express
      validationSchema: JoiValidationSchema  
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!,{
      dbName: 'pokemonDb'
    }),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
