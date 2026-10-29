import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;
}