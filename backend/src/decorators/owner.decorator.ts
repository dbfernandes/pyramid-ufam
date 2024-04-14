// owner.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const CheckOwner = (entityType: string) =>
	SetMetadata("entityType", entityType);
