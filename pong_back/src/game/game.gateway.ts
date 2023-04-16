import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Namespace } from 'socket.io';
import { BadRequestFilter } from "./game.filters";
import { GameService } from "./game.service";
import { GameInviteDmDto, GameJoinDto, GameKeyDto } from "./dto";
import { JwtWsGuard, UserPayload } from "src/auth/utils/JwtWsGuard";
import { DmGateway } from "src/dm/dm.gateway";

@UseFilters(new BadRequestFilter())
@UsePipes(new ValidationPipe({whitelist: true}))
@WebSocketGateway({namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(GameGateway.name);

	@WebSocketServer() io: Namespace;

	constructor (private gameService: GameService, private dmGateway: DmGateway) {}

	afterInit() {
	}

	handleConnection(client: Socket) {
		this.logger.log(`New client with id: ${client.id} connected.`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Disconnected client with id: ${client.id}.`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
	}

	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: GameJoinDto, @ConnectedSocket() client: Socket) {
		client.join('' + dto.id);
		const room = await this.gameService.join(dto.id, dto.user_id);

		this.io.in('' + dto.id).emit('join', room);
		if (this.gameService.readyToStart(dto.id)) {
			this.gameService.startGame(dto.id, this.io);
		}
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('invite_dm')
	async handleInviteDm(@MessageBody() dto: GameInviteDmDto, @UserPayload() payload: any, @ConnectedSocket() client: Socket) {
		await this.dmGateway.handleGameInvite(dto.id, dto.target_id, payload.sub);
	}

	@SubscribeMessage('keyEvent')
	async handleKeyEvent(@MessageBody() dto: GameKeyDto, @ConnectedSocket() client: Socket) {
		this.gameService.checkUserIsPlayer(dto.user_id, dto.id);
		this.gameService.keyEvent(dto);
	}
}
