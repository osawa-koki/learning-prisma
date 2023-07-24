/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { UserFat, UserSlim } from '../dto/user'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: UserSlim,
    orderBy: {
      id: 'asc'
    }
  })
  res.json(users)
})

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: UserFat
  })

  if (user == null) {
    return res.status(404).json({ message: 'User not found.' })
  }

  res.json(user)
})

app.post('/users', async (req, res) => {
  const password = req.body.password
  const name = req.body.name
  const age = Number(req.body.age)
  const birthday = req.body.birthday
  const posts = req.body.posts

  const user = await prisma.user.create({
    data: {
      password,
      uuid: crypto.randomUUID(),
      profile: {
        create: {
          name,
          age,
          birthday: dayjs(birthday).toDate()
        }
      },
      posts: {
        create: posts
      }
    },
    select: UserFat
  })

  res.json(user)
})

app.put('/users/:id', async (req, res) => {
  const name = req.body.name
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: {
      profile: {
        update: {
          name
        }
      }
    },
    select: UserFat
  })

  res.json(user)
})

app.delete('/users/:id', async (req, res) => {
  const user = await prisma.user.delete({
    where: { id: Number(req.params.id) },
    select: UserFat
  })

  res.json(user)
})

app.listen(3000, () => {
  console.log("Server is running on 'http://localhost:3000'.")
})
