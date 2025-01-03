import type { UserAgentInfo } from "./userAgent";
import Color from "#ui-colors";

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

export type UserData = {
  id: string;
  createdAt: Date;
  email: string;
  username: string;
  fullname: string;
  class: {
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
    isPending: boolean;
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
