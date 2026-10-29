import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  create(createProdutoDto: CreateProdutoDto) {
    const produto = this.produtoRepository.create(createProdutoDto);
    return this.produtoRepository.save(produto);
  }

  findAll() {
    return this.produtoRepository.find();
  }

  findOne(id: number) {
    return this.produtoRepository.findOneBy({ id });
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    const produto = await this.produtoRepository.preload({
      ...updateProdutoDto,
      id,
    });

    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }

    return this.produtoRepository.save(produto);
  }

  async remove(id: number) {
    const produto = await this.produtoRepository.findOneBy({ id });

    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }

    return this.produtoRepository.remove(produto);
  }
}