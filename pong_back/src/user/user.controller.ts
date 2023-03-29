import { Body, UseGuards, Controller, Get, Res, HttpException, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { UploadedFile, UseInterceptors, ParseFilePipe, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { UserCreateDto, UserUpdateDto } from "./dto";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { AuthGuard } from '@nestjs/passport';
import { UserService } from "./user.service";
import { Multer } from 'multer'
import { SharpPipe } from "./utils/sharp.pipe";
import * as path from 'path';
import * as fs from 'fs';
import { UserEntity } from "./utils/user.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { User} from '@prisma/client';



@Controller('user')
export class UserController {
	constructor(private userService: UserService, private prisma: PrismaService	) {}

	@Get('info')
	getAllUsers() {
		return this.userService.getAll();
	}

	@Get('info/:id')
	getUser(@Param() params) {
		this.checkId(params.id);
		return this.userService.get(parseInt(params.id));
	}

	@Get('info/:id/:attribute')
	getUserInfo(@Param() params) {
		this.checkId(params.id);
		return this.userService.getInfo(parseInt(params.id), params.attribute);
	}

	@Post('create')
	//delete this
	createUser(@Body() dto: UserCreateDto) {
		return this.userService.create(dto);
	}

	@Post('update')
	@UseGuards(JwtAuthGuard)
	updateUser(@Body() dto: UserUpdateDto) {
		return this.userService.update(dto);
	}

	@Post('upload')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile(SharpPipe) file: string, @Res() res, @UserEntity() user)
	{
		console.log('in puload annd file is'  + file);
		try 
		{
			const Filepath = path.join('/app', '/uploads', file)
			const updateUser = await this.prisma.user.update({
				where: {id: user.id},
				data: { avatar: Filepath },
			});	
			console.log(updateUser);
			console.log(Filepath);
			return res.send(Filepath);
		}
		catch(e)
		{
			throw new UnauthorizedException();
		}
	}

	@Get('image/:id')
	async getImage(@Param('id') param, @Res() res)
	{
		console.log(param);
		const user = await this.userService.userExists(parseInt(param));
		if (!user)
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		console.log(user.avatar);
		const imagePath = user.avatar;
		const image = fs.readFileSync(imagePath);
		res.writeHead(200, {'Content-Type': 'image/jpeg' });
		res.end(image, 'binary');
	}

	@Get('friends')
	@UseGuards(JwtAuthGuard)
	async getFriends(@UserEntity() userEntity)
	{
		const user = await this.userService.userExists(userEntity.id);
		if (!user)
			throw new UnauthorizedException();
		return user.friend_users;
	}

	@Get('friends-search')
	@UseGuards(JwtAuthGuard)
	async friendsList(@UserEntity() userEntity, @Body() body, @Res() res)
	{
		const user = await this.userService.userExists(userEntity.id);
		if (!user)
			throw  new UnauthorizedException();
		console.log(body);
		const result = await this.prisma.user.findMany({
			where: {
				name: {
					contains: body.data,
					mode: 'insensitive'
					}
				},
			select: {
				name: true,
				avatar: true,
				id: true,
			}
		})
		res.send(result);

	}

	@Get('users')
	@UseGuards(JwtAuthGuard)
	async getUsers(@Res() res)
	{
		const result = await this.prisma.user.findMany({
			select: {
				name:true,
				id:true,
				avatar:true,
			}
		})
		res.send(result);
	}
	checkId(id: string) {
		if (Number.isNaN(parseInt(id))) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `'${id}' is not a valid number`,
			}, HttpStatus.BAD_REQUEST);
		}
	}
}

