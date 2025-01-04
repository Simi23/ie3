export default defineAppConfig({
  ui: {
    notifications: {
      position: "bottom-0 right-0",
    },
    primary: "cyan",
    gray: "cool",
    horizontalNavigation: {
      active:
        "text-gray-900 dark:text-fuchsia-50 after:bg-primary-500 dark:after:bg-fuchsia-400 after:rounded-full",
    },
    verticalNavigation: {
      active:
        "text-gray-900 dark:text-fuchsia-50 before:bg-gray-100 dark:before:bg-gray-800",
      icon: {
        active: "text-gray-700 dark:text-fuchsia-300",
      },
    },
  },
});
