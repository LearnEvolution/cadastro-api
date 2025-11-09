import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

// ✅ O CORS deve vir logo no início
app.use(cors({
  origin: [
    "https://cadastro-frontend-ccyxol4gn-learnevolutions-projects.vercel.app",
    "https://cadastro-frontend-4b9wq26xz-learnevolutions-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Depois o express.json()
app.use(express.json());

// Criar usuário
app.post('/usuarios', async (req, res) => {
  await prisma.users.create({
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
  try {
    let users
    if (req.query.name) {
      users = await prisma.users.findMany({
        where: { name: req.query.name }
      })
    } else {
      users = await prisma.users.findMany()
    }
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao buscar usuários')
  }
})

// Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  await prisma.users.update({
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
  await prisma.users.delete({
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
