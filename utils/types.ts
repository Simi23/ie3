import type { UserAgentInfo } from "./userAgent";
import Color from "#ui-colors";
import type { Notification } from "./createNotification";

export type UiColor = (typeof Color)[number];

export type Icon = {
  icon: string;
  name: string;
  color: UiColor;
};

export type Badge = {
  icon: string;
  name: string;
  color: UiColor;
};

export type NotificationResponse = {
  notification: Notification;
};

export type UserData = {
  id: string;
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  username: string;
  fullname: string;
  dcId: string;
  dcAvatar: string;
  dcConnected: boolean;
  dcGlobalName: string;
  class: {
    id: string;
    name: string;
  };
  adminClass: number;
  sessions: {
    id: string;
    createdAt: Date;
    expiresAt: Date;
    valid: boolean;
    address: string;
    userAgent: string;
  }[];
  ownPc: boolean;
  ethernetPort: boolean;
  ownChair: boolean;
  teams: {
    isLeader: boolean;
    team: {
      name: string;
      competition: {
        id: string;
        title: string;
        teamCompetition: boolean;
      };
    };
  }[];
  seat: {
    name: string;
    public: boolean;
  };
  paid: boolean;
};

export type ExtendedSession = {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  valid: boolean;
  address: string;
  userAgent: UserAgentInfo;
};

export type CellData = {
  upper: {
    name: string;
    points: number[];
    won: boolean;
    id: string;
  };
  lower: {
    name: string;
    points: number[];
    won: boolean;
    id: string;
  };

  started: boolean;
  ended: boolean;
  tracked: boolean;
};

// =======================
//  Bracket display types
// =======================

export type DisplayBracket = {
  id: string;
  title: string;
  competition: DisplayCompetition;
  competitionId: string;
  numberOfCompetitors: number;
  parts: DisplayPart[];
};

type DisplayCompetition = {
  id: string;
  title: string;
  teamCompetition: boolean;
};

type DisplayPart = {
  id: string;

  round: number;
  roundLocation: number;
  upper: boolean;
  startLocation: boolean;

  points: number[];
  won: boolean;
  started: boolean;
  ended: boolean;

  bracketId: string;
  team: DisplayTeam | null;
  teamId: string | null;

  isTracked: boolean;
};

type DisplayTeam = {
  id: string;
  name: string;
};
