import { users } from "@prisma/client";
import { loadRolesAndPermissions } from "../middleware/auth.js";
import { toIso } from "./dates.js";

/** Port of App\Http\Resources\UserResource. */
export async function formatUserResponse(user: users) {
  const { spatieRoles, permissions } = await loadRolesAndPermissions(user.id, user.role);
  return {
    id: user.public_id,
    account_type: user.account_type,
    role: user.role,
    roles: spatieRoles,
    permissions,
    status: user.status,
    name: user.name,
    email: user.email,
    phone: user.phone,
    employee_id: user.employee_id,
    department: user.department,
    position: user.position,
    created_at: toIso(user.created_at),
  };
}
