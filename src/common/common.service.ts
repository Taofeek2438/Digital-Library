import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class CommonService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async getLoggedInUser(): Promise<User> {
    const user = (await this.request.user) as User;
    return user;
  }
}
