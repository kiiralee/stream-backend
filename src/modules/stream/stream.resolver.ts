/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@/prisma/generated/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { GenerateStreamTokenModel } from './models/generate-stream-token.model';
import { StreamModel } from './models/stream.model';
import { StreamService } from './stream.service';

@Resolver('Stream')
export class StreamResolver {
  public constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStreams' })
  public async findAll(@Args('filters') input: FiltersInput) {
    return this.streamService.findAll(input);
  }

  @Query(() => [StreamModel], { name: 'findRandomStreams' })
  public async findRandom() {
    return this.streamService.findRandom();
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  public async changeInfo(@Authorized() user: User, @Args('data') input: ChangeStreamInfoInput) {
    return this.streamService.changeInfo(user, input);
  }

  @Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
  public async generateToken(@Args('data') input: GenerateStreamTokenInput) {
    return this.streamService.generateToken(input);
  }
}
