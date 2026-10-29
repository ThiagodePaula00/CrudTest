import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProdutoDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    descricao: string;

    preco: number;
}
