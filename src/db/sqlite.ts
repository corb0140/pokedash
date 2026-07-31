import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import type { Database } from 'sql.js'

const IDB_NAME = 'pokedash'
const IDB_STORE = 'sqlite'
const IDB_KEY = 'main'

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(IDB_STORE)
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function loadPersistedBytes(): Promise<Uint8Array | null> {
  const idb = await openIndexedDb()

  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readonly')
    const req = tx.objectStore(IDB_STORE).get(IDB_KEY)

    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
  })
}

async function savePersistedBytes(bytes: Uint8Array): Promise<void> {
  const idb = await openIndexedDb()

  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(bytes, IDB_KEY)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

let dbPromise: Promise<Database> | null = null

export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await initSqlJs({ locateFile: () => wasmUrl })

      const persisted = await loadPersistedBytes()
      const db = persisted ? new SQL.Database(persisted) : new SQL.Database()

      db.run(`
        CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS team_pokemon (
          team_id TEXT NOT NULL REFERENCES teams(id),
          position INTEGER NOT NULL,
          pokemon_id INTEGER NOT NULL,
          pokemon_name TEXT NOT NULL,
          pokemon_image TEXT NOT NULL
        );
      `)

      return db
    })()
  }

  return dbPromise
}

export async function persistDb(db: Database): Promise<void> {
  await savePersistedBytes(db.export())
}
