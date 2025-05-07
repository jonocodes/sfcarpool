import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgrespassword'
})

export default async () => {
  try {
    // Add your seed data queries here
    // Example:
    // await pool.query(`
    //   INSERT INTO users (name, email)
    //   VALUES
    //   ('alice', 'alice@example.com'),
    //   ('bob', 'bob@example.com')
    // `)

    console.log('Add your seed data queries in scripts/seed.ts')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await pool.end()
  }
}
