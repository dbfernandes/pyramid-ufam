import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserTypes } from "../../src/common/enums.enum";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<UserTypes[]>(
			"roles",
			context.getHandler(),
		);
		if (!requiredRoles) {
			// If no roles are required for the route, everyone is allowed
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		request.isRoleVerified = requiredRoles.some(
			(role) => user.userType === role,
		);

		return true;
	}
}
