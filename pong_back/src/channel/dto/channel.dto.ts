import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class ChannelCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	owner_id: number;

	@IsOptional()
	@IsNumber({}, {each: true})
	users_ids: number[];

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class ChannelJoinDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	user_id: number;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class ChannelLeaveDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	user_id: number;
}

export class MessageCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	uid: number;

	@IsString()
	@IsNotEmpty()
	text: string;

	@IsNumber()
	@IsNotEmpty()
	sender_id: number;

	@IsString()
	@IsNotEmpty()
	sender_name: string;
}
