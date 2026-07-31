import { v4 as uuidv4 } from 'uuid'
import { getDb, persistDb } from './sqlite'

export const MAX_TEAM_SIZE = 6
export const MAX_TEAMS = 10

export type TeamMember = {
  id: number
  name: string
  image: string
}

export type Team = {
  id: string
  name: string
  createdAt: number
  pokemon: Array<TeamMember>
}

export async function getAllTeams(): Promise<Array<Team>> {
  const db = await getDb()

  const teamRows = db.exec(
    `SELECT id, name, created_at FROM teams ORDER BY created_at DESC`,
  )

  if (teamRows.length === 0) return []

  const pokemonRows = db.exec(
    `SELECT team_id, position, pokemon_id, pokemon_name, pokemon_image
     FROM team_pokemon
     ORDER BY team_id, position`,
  )

  const pokemonByTeam = new Map<string, Array<TeamMember>>()

  if (pokemonRows.length > 0) {
    for (const [teamId, , pokemonId, pokemonName, pokemonImage] of pokemonRows[0]
      .values) {
      const key = String(teamId)
      const list = pokemonByTeam.get(key) ?? []

      list.push({
        id: Number(pokemonId),
        name: String(pokemonName),
        image: String(pokemonImage),
      })

      pokemonByTeam.set(key, list)
    }
  }

  return teamRows[0].values.map(([id, name, createdAt]) => ({
    id: String(id),
    name: String(name),
    createdAt: Number(createdAt),
    pokemon: pokemonByTeam.get(String(id)) ?? [],
  }))
}

export async function createTeam(
  name: string,
  pokemon: Array<TeamMember>,
): Promise<Team> {
  if (pokemon.length !== MAX_TEAM_SIZE) {
    throw new Error(`A team must have exactly ${MAX_TEAM_SIZE} Pokémon`)
  }

  if (!name.trim()) {
    throw new Error('Team name is required')
  }

  const db = await getDb()

  const countResult = db.exec(`SELECT COUNT(*) FROM teams`)
  const teamCount = Number(countResult[0].values[0][0])

  if (teamCount >= MAX_TEAMS) {
    throw new Error(`You can only save up to ${MAX_TEAMS} teams`)
  }

  const id = uuidv4()
  const createdAt = Date.now()

  db.run(`INSERT INTO teams (id, name, created_at) VALUES (?, ?, ?)`, [
    id,
    name.trim(),
    createdAt,
  ])

  pokemon.forEach((member, position) => {
    db.run(
      `INSERT INTO team_pokemon (team_id, position, pokemon_id, pokemon_name, pokemon_image)
       VALUES (?, ?, ?, ?, ?)`,
      [id, position, member.id, member.name, member.image],
    )
  })

  await persistDb(db)

  return { id, name: name.trim(), createdAt, pokemon }
}

export async function deleteTeam(teamId: string): Promise<void> {
  const db = await getDb()

  db.run(`DELETE FROM team_pokemon WHERE team_id = ?`, [teamId])
  db.run(`DELETE FROM teams WHERE id = ?`, [teamId])

  await persistDb(db)
}
