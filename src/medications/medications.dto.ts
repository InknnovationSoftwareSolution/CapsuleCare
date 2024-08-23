import { IsString, IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Newmedicina {

    @ApiProperty({ description: 'Nombre de la medicina', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsString({message:"El dato debe ser texto"})
    name: string;

    @ApiProperty({ description: 'Cantidad de dosis a utilizar', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    @Min(1,{message:"La cantidad minima debe ser 1"})
    quantity: number;

    @ApiProperty({ description: 'Id del usuario a la medicina', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    user: number;

  }
  
  export class Updatmedicina {

    @ApiProperty({ description: 'Nombre de la medicina', required: false })
    @IsOptional()
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsString({message:"El dato debe ser texto"})
    name?: string;

    @ApiProperty({ description: 'Cantidad de dosis a utilizar', required: false })
    @IsOptional()
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    quantity?: number;
  }