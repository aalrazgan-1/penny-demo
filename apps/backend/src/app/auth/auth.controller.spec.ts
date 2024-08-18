import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        // Mock the AuthGuard for 'local' and 'jwt'
        {
          provide: AuthGuard('local'),
          useValue: {
            canActivate: jest.fn((context: ExecutionContext) => true),
          },
        },
        {
          provide: AuthGuard('jwt'),
          useValue: {
            canActivate: jest.fn((context: ExecutionContext) => true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login with the correct user and return a token', async () => {
      const req = { user: { id: 1, username: 'testuser' } };
      const result = { access_token: 'token' };

      (authServiceMock.login as jest.Mock).mockResolvedValueOnce(result);

      const response = await controller.login(req);

      expect(authServiceMock.login).toHaveBeenCalledWith(req.user);
      expect(response).toEqual(result);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile from the request', () => {
      const req = { user: { id: 1, username: 'testuser' } };

      const response = controller.getProfile(req);

      expect(response).toEqual(req.user);
    });
  });
});
