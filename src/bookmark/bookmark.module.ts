import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from 'src/infra/services/prisma/prisma.service';
import { BookmarkRepository } from 'src/common/repositories/bookmark.repository';
import { PrismaBookmarkRepository } from 'src/infra/repositories/prisma/prisma-bookmark.repository';

@Module({
  controllers: [BookmarkController],
  providers: [
    BookmarkService,
    PrismaService,
    { provide: BookmarkRepository, useClass: PrismaBookmarkRepository },
  ],
})
export class BookmarkModule {}
