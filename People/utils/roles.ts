import { Role, AllowedRoles } from "interfaces/roles";
import { getUser } from "database/queries/users";

export const roles: {
  [key in AllowedRoles]: Role;
} = {
  hyperuser: {
    name: "hyperuser",
    permissions: ["*"],
    rank: 0,
  },
  superuser: {
    name: "superuser",
    permissions: ["*"],
    rank: 1,
  },
  user: {
    name: "user",
    permissions: ["*"],
    rank: 2,
  },
};

export const hasRole = async (
  role: AllowedRoles,
  username: string
): Promise<boolean> => {
  try {
    const { user } = await getUser(username);
    // if the rank of the role is less than or equal to the rank of the user's role, return true
    return roles[role].rank <= roles[user.role].rank;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const tokenHasRole = async (
  role: AllowedRoles,
  decoded: {
    [key: string]: any;
  }
): Promise<boolean> => {
  try {
    // if the rank of the role is less than or equal to the rank of the user's role, return true
    return roles[role].rank <= roles[decoded.role].rank;
  } catch (err) {
    console.error(err);
    return false;
  }
};
