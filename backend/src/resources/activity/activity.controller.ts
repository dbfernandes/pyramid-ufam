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
import { ActivityService } from "./activity.service";
import { UpdateActivityDto } from "./dto";
import { JwtAuthGuard } from "../../../src/guards/jwt-auth.guard";
import { Roles } from "../../../src/decorators/roles.decorator";
import { UserTypes } from "../../../src/common/enums.enum";
import { ExclusiveRolesGuard } from "../../../src/guards/exclusive-roles.guard";

@Controller("activities")
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	@Get()
	async findAll() {
		return await this.activityService.findAll();
	}

	@Get(":id")
	async findById(@Param("id") id: string) {
		return await this.activityService.findById(+id);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async update(
		@Param("id") id: string,
		@Body() updateActivityDto: UpdateActivityDto,
	) {
		return await this.activityService.update(+id, updateActivityDto);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	async remove(@Param("id") id: string) {
		return await this.activityService.remove(+id);
	}
}
