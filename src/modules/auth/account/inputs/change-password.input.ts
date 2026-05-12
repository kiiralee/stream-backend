import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public oldPassword: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public newPassword: string;
}
