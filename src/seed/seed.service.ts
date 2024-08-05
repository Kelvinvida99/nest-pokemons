import { Injectable } from '@nestjs/common';
import { APIResponse } from './interface/api-respose.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSEED() {
    await this.pokemonModel.deleteMany({}); // Elimina los regitros de la base de datos

    const data = await this.http.get<APIResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async (pokemon) => {
      const { name, url } = pokemon;
      const segmet = url.split('/');
      const no: number = +segmet[segmet.length - 2];

      // await this.pokemonModel.create({ name, no });

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed excuted';
  }
}
