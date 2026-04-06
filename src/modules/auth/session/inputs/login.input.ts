import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public login: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public password: string;
}
