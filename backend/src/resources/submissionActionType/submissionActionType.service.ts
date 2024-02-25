import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SubmissionActionType } from "@prisma/client";

@Injectable()
export class SubmissionActionTypeService {
	constructor(private prisma: PrismaService) {}

	findAll(): Promise<SubmissionActionType[]> {
		return this.prisma.submissionActionType.findMany();
	}

	findById(id: number): Promise<SubmissionActionType | null> {
		return this.prisma.submissionActionType.findUnique({ where: { id } });
	}
}
