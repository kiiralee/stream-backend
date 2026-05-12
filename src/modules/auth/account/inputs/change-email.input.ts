import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

@InputType()
export class ChangeEmailInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;
}
