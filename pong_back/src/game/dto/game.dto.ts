import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";

export class GameCreateDto {
	// Temporary measure before matchmaking/invites are implemented
	@IsNotEmpty()
	@IsNumber()
	target_id: number;
}

export class GameParams {
	@IsNumberString()
	@IsNotEmpty()
	id: string;
}