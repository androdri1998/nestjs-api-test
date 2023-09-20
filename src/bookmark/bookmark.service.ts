import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { BookmarkRepository } from 'src/repositories/bookmark.repository';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async create(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.bookmarkRepository.create(userId, dto);

    return bookmark;
  }

  async get(userId: number) {
    const bookmarks = await this.bookmarkRepository.getBookmarksByUserId(
      userId,
    );

    return bookmarks;
  }

  async index(userId: number, bookmarkId: number) {
    const bookmark =
      await this.bookmarkRepository.getBookmarkByUserIdAndBookmarkId(
        bookmarkId,
        userId,
      );

    return bookmark;
  }

  async edit(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.bookmarkRepository.getBookmarkByBookmarkId(
      bookmarkId,
    );

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    const bookmarkUpdated = await this.bookmarkRepository.update(
      bookmarkId,
      dto,
    );

    return bookmarkUpdated;
  }

  async destroy(userId: number, bookmarkId: number) {
    const bookmark = await this.bookmarkRepository.getBookmarkByBookmarkId(
      bookmarkId,
    );

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    await this.bookmarkRepository.delete(bookmarkId);

    return;
  }
}
