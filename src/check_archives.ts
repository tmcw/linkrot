import { queryIA } from "./query_ia";
import { LURLGroup } from "../types";

export async function checkArchives(groups: LURLGroup[]) {
  let errorGroups = groups.filter((group) => group.status?.status === "error");
  errorGroups = errorGroups.slice(0, 50);
  if (!errorGroups.length) return;

  const archiveStatus = await queryIA(errorGroups);

  for (let result of archiveStatus.results) {
    if (result.archived_snapshots?.closest?.available) {
      errorGroups.find((group) => group.url == result.url)!.status = {
        status: "archive",
        to: result.archived_snapshots!.closest.url.replace(/^http:/, "https:"),
      };
    }
  }
}
