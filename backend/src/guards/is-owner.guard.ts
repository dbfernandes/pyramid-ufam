// is-owner.guard.ts
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SubmissionService } from "../../src/resources/submission/submission.service";

@Injectable()
export class IsOwnerGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private submissionService: SubmissionService,
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const entityType = this.reflector.get<string>(
			"entityType",
			context.getHandler(),
		);

		if (request.isRoleVerified) {
			return true;
		}

		const userId = parseInt(request.user.id);
		const resourceId = parseInt(request.params.id);
		const multipleResourceIds = request.params.ids
			? request.params.ids.split(",").map((id) => parseInt(id))
			: null;
		let isOwner;

		if (!entityType) {
			// If no entityType is provided, assume it's an user resource
			isOwner = userId === resourceId;
		} else {
			if (multipleResourceIds && multipleResourceIds.length > 0) {
				isOwner = multipleResourceIds.every((id) =>
					this.checkOwnership(userId, id, entityType),
				);
			} else {
				isOwner = this.checkOwnership(userId, resourceId, entityType);
			}
		}

		if (!isOwner) {
			throw new UnauthorizedException("You do not own this resource");
		}

		return isOwner;
	}

	private async checkOwnership(
		userId: number,
		resourceId: number,
		entityType: string,
	): Promise<boolean> {
		let resource;
		if (entityType === "submission") {
			resource = await this.submissionService.findById(resourceId);
		}

		return resource.userId === userId;
	}
}
