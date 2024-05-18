import {
	Controller,
	Get,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	UseGuards,
} from "@nestjs/common";
import { SubmissionService } from "./submission.service";
import { UpdateSubmissionDto } from "./dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { JwtAuthGuard } from "../../../src/guards/jwt-auth.guard";
import { Roles } from "../../../src/decorators/roles.decorator";
import { UserTypes } from "../../../src/common/enums.enum";
import { RolesGuard } from "../../../src/guards/roles.guard";
import { IsOwnerGuard } from "../../../src/guards/is-owner.guard";
import { CheckOwner } from "../../../src/decorators/owner.decorator";
import { ExclusiveRolesGuard } from "../../../src/guards/exclusive-roles.guard";

@Controller("submissions")
export class SubmissionController {
	constructor(private readonly submissionService: SubmissionService) {}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.submissionService.findById(+id);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY)
	@CheckOwner("submission")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async update(
		@Param("id") id: string,
		@Body() updateSubmissionDto: UpdateSubmissionDto,
	) {
		return await this.submissionService.update(+id, updateSubmissionDto);
	}

	@Patch(":id/status")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY)
	@CheckOwner("submission")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async updateStatus(
		@Param("id") id: string,
		@Body() updateStatusDto: UpdateStatusDto,
	) {
		return await this.submissionService.updateStatus(+id, updateStatusDto);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
	@CheckOwner("submission")
	async remove(@Param("id") id: string) {
		return await this.submissionService.remove(+id);
	}

	@Patch(":id/status/mass-update")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY)
	@CheckOwner("submission")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async massUpdate(
		@Param("ids") ids: string,
		@Body() updateStatusDto: UpdateStatusDto,
	) {
		return await this.submissionService.massUpdateStatus(ids, updateStatusDto);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
	@CheckOwner("submission")
	async massRemove(@Param("ids") ids: string) {
		return await this.submissionService.massRemove(ids);
	}
}
