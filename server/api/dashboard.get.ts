import { prisma } from "~/db/prismaClient";

type DashboardNotification = {
  severity: "INFO" | "WARN" | "ERROR";
  title: string;
  message: string;
};

export default defineEventHandler(async (event) => {
  if (event.context.user === undefined) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "session-not-found",
    });
  }

  // Get dashboard content
  const contentPromise = prisma.option.findUnique({
    where: {
      name: "indexContent",
    },
  });

  const notifications: DashboardNotification[] = [];

  // Get payment & email status
  const userStatusPromise = prisma.user.findUnique({
    where: {
      id: event.context.user.id,
    },
    select: {
      paid: true,
      emailVerified: true,
    },
  });

  // Check if the player is a member of a non-full team
  const teamMemberCountPromise = prisma.user.findUnique({
    where: {
      id: event.context.user.id,
    },
    select: {
      teams: {
        select: {
          team: {
            select: {
              competition: {
                select: {
                  teamLimit: true,
                },
              },
              _count: {
                select: {
                  users: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Check if the player is a member of a default-named team
  const defaultTeamPromise = prisma.user.findUnique({
    where: {
      id: event.context.user.id,
    },
    select: {
      teams: {
        where: {
          team: {
            name: "Új csapat",
          },
        },
      },
    },
  });

  const [content, userStatus, teamMemberCount, defaultTeam] = await Promise.all(
    [
      contentPromise,
      userStatusPromise,
      teamMemberCountPromise,
      defaultTeamPromise,
    ],
  );

  if (userStatus && userStatus.paid === false) {
    notifications.push({
      severity: "ERROR",
      title: "Hiba",
      message: "Még nem fizetted be a részvételi díjat!",
    });
  }

  if (userStatus && userStatus.emailVerified === false) {
    notifications.push({
      severity: "WARN",
      title: "Hiba",
      message: "Még nem erősítetted meg az email címedet!",
    });
  }

  if (teamMemberCount) {
    const smaller = teamMemberCount.teams.some((t) => {
      return t.team._count.users < t.team.competition.teamLimit;
    });
    if (smaller) {
      notifications.push({
        severity: "WARN",
        title: "Figyelmeztetés",
        message:
          "Tagja vagy egy olyan csapatnak, amiben még nincs meg a teljes létszám.",
      });
    }
  }

  if (defaultTeam && defaultTeam.teams.length > 0) {
    notifications.push({
      severity: "WARN",
      title: "Figyelmeztetés",
      message: "Tagja vagy egy olyan csapatnak, amit még nem neveztek át.",
    });
  }

  let contentId = null;
  if (content) {
    contentId = content.value as string;
  }

  return {
    contentId: contentId,
    notifications: notifications,
  };
});
