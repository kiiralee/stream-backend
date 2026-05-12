/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@/prisma/generated/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { ChangeInfoInput } from './inputs/change-info.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { SocialLinkModel } from './models/social-link.model';
import { ProfileService } from './profile.service';

@Resolver('Profile')
export class ProfileResolver {
  public constructor(private readonly profileService: ProfileService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileInfo' })
  public async changeInfo(@Authorized() user: User, @Args('data') input: ChangeInfoInput) {
    return this.profileService.changeInfo(user, input);
  }

  @Authorization()
  @Query(() => [SocialLinkModel], { name: 'findSocialLinks' })
  public async findSocialLinks(@Authorized() user: User) {
    return this.profileService.findSocialLinks(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'createSocialLink' })
  public async createSocialLink(@Authorized() user: User, @Args('data') input: SocialLinkInput) {
    return this.profileService.createSocialLink(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'reorderSocialLink' })
  public async reorderSocialLinks(
    @Args('list', { type: () => [SocialLinkOrderInput] }) list: SocialLinkOrderInput[],
  ) {
    return this.profileService.reorderSocialLinks(list);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'updateSocialLink' })
  public async updateSocialLink(@Args('id') id: string, @Args('data') input: SocialLinkInput) {
    return this.profileService.updateSocialLink(id, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSocialLink' })
  public async removeSocialLink(@Args('id') id: string) {
    return this.profileService.removeSocialLink(id);
  }
}
