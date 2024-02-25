import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { SubmissionActionService } from "./submissionAction.service";
import { CreateSubmissionActionDto } from "./dto";

@Controller("submissionActions")
export class SubmissionActionController {
	constructor(
		private readonly submissionActionService: SubmissionActionService,
	) {}

	@Post()
	create(@Body() createSubmissionActionDto: CreateSubmissionActionDto) {
		return this.submissionActionService.create(createSubmissionActionDto);
	}

	@Get()
	findAll() {
		return this.submissionActionService.findAll();
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.submissionActionService.findById(+id);
	}
}
