import { PrismaClient } from "@prisma/client";
import {
	ActivityGroups,
	SubmissionActionTypes,
	UserTypes,
} from "../src/common/enums.enum";
import { CourseService } from "../src/resources/course/course.service";
import { ActivityService } from "../src/resources/activity/activity.service";
import { PrismaService } from "../src/resources/prisma/prisma.service";
import { CourseActivityGroupService } from "../src/resources/courseActivityGroup/courseActivityGroup.service";
import { UserTypeIds } from "../src/common/constants.constants";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const prismaService = new PrismaService();
const activityService = new ActivityService(prismaService);
const courseActivityGroupService = new CourseActivityGroupService(
	prismaService,
);

const courseService = new CourseService(
	prismaService,
	courseActivityGroupService,
	activityService,
);

async function UserTypesSeeds() {
	await prisma.userType.createMany({
		data: [
			{ name: UserTypes.COORDINATOR },
			{ name: UserTypes.SECRETARY },
			{ name: UserTypes.STUDENT },
		],
		skipDuplicates: true,
	});
}

async function ActivityGroupsSeeds() {
	await prisma.activityGroup.createMany({
		data: [
			{ name: ActivityGroups.EDUCATION },
			{ name: ActivityGroups.RESEARCH },
			{ name: ActivityGroups.EXTENSION },
		],
		skipDuplicates: true,
	});
}

async function SubmissionActionTypesSeeds() {
	await prisma.submissionActionType.createMany({
		data: [
			{ name: SubmissionActionTypes.SUBMITED },
			{ name: SubmissionActionTypes.PREAPPROVED },
			{ name: SubmissionActionTypes.APPROVED },
			{ name: SubmissionActionTypes.REJECTED },
			{ name: SubmissionActionTypes.COMMENTED },
			{ name: SubmissionActionTypes.EDITED },
		],
		skipDuplicates: true,
	});
}

async function CoursesSeeds() {
	await courseService.create({
		name: "Ciência da Computação",
		code: "IE08",
		periods: 10,
		minWorkload: 240,
		activityGroupsWorkloads: {
			education: 240,
			research: 240,
			extension: 240,
		},
	});

	await courseService.create({
		name: "Engenharia de Software",
		code: "IE17",
		periods: 8,
		minWorkload: 240,
		activityGroupsWorkloads: {
			education: 240,
			research: 240,
			extension: 240,
		},
	});
}

async function ActivitiesSeeds() {
	let j = 1;
	for (let i = 1; i <= 6; i++) {
		for (let k = 1; k <= 3; k++) {
			await activityService.create({
				courseActivityGroupId: i,
				name: `Atividade ${j}`,
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.",
				maxWorkload: 30,
			});
			j++;
		}
	}
}

async function DefaultAdminSeed() {
	const hashedPassword = bcrypt.hashSync(
		process.env.DEFAULT_ADMIN_PASSWORD,
		10,
	);

	await prisma.user.create({
		data: {
			name: "Admin",
			email: process.env.DEFAULT_ADMIN_EMAIL,
			userTypeId: UserTypeIds["Coordenador"],
			password: hashedPassword,
		},
	});
}

async function DefaultSecretarySeed() {
	const hashedPassword = bcrypt.hashSync(
		process.env.DEFAULT_ADMIN_PASSWORD + "a",
		10,
	);

	await prisma.user.create({
		data: {
			name: "Secretary",
			email: process.env.DEFAULT_ADMIN_EMAIL + "a",
			userTypeId: UserTypeIds["Secretário"],
			password: hashedPassword,
		},
	});
}

function disconnect(message: any) {
	console.log(message);
	prisma.$disconnect();
}

UserTypesSeeds()
	.then(() => disconnect("Default UserTypes loaded"))
	.catch((err) => disconnect(err));

ActivityGroupsSeeds()
	.then(() => disconnect("Default ActivityGroups loaded"))
	.catch((err) => disconnect(err));

SubmissionActionTypesSeeds()
	.then(() => disconnect("Default SubmissionActionTypes loaded"))
	.catch((err) => disconnect(err));

CoursesSeeds()
	.then(() => {
		disconnect("Default Courses loaded");
		ActivitiesSeeds();
	})
	.catch((err) => disconnect(err));

DefaultAdminSeed()
	.then(() => disconnect("Default Admin loaded"))
	.catch((err) => disconnect(err));

DefaultSecretarySeed()
	.then(() => disconnect("Default Secretary loaded"))
	.catch((err) => disconnect(err));
