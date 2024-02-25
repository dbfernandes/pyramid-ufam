import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SubmissionAction } from "@prisma/client";
import { CreateSubmissionActionDto } from "./dto";

@Injectable()
export class SubmissionActionService {
	constructor(private prisma: PrismaService) {}

	create(
		createSubmissionActionDto: CreateSubmissionActionDto,
	): Promise<SubmissionAction> {
		return this.prisma.submissionAction.create({
			data: createSubmissionActionDto,
		});
	}

	findAll(): Promise<SubmissionAction[]> {
		return this.prisma.submissionAction.findMany();
	}

	findById(id: number): Promise<SubmissionAction | null> {
		return this.prisma.submissionAction.findUnique({ where: { id } });
	}
}
