import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

console.log('DATABASE_URL usada pelo Prisma:', process.env.DATABASE_URL)

const prisma = new PrismaClient()
const app = express()


app.use(cors({
  origin: [
    "http://localhost:5173",         // para desenvolvimento local
    /\.vercel\.app$/                 // libera qualquer domínio *.vercel.app
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json())

// Teste de conexão com o banco ao iniciar
async function testDBConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Conexão com MongoDB Atlas bem-sucedida!')
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', err.message)
  }
}
testDBConnection()

// Rotas CRUD
app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    })
    res.status(201).json({ message: 'USUÁRIO CADASTRADO COM SUCESSO!', user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message })
  }
})

app.get('/usuarios', async (req, res) => {
  try {
    const users = req.query.name
      ? await prisma.user.findMany({ where: { name: req.query.name } })
      : await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro ao buscar usuários')
  }
})

app.put('/usuarios/:id', async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    })
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message })
  }
})

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(200).json({ message: 'Usuário deletado com sucesso!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message })
  }
})

// Inicializar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`)
})
