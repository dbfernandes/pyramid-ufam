import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class OwnUserGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.user; // Read from JWT payload
		const userId = request.params.id;

		return user.id === Number(userId);
	}
}
