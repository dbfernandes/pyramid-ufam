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
		name: "Engenharia9",
		code: "FT09",
		periods: 10,
		activityGroupsWorkloads: {
			education: 240,
			research: 240,
			extension: 240,
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
	.then(() => disconnect("Default Courses loaded"))
	.catch((err) => disconnect(err));
