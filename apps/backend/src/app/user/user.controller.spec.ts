import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    userServiceMock = {
      createUser: jest.fn(),
      isEmailDuplicate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call UserService.createUser with correct parameters', async () => {
      const userDto = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
      const result = { message: 'User successfully registered' };

      (userServiceMock.createUser as jest.Mock).mockResolvedValueOnce(result);

      const response = await controller.signup(userDto);

      expect(userServiceMock.createUser).toHaveBeenCalledWith(userDto);
      expect(response).toEqual(result);
    });
  });

  describe('checkEmail', () => {
    it('should call UserService.isEmailDuplicate and return the result', async () => {
      const email = 'test@example.com';
      const result = { isDuplicate: true };

      (userServiceMock.isEmailDuplicate as jest.Mock).mockResolvedValueOnce(true);

      const response = await controller.checkEmail(email);

      expect(userServiceMock.isEmailDuplicate).toHaveBeenCalledWith(email);
      expect(response).toEqual(result);
    });
  });
});
