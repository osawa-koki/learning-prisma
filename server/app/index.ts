import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})
