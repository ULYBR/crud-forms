import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { connectToDatabase } from './db';
import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

// Definindo o modelo de endereço
interface Endereco {
  rua: string;
  cidade: string;
  estado: string;
}

// Definindo o modelo de pessoa
interface Pessoa extends Document {
  email: string;
  nome: string;
  idade: number;
  endereco: Endereco;
}

// Conecta ao banco de dados MongoDB
connectToDatabase();

export const app = express();
app.use(cors());
app.use(express.json());

// Definindo o esquema do documento Pessoa
const pessoaSchema = new mongoose.Schema<Pessoa>({
  email: { type: String, unique: true }, // Adiciona a opção unique para garantir que o email seja único
  nome: String,
  idade: Number,
  endereco: {
    rua: String,
    cidade: String,
    estado: String,
  }
}, { toJSON: { virtuals: true } }); // Permitir que os subdocumentos sejam incluídos na resposta JSON

// Criando o modelo Pessoa
const PessoaModel = mongoose.model<Pessoa>('Pessoa', pessoaSchema);

// Schema de validação com Zod para os dados de entrada
const pessoaInputSchema = z.object({
  email: z.string().email(),
  nome: z.string(),
  idade: z.number().int().positive(),
  endereco: z.object({
    rua: z.string(),
    cidade: z.string(),
    estado: z.string(),
  }),
});

app.post('/pessoa', async (req: Request, res: Response) => {
  try {
    const pessoaData = pessoaInputSchema.parse(req.body);
    if (!pessoaData) {
      return res.status(400).json({ message: 'Dados de pessoa inválidos' });
    }

    const { email, nome, idade, endereco } = pessoaData;

    // Verifica se já existe uma pessoa com o mesmo e-mail
    const existingPessoa = await PessoaModel.findOne({ email });
    if (existingPessoa) {
      return res.status(400).json({ message: 'Já existe uma pessoa com este e-mail' });
    }

    const pessoa = new PessoaModel({
      email,
      nome,
      idade,
      endereco,
    });
    await pessoa.save();
    const { endereco: _, ...rest } = pessoa.toObject();
    res.status(201).json(rest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors ?? 'Erro ao criar pessoa' });
    } else {
      res.status(500).json({ message: 'Erro ao criar pessoa' });
    }
  }
});


// Rota para buscar uma pessoa pelo ID
app.get('/pessoa/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pessoa = await PessoaModel.findById(id);
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    res.json(pessoa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pessoa' });
  }
});

// Rota para buscar uma lista paginada de pessoas
app.get('/pessoa', async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  try {
    const pessoas = await PessoaModel.find().skip(skip).limit(Number(pageSize));
    res.json(pessoas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar lista de pessoas' });
  }
});

// Rota para deletar uma pessoa pelo ID
app.delete('/pessoa/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Buscar a pessoa antes de deletar
    const pessoaDeletada = await PessoaModel.findByIdAndDelete(id);
    if (!pessoaDeletada) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }


    res.status(200).json({ message: 'Pessoa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar pessoa' });
  }
});

// Rota para atualizar uma pessoa pelo ID
app.put('/pessoa/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { email, nome, idade, endereco } = req.body;
    const pessoa = await PessoaModel.findByIdAndUpdate(id, {
      email,
      nome,
      idade,
      endereco,
    }, { new: true });
    res.json(pessoa);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar pessoa' });
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(3000, () => {
  console.log('Servidor está rodando na porta 3000');
});
