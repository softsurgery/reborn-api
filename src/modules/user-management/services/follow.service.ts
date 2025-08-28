// follow.service.ts
import { Injectable } from '@nestjs/common';
import { FollowCannotFollowYourselfException } from '../errors/follow/follow.cannotfollowyourself.error';
import { UserNotFoundException } from '../errors/user/user.notfound.error';
import { FollowNotFoundException } from '../errors/follow/follow.notfound.error';
import { UserRepository } from '../repositories/user.repository';
import { FollowRepository } from '../repositories/follow.repository';
import { ResponseFollowDto } from '../dtos/follow/response-follow.dto';
import { ResponseFollowCountsDto } from '../dtos/follow/response-follow-counts.dto';
import { FollowAlreadyExistsException } from '../errors/follow/follow.alreadyexists.error';
import { ResponseIsFollowingDto } from '../dtos/follow/response-is-following.dto';

@Injectable()
export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
  ) {}

  async follow(targetId: string, userId?: string) {
    if (userId === targetId) throw new FollowCannotFollowYourselfException();

    const follower = await this.userRepository.findOne({
      where: { id: userId },
    });
    const following = await this.userRepository.findOne({
      where: { id: targetId },
    });

    if (!follower || !following) throw new UserNotFoundException();

    let follow = await this.followRepository.findOne({
      where: { follower: { id: userId }, following: { id: targetId } },
    });

    if (follow) throw new FollowAlreadyExistsException();

    follow = this.followRepository.create({ follower, following });
    return this.followRepository.save(follow);
  }

  async unfollow(targetId: string, userId?: string) {
    const follower = await this.userRepository.findOne({
      where: { id: userId },
    });
    const following = await this.userRepository.findOne({
      where: { id: targetId },
    });

    if (!follower || !following) throw new UserNotFoundException();

    const follow = await this.followRepository.findOne({
      where: { follower: { id: userId }, following: { id: targetId } },
    });

    if (!follow) throw new FollowNotFoundException();
    return this.followRepository.remove(follow);
  }

  async getFollowers(userId: string): Promise<ResponseFollowDto[]> {
    return this.followRepository.findAll({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: string): Promise<ResponseFollowDto[]> {
    return this.followRepository.findAll({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
  }

  async isFollowing(
    targetId: string,
    userId?: string,
  ): Promise<ResponseIsFollowingDto> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: userId }, following: { id: targetId } },
    });
    return {
      userId,
      targetId,
      isFollowing: !!follow,
    };
  }

  async getDataCount(userId: string): Promise<ResponseFollowCountsDto> {
    const following = await this.followRepository.getTotalCount({
      where: { follower: { id: userId } },
    });
    const followers = await this.followRepository.getTotalCount({
      where: { following: { id: userId } },
    });
    return { following, followers };
  }
}
