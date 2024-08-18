import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = { email, password: 'hashedpassword', firstName: 'John', lastName: 'Doe' };
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(user),
      } as any);

      const result = await service.findOneByEmail(email);
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      const email = 'test@example.com';
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.findOneByEmail(email);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should throw BadRequestException if email already exists', async () => {
      const userDto = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(userDto as any);

      await expect(service.createUser(userDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('isEmailDuplicate', () => {
    it('should return true if email is duplicate', async () => {
      const email = 'test@example.com';
      const user = { email, password: 'hashedpassword', firstName: 'John', lastName: 'Doe' };
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(user as User);

      const result = await service.isEmailDuplicate(email);
      expect(result).toBe(true);
    });

    it('should return false if email is not duplicate', async () => {
      const email = 'test@example.com';
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(null);

      const result = await service.isEmailDuplicate(email);
      expect(result).toBe(false);
    });
  });
});
