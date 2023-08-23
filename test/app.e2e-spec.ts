import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infra/modules/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3000');

    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'email@test.com',
      password: '123456',
    };

    describe('SignUp', () => {
      it('should thrown an exception if email is empty', () => {
        const { email, ...failDto } = dto;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(failDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should thrown an exception if password is empty', () => {
        const { password, ...failDto } = dto;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(failDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should thrown an exception if no body is provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('SignIn', () => {
      it('should thrown an exception if email is empty', () => {
        const { email, ...failDto } = dto;
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(failDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should thrown an exception if password is empty', () => {
        const { password, ...failDto } = dto;
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(failDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should thrown an exception if no body is provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it("should thrown an error if there's no authorization token", () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should get user info', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .get('/users/me')
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit User', () => {
      it("should thrown an error if there's no authorization token", () => {
        const editUserDto: EditUserDto = {
          email: 'email2@test.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withBody(editUserDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should edit email User', () => {
        const editUserDto: EditUserDto = {
          email: 'email2@test.com',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .patch('/users')
          .withBody(editUserDto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(editUserDto.email);
      });

      it('should edit firstname User', () => {
        const editUserDto: EditUserDto = {
          firstName: 'firstname',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .patch('/users')
          .withBody(editUserDto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(editUserDto.firstName);
      });

      it('should edit lastname User', () => {
        const editUserDto: EditUserDto = {
          lastName: 'lastname',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .patch('/users')
          .withBody(editUserDto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(editUserDto.lastName);
      });

      it('should edit User', () => {
        const editUserDto: EditUserDto = {
          email: 'email2@test.com',
          firstName: 'firstname',
          lastName: 'lastname',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .patch('/users')
          .withBody(editUserDto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(editUserDto.email)
          .expectBodyContains(editUserDto.firstName)
          .expectBodyContains(editUserDto.lastName);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it("should thrown an error when there's no authorization token", () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it("should thrown an erro when there's no body", () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .post('/bookmarks')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should thrown an erro when title field is empty', () => {
        const dto = {
          link: 'some link',
          description: 'some description',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .post('/bookmarks')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should thrown an erro when link field is empty', () => {
        const dto = {
          title: 'some tilte',
          description: 'some description',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .post('/bookmarks')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should Create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'some title',
          description: 'some description',
          link: 'some link',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .post('/bookmarks')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.description)
          .stores('bookmarkId', 'id');
      });

      it('should Create bookmark without description', () => {
        const dto: CreateBookmarkDto = {
          title: 'some title',
          link: 'some link',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .post('/bookmarks')
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link);
      });
    });

    describe('Get bookmarks', () => {
      it("should thrown an error when there's no authorization token", () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should Get bookmarks', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .get('/bookmarks')
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(2);
      });
    });

    describe('Get bookmark by id', () => {
      it("should thrown an error when there's no authorization token", () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should Get bookmark by id', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains('some title')
          .expectBodyContains('some link')
          .expectBodyContains('some description');
      });
    });

    describe('Edit bookmark', () => {
      it("should thrown an error when there's no authorization token", () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should thown an error when bookmark not exists', () => {
        const dto: EditBookmarkDto = {
          description: 'some new description',
          link: 'some new link',
          title: 'some new title',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .patch('/bookmarks/0')
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should create a new user to edit test', () => {
        const userDto: AuthDto = {
          email: 'email3@test.com',
          password: '123456',
        };

        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(userDto)
          .expectStatus(HttpStatus.CREATED)
          .stores('user2At', 'access_token');
      });

      it('should thown an error when try edit a bookmark that belongs to another user', () => {
        const dto: EditBookmarkDto = {
          description: 'some new description',
          link: 'some new link',
          title: 'some new title',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user2At}',
          })
          .withBody(dto)
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should Edit title bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title: 'some new title',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.title);
      });

      it('should Edit link bookmark by id', () => {
        const dto: EditBookmarkDto = {
          link: 'some new link',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.link);
      });

      it('should Edit description bookmark by id', () => {
        const dto: EditBookmarkDto = {
          description: 'some new description',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.description);
      });

      it('should Edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          description: 'some new description',
          link: 'some new link',
          title: 'some new title',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title);
      });
    });

    describe('Delete bookmark', () => {
      it("should thrown an error when there's no authorization token", () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should thown an error when bookmark not exists', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .delete('/bookmarks/0')
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should thown an error when try remove a bookmark that belongs to another user', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user2At}',
          })
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should Delete bookmark by id', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.NO_CONTENT);
      });

      it('should not get bookmark deleted by id', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.OK)
          .expectBody('');
      });
    });
  });
});
