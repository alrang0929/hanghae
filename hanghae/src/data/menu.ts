interface MenuItem {
  name: string;
  url: string;
}

interface ListItem {
  id: string;
  text: string;
  isTitle?: boolean;
  className?: string;
}

const gnbMenu: MenuItem[] = [
  {
    name: "about me",
    url: "/",
  },
  {
    name: "works",
    url: "/",
  },
  {
    name: "connect",
    url: "/",
  },
];

const LIST_ITEMS: ListItem[] = [
  { id: "title", text: "[항ː해]", isTitle: true, className: "serif-font padding-V-R" },
  { id: "list1", text: "1. 배를 타고 바다 위를 다님]" },
  { id: "list2", text: "2. 어떤 목표를 향하여 나아감. 또는 그런 과정을 비유적으로 이르는 말" },
];
export { gnbMenu, LIST_ITEMS };
