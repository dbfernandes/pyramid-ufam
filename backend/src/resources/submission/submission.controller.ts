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
import { SubmissionService } from "./submission.service";
import { UpdateSubmissionDto } from "./dto";
import { UpdateStatusDto } from "./dto/update-status.dto";

@Controller("submissions")
export class SubmissionController {
	constructor(private readonly submissionService: SubmissionService) {}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.submissionService.findById(+id);
	}

	@Patch(":id")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	update(
		@Param("id") id: string,
		@Body() updateSubmissionDto: UpdateSubmissionDto,
	) {
		return this.submissionService.update(+id, updateSubmissionDto);
	}

	@Patch(":id/status")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	updateStatus(
		@Param("id") id: string,
		@Body() updateStatusDto: UpdateStatusDto,
	) {
		return this.submissionService.updateStatus(+id, updateStatusDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.submissionService.remove(+id);
	}
}
