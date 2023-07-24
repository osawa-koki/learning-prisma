/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { UserFat, UserSlim } from '../dto/user'
import { PostFat, PostSlim } from '../dto/post'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: UserSlim,
      orderBy: {
        id: 'asc'
      }
    })
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: UserFat
    })

    if (user == null) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json(user)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'User not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.post('/users', async (req, res) => {
  try {
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
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'User not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.put('/users/:id', async (req, res) => {
  try {
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
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'User not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
      select: UserFat
    })

    res.json(user)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'User not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        id: 'asc'
      },
      select: PostSlim
    })
    res.json(posts)
  } catch (e) {
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
      select: PostFat
    })

    if (post == null) {
      return res.status(404).json({ message: 'Post not found.' })
    }

    res.json(post)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'Post not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.post('/posts', async (req, res) => {
  try {
    const title = req.body.title
    const content = req.body.content
    const authorId = Number(req.body.author_id)

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author_id: authorId
      },
      select: PostFat
    })

    res.json(post)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'Author not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.put('/posts/:id', async (req, res) => {
  try {
    const title = req.body.title
    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: {
        title
      },
      select: PostFat
    })

    res.json(post)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'Post not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.delete({
      where: { id: Number(req.params.id) },
      select: PostFat
    })

    res.json(post)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: 'Post not found.' })
      return
    }
    res.status(500).json({ message: 'Internal server error.' })
  }
})

app.listen(8000, () => {
  console.log("Server is running on 'http://localhost:8000'.")
})
