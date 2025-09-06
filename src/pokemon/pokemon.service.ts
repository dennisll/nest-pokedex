import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')!;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const {limit=this.defaultLimit, offset=0} = paginationDto;

    const pokemons = await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ no: 1})
    .select('-__v');
    return pokemons;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon con id, name or no ${term} no exist`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {

      const pokemon = await this.findOne(term);

      await pokemon.updateOne(updatePokemonDto, { new: true });

    return { ...pokemon.toJSON(), ...updatePokemonDto };
      
    } catch (error) {
      this.handleError(error);
    }
    
  }

  async remove(id: string) {

    //await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});

    if(deletedCount === 0) 
      throw new NotFoundException(`The pokemon with id ${id} not exist`);
    return;
  }

  private handleError(error: any){
    if (error.code === 11000)
      throw new BadRequestException(`The pokemon exist, ${error}`);
    throw new InternalServerErrorException("Can't create the pokemon");
  }
}
