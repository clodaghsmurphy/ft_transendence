import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from "./dto";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
	}

	async getAllUsers(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async getUser(username: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: {
				name: username,
			},
		});
	}

	async getUserInfo(username: string, attribute: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				name: username,
			},
		});
		return { attribute: user[attribute] };
	}

	async createUser(dto: UserDto) {
		return await this.prisma.user.create({
			data: {
				name: dto.name,
				avatar: dto.avatar,
				blocked_users: [],
				friend_users: [],
				channels: [],
				connected: true,
				in_game: false,
			},
		});
	}
}
