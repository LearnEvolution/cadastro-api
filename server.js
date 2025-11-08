import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

// Criar usuário
app.post('/usuarios', async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  })

  res.status(201).json({
    message: 'USUARIO CADASTRADO COM SUCESSO!',
    user: req.body
  })
})

// Listar usuários
app.get('/usuarios', async (req, res) => {
  let users

  if (req.query.name) {
    users = await prisma.user.findMany({
      where: { name: req.query.name }
    })
  } else {
    users = await prisma.user.findMany()
  }

  res.status(200).json(users)
})

// Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.params.id
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  })

  res.status(201).json(req.body)
})

// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id
    }
  })
  res.status(201).json({
    message: 'Usuário deletado com sucesso!'
  })
})

// Porta para deploy Render ou local
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando...')
})
