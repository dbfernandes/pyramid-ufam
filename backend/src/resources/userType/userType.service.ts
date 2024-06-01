import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserType } from "@prisma/client";

@Injectable()
export class UserTypeService {
	constructor(private prisma: PrismaService) {}

	async findById(id: number): Promise<any | null> {
		console.log("Finding user type with ID:", id);
		if (!id) {
			console.error("ID is undefined or null");
			throw new Error("ID must be provided");
		}
		return this.prisma.userType.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
			},
		});
	}

	async findAll(): Promise<UserType[]> {
		return this.prisma.userType.findMany();
	}
}
