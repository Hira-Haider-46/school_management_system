import { auth } from "@clerk/nextjs/server";

export async function getCurrentRole(): Promise<string | null> {
  try {
    const { sessionClaims } = await auth();

    if (!sessionClaims) {
      return null;
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role;
    return role || null;
  } catch (error) {
    console.error("Error getting current role:", error);
    return null;
  }
}

export async function checkRole(allowedRoles: string[]): Promise<boolean> {
  try {
    const role = await getCurrentRole();
    return role ? allowedRoles.includes(role) : false;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}
