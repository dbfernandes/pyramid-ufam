import {
	Controller,
	Get,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { UpdateActivityDto } from "./dto";

@Controller("activities")
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	@Get()
	findAll() {
		return this.activityService.findAll();
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.activityService.findById(+id);
	}

	@Patch(":id")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	update(
		@Param("id") id: string,
		@Body() updateActivityDto: UpdateActivityDto,
	) {
		return this.activityService.update(+id, updateActivityDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.activityService.remove(+id);
	}
}
