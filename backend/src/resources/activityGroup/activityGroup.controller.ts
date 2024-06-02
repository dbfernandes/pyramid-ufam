import { Controller, Get, Param } from "@nestjs/common";
import { ActivityGroupService } from "./activityGroup.service";

@Controller("activities")
export class ActivityGroupController {
	constructor(private readonly activityGroupService: ActivityGroupService) {}

	@Get()
	async findAll() {
		return await this.activityGroupService.findAll();
	}

	@Get(":id")
	async findById(@Param("id") id: string) {
		return await this.activityGroupService.findById(+id);
	}
}
