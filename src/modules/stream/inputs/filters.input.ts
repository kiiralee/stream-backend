import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class FiltersInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  public take?: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  public skip?: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public searchTerm?: string;
}
