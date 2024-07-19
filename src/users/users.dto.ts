import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class usersNew {
  @IsNotEmpty({ message: "No puede quedar vacío" })
  @IsString({ message: "El dato debe ser texto" })
  userName: string;

  @IsNotEmpty({ message: "No puede quedar vacío" })
  @IsEmail({}, { message: "Debe ser un email válido" })
  email: string;

  @IsNotEmpty({ message: "No puede quedar vacío" })
  password: string;
}

export class updateUser {
  @IsOptional()
  @IsString({ message: "El dato debe ser texto" })
  userName?: string;

  @IsOptional()
  @IsEmail({}, { message: "Debe ser un email válido" })
  email?: string;

  @IsOptional()
  @IsString({ message: "El dato debe ser texto" })
  password?: string;
}
