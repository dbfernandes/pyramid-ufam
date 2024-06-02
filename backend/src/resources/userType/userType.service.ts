import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserType } from "@prisma/client";

@Injectable()
export class UserTypeService {
	constructor(private prisma: PrismaService) {}

	async findById(id: number): Promise<any | null> {
		if (id) {
			return this.prisma.userType.findUnique({
				where: { id },
				select: {
					id: true,
					name: true,
				},
			});
		}

		throw new Error("ID must be provided");
	}

	async findAll(): Promise<UserType[]> {
		return this.prisma.userType.findMany();
	}
}
