import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { StudioDashboard, optionalMenus } from "./StudioDashboard";

export async function Welcome() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) return null;
  const access = { overrideAccess: false, user };
  const [projects, media, optionalCounts] = await Promise.all([
    payload.find({
      collection: "projects",
      pagination: false,
      ...access,
      draft: true,
    }),
    payload.count({ collection: "media", ...access }),
    Promise.all(
      optionalMenus.map(async (menu) => ({
        ...menu,
        ...(await payload.count({ collection: menu.slug, ...access })),
      })),
    ),
  ]);
  return (
    <StudioDashboard
      projectCount={projects.totalDocs}
      publishedCount={
        projects.docs.filter(
          (project) => project._status === "published" && !project.archived,
        ).length
      }
      mediaCount={media.totalDocs}
      incomplete={projects.docs
        .filter((project) => !project.contribution || !project.outcome)
        .map((project) => ({
          id: project.id,
          title: project.title,
          missing: [
            !project.contribution && "kontribusi pribadi",
            !project.outcome && "hasil dan bukti",
          ]
            .filter(Boolean)
            .join(" serta "),
        }))}
      optionalCounts={optionalCounts}
    />
  );
}
