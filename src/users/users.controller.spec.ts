import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersNew, updateUser } from './users.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                        agregarUser: jest.fn(),
                        getUsers: jest.fn(),
                        findUser: jest.fn(),
                        updateUser: jest.fn(),
                        deleteUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should successfully register a user', async () => {
            const user: usersNew = { /* Add properties here */ };
            jest.spyOn(service, 'register').mockResolvedValue('Registration successful');

            expect(await controller.register(user)).toBe('Registration successful');
        });

        it('should handle errors during registration', async () => {
            const user: usersNew = { /* Add properties here */ };
            jest.spyOn(service, 'register').mockRejectedValue(new Error('Registration failed'));

            try {
                await controller.register(user);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error registering user',
                });
                expect(error.status).toBe(HttpStatus.BAD_REQUEST);
            }
        });
    });

    describe('login', () => {
        it('should successfully login a user', async () => {
            const loginUserDto: LoginUserDto = { /* Add properties here */ };
            jest.spyOn(service, 'login').mockResolvedValue('Login successful');

            expect(await controller.login(loginUserDto)).toBe('Login successful');
        });

        it('should handle errors during login', async () => {
            const loginUserDto: LoginUserDto = { /* Add properties here */ };
            jest.spyOn(service, 'login').mockRejectedValue(new Error('Login failed'));

            try {
                await controller.login(loginUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Invalid credentials',
                });
                expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
            }
        });
    });

    describe('insert', () => {
        it('should successfully add a user', async () => {
            const user: usersNew = { /* Add properties here */ };
            jest.spyOn(service, 'agregarUser').mockResolvedValue('User added');

            expect(await controller.insert(user)).toBe('User added');
        });

        it('should handle errors during user insertion', async () => {
            const user: usersNew = { /* Add properties here */ };
            jest.spyOn(service, 'agregarUser').mockRejectedValue(new Error('Insertion failed'));

            try {
                await controller.insert(user);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error adding user',
                });
                expect(error.status).toBe(HttpStatus.BAD_REQUEST);
            }
        });
    });

    describe('Find', () => {
        it('should successfully retrieve all users', async () => {
            jest.spyOn(service, 'getUsers').mockResolvedValue(['User1', 'User2']);

            expect(await controller.Find()).toEqual(['User1', 'User2']);
        });

        it('should handle errors during retrieval', async () => {
            jest.spyOn(service, 'getUsers').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.Find();
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving users',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe('findOne', () => {
        it('should successfully retrieve a user by ID', async () => {
            const id = 1;
            jest.spyOn(service, 'findUser').mockResolvedValue({ id, name: 'User1' });

            expect(await controller.findOne(id)).toEqual({ id, name: 'User1' });
        });

        it('should handle errors during retrieval', async () => {
            const id = 1;
            jest.spyOn(service, 'findUser').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.findOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving user',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when user is not found', async () => {
            const id = 1;
            jest.spyOn(service, 'findUser').mockResolvedValue(null);

            try {
                await controller.findOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('updateUser', () => {
        it('should successfully update a user', async () => {
            const id = 1;
            const updateUserDto: updateUser = { /* Add properties here */ };
            jest.spyOn(service, 'updateUser').mockResolvedValue({ id, ...updateUserDto });

            expect(await controller.updateUser(id, updateUserDto)).toEqual({ id, ...updateUserDto });
        });

        it('should handle errors during update', async () => {
            const id = 1;
            const updateUserDto: updateUser = { /* Add properties here */ };
            jest.spyOn(service, 'updateUser').mockRejectedValue(new Error('Update failed'));

            try {
                await controller.updateUser(id, updateUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error updating user',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when user is not found for update', async () => {
            const id = 1;
            const updateUserDto: updateUser = { /* Add properties here */ };
            jest.spyOn(service, 'updateUser').mockResolvedValue(null);

            try {
                await controller.updateUser(id, updateUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found for update',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('deleteUser', () => {
        it('should successfully delete a user', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteUser').mockResolvedValue(true);

            expect(await controller.deleteUser(id)).toEqual({ message: 'User deleted successfully' });
        });

        it('should handle errors during deletion', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteUser').mockRejectedValue(new Error('Deletion failed'));

            try {
                await controller.deleteUser(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error deleting user',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when user is not found for deletion', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteUser').mockResolvedValue(false);

            try {
                await controller.deleteUser(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found for deletion',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });
});
