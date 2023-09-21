import { Bookmark } from '@prisma/client';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

export abstract class BookmarkRepository {
  abstract create(userId: number, dto: CreateBookmarkDto): Promise<Bookmark>;
  abstract getBookmarksByUserId(userId: number): Promise<Bookmark[]>;
  abstract getBookmarkByUserIdAndBookmarkId(
    userId: number,
    bookmarkId: number,
  ): Promise<Bookmark>;
  abstract getBookmarkByBookmarkId(bookmarkId: number): Promise<Bookmark>;
  abstract update(bookmarkId: number, dto: EditBookmarkDto): Promise<Bookmark>;
  abstract delete(bookmarkId: number): Promise<void>;
}
