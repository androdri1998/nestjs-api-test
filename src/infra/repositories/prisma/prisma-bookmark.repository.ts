import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { PrismaService } from 'src/infra/services/prisma/prisma.service';
import { BookmarkRepository } from 'src/common/repositories/bookmark.repository';

@Injectable()
export class PrismaBookmarkRepository implements BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookmarkDto): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });

    return bookmark;
  }

  async getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }

  async getBookmarkByUserIdAndBookmarkId(
    bookmarkId: number,
    userId: number,
  ): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    return bookmark;
  }

  async getBookmarkByBookmarkId(bookmarkId: number): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    return bookmark;
  }

  async update(bookmarkId: number, dto: EditBookmarkDto): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return bookmark;
  }

  async delete(bookmarkId: number): Promise<void> {
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
