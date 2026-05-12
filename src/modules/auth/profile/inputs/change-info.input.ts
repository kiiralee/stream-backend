import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

@InputType()
export class ChangeInfoInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  public username: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public displayName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MaxLength(300)
  public bio?: string;
}
