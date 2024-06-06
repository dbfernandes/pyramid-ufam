import { Injectable, Logger } from "@nestjs/common";
import * as cron from "node-cron";
import { PrismaService } from "../prisma/prisma.service";
import * as fs from "fs";

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name);

	constructor(private prisma: PrismaService) {
		this.initCronJobs();
	}

	initCronJobs() {
		// Schedule a task to run every day at midnight
		cron.schedule("0 0 * * *", () => this.clearTmpFolder());
		cron.schedule("0 0 * * *", () => this.clearUnusedSubmissionFiles());
		cron.schedule("0 0 * * *", () => this.clearUnusedProfileImages());
	}

	clearTmpFolder() {
		console.log("Clearing tmp folder");
		const tmpFolderPath = "./public/files/tmp/";

		fs.readdir(tmpFolderPath, (err, files) => {
			if (err) {
				console.error("Error reading tmp folder:", err);
				return;
			}

			files.forEach((file) => {
				const filePath = `${tmpFolderPath}/${file}`;

				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file ${filePath}:`, err);
					} else {
						console.log(`Deleted file: ${filePath}`);
					}
				});
			});
		});
	}

	clearUnusedSubmissionFiles() {
		console.log("Clearing unused submission files");
		const tmpFolderPath = "./public/files/submissions/";

		fs.readdir(tmpFolderPath, (err, files) => {
			if (err) {
				console.error("Error reading unused submission files:", err);
				return;
			}

			files.forEach(async (file) => {
				const filePath = `${tmpFolderPath}/${file}`;
				const submission = await this.prisma.submission.findFirst({
					where: {
						file: file,
					},
				});

				if (!submission) {
					fs.unlink(filePath, (err) => {
						if (err) {
							console.error(`Error deleting file ${filePath}:`, err);
						} else {
							console.log(`Deleted file: ${filePath}`);
						}
					});
				}
			});
		});
	}

	clearUnusedProfileImages() {
		console.log("Clearing unused profile images");
		const tmpFolderPath = "./public/files/profile-images/";

		fs.readdir(tmpFolderPath, (err, files) => {
			if (err) {
				console.error("Error reading unused profile images:", err);
				return;
			}

			files.forEach(async (file) => {
				const filePath = `${tmpFolderPath}/${file}`;
				const user = await this.prisma.user.findFirst({
					where: {
						profileImage: file,
					},
				});

				if (!user) {
					fs.unlink(filePath, (err) => {
						if (err) {
							console.error(`Error deleting file ${filePath}:`, err);
						} else {
							console.log(`Deleted file: ${filePath}`);
						}
					});
				}
			});
		});
	}
}
