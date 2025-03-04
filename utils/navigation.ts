type MenuElement = {
  label: string;
  to: string;
  icon: string;
  active?: boolean;
};

type MenuList = MenuElement[];
type DeepMenuList = MenuList[];

export const mainMenuBase: MenuList = [
  {
    label: "Kezdőlap",
    to: "/dashboard",
    icon: "i-heroicons-home-solid",
  },
  {
    label: "Versenyek",
    to: "/dashboard/competitions",
    icon: "i-heroicons-trophy-solid",
  },
  {
    label: "Meghívók",
    to: "/dashboard/invites",
    icon: "i-heroicons-envelope-solid",
  },
  {
    label: "Fiókom",
    to: "/dashboard/settings",
    icon: "i-heroicons-user-solid",
  },
  {
    label: "Kilépés",
    to: "/logout",
    icon: "i-heroicons-arrow-right-on-rectangle-solid",
  },
];

export const adminMenuBase: MenuList = [
  {
    label: "Áttekintés",
    to: "/dashboard/admin",
    icon: "i-heroicons-home-solid",
  },
];

export const adminMenuLevel1: MenuList = [
  {
    label: "Pénzügyek",
    to: "/dashboard/admin/finance",
    icon: "i-heroicons-banknotes-solid",
  },
];

export const adminMenuLevel2: DeepMenuList = [
  [
    {
      label: "Oldalbeállítások",
      to: "/dashboard/admin/settings",
      icon: "i-heroicons-cog-8-tooth-solid",
    },
    {
      label: "Felhasználók",
      to: "/dashboard/admin/users",
      icon: "i-heroicons-users-solid",
    },
    {
      label: "Kijelző",
      to: "/dashboard/admin/screen",
      icon: "i-heroicons-window-solid",
    },
    {
      label: "Ülőhelyek",
      to: "/dashboard/admin/seats",
      icon: "i-heroicons-map-pin-solid",
    },
    {
      label: "Térképek",
      to: "/dashboard/admin/maps",
      icon: "i-heroicons-map-solid",
    },
  ],
  [
    {
      label: "Média",
      to: "/dashboard/admin/media",
      icon: "i-heroicons-photo-solid",
    },
    {
      label: "Tartalom",
      to: "/dashboard/admin/content",
      icon: "i-heroicons-document-text-solid",
    },
  ],
  [
    {
      label: "Versenyek",
      to: "/dashboard/admin/competitions",
      icon: "i-heroicons-trophy-solid",
    },
    {
      label: "Keretek",
      to: "/dashboard/admin/brackets",
      icon: "i-heroicons-table-cells-solid",
    },
    {
      label: "Rangsorok",
      to: "/dashboard/admin/toplist",
      icon: "i-heroicons-numbered-list-solid",
    },
  ],
];
