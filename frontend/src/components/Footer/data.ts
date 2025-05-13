interface ILinks {
  id: number;
  title: string;
  path: string;
}

export const linksData: ILinks[] = [
  {
    id: 1,
    title: "Privacidade",
    path: "#",
  },
  {
    id: 2,
    title: "Cookies",
    path: "#",
  },
  {
    id: 3,
    title: "Termos de Uso",
    path: "#",
  },
  {
    id: 4,
    title: "Sobre Nós",
    path: "#",
  },
];

interface IFooterItems {
  id: number;
  title: string;
}

export const footerItemsData: IFooterItems[] = [
  {
    id: 1,
    title: "Lorem Ipsum",
  },
  {
    id: 2,
    title: "Lorem Ipsum",
  },
  {
    id: 3,
    title: "Lorem Ipsum",
  },
  {
    id: 4,
    title: "Lorem Ipsum",
  },
];
