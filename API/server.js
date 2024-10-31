import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// Middleware to handle JSON request bodies
app.use(express.json());
app.use(cors()); // Corrected

// POST route to add users
app.post('/usuarios', async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).send('Dados de usuário incompletos');
  }

  try {
    const newUser = await prisma.user.create({
      data: { name, email, age },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário');
  }
});

// GET route to list users
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

// DELETE route to delete a user by ID
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) }, // Ensure ID is an integer
    });
    res.status(200).json({ message: 'Usuário deletado com sucesso', deletedUser });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).send('Usuário não encontrado');
    }
    console.error('Erro ao deletar usuário:', error);
    res.status(500).send('Erro ao deletar usuário');
  }
});

// PUT route to update a user by ID
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  if (!name && !email && !age) {
    return res.status(400).send('Dados de usuário incompletos');
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // Ensure ID is an integer
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(age && { age }),
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).send('Usuário não encontrado');
    }
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).send('Erro ao atualizar usuário');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
