import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(title: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game")
      .select("game.title", "title")
      .where("LOWER(game.title) LIKE LOWER(:title)", {
        title: `%${title}%`,
      })
      .execute();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) AS count FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(id)
      .loadMany();
  }
}
