import { SetMetadata } from "@nestjs/common";
import { UserTypes } from "../common/enums.enum";

export const Roles = (...roles: UserTypes[]) => SetMetadata("roles", roles);
