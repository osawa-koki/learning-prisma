import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import dayjs from 'dayjs'
import crypto from 'crypto'

(async () => {
  const prisma = new PrismaClient()

  const users = fs.readFileSync('./db/data/users.csv', 'utf8')
  const userRecords = parse(users, { columns: true })
  for (const record of userRecords) {
    const user = await prisma.user.upsert({
      where: { id: Number(record.id) },
      update: {},
      create: {
        id: Number(record.id),
        password: record.password,
        uuid: crypto.randomUUID(),
        profile: {
          create: {
            name: record.name,
            age: Number(record.age),
            birthday: dayjs(record.birthday).toDate()
          }
        }
      }
    })
    console.log(`Created user with id: ${user.id}.`)
  }

  const posts = fs.readFileSync('./db/data/posts.csv', 'utf8')
  const postRecords = parse(posts, { columns: true })
  for (const record of postRecords) {
    const post = await prisma.post.upsert({
      where: { id: Number(record.id) },
      update: {},
      create: {
        title: record.title,
        content: record.content,
        author_id: Number(record.author_id)
      }
    })
    console.log(`Created post with id: ${post.id}.`)
  }
})()
  .then(() => {
    console.log('Seed completed.')
  })
  .catch((e: Error) => {
    console.error(e)
  })
