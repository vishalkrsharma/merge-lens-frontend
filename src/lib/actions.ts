"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { serverClient } from "./server-client";

export async function addRepository(
  repoId: number,
  fullName: string,
): Promise<ActionResult> {
  try {
    const res = await serverClient.post("/repositories", { repoId, fullName });
    console.log(res);
    revalidatePath("/repositories");
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? "An unexpected error occurred";
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: "An unexpected error occurred",
    };
  }
}

export async function updateRepository(
  id: string,
  payload: { enabledAgents: AgentType[]; severityThreshold: Severity },
): Promise<void> {
  await serverClient.patch(`/repositories/${id}`, payload);
  revalidatePath("/repositories");
}

export async function toggleRepositoryActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    await serverClient.patch(`/repositories/${id}`, { isActive });
    revalidatePath("/repositories");
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? "An unexpected error occurred";
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: "An unexpected error occurred",
    };
  }
}
