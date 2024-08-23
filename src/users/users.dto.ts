import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class usersNew {

    @ApiProperty({ description: 'Nombre del usuario', required: true })
    @IsNotEmpty({ message: "No puede quedar vacío" })
    @IsString({ message: "El dato debe ser texto" })
    userName: string;
  
    @ApiProperty({ description: 'Correo del usuario', required: true })
    @IsNotEmpty({ message: "No puede quedar vacío" })
    @IsEmail({}, { message: "Debe ser un email válido" })
    email: string;
  
    @ApiProperty({ description: 'Clave del usuario', required: true })
    @IsNotEmpty({ message: "No puede quedar vacío" })
    password: string;
  }
  
  export class updateUser {

    @ApiProperty({ description: 'Nombre del usuario', required: false })
    @IsOptional()
    @IsString({ message: "El dato debe ser texto" })
    userName?: string;
  
    @ApiProperty({ description: 'Correo del usuario', required: false })
    @IsOptional()
    @IsEmail({}, { message: "Debe ser un email válido" })
    email?: string;
  
    @ApiProperty({ description: 'Clave del usuario', required: false })
    @IsOptional()
    @IsString({ message: "El dato debe ser texto" })
    password?: string;
  }