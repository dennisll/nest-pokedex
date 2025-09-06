import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor( 
    @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,
      private readonly http: AxiosAdapter
    ){
  }
  

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );

    /* 
    // Otro metodo qu funciona, aunque menos eficiente

    const arrayPromise: any [] = [];

    data.results.forEach(({name, url})=> {
       const segments = url.split('/');
       const no : number= +segments[ segments.length-2];
       arrayPromise.push(this.pokemonModel.create({name, no}));
    });

    await Promise.all(arrayPromise); 
    */

    const pokemonsToInsert: {name: string, no: number}[]= [];

    data.results.forEach(({name, url})=> {
       const segments = url.split('/');
       const no : number= +segments[ segments.length-2];
       pokemonsToInsert.push({name, no});
    });

    await this.pokemonModel.insertMany(pokemonsToInsert);
    return "Seed executado";
  }
}
