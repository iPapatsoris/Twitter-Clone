import globalClassNames from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Sidebar: SidebarNames;
  readonly Logo: SidebarNames;
  readonly Icon: SidebarNames;
  readonly TweetButton: SidebarNames;
};
export = classNames;
