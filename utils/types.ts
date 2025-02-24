import type { UserAgentInfo } from "./userAgent";
import Color from "#ui-colors";
import type { Notification } from "./createNotification";

export type Icon = {
  icon: string;
  name: string;
  color: (typeof Color)[number];
};

export type Badge = {
  icon: string;
  name: string;
  color: (typeof Color)[number];
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
