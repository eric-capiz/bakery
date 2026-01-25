
interface Cake {
  title: string;
  mainImg: string;
  secondaryImg: string;
  url: string;
}

export const CakeState = (): Cake[] => {
  return [
    {
      title: "Cake 1",
      mainImg: "/img/Cakes/cake7.jpg",
      secondaryImg: "/img/Cakes/cake5.jpg",
      url: "cake1",
    },
    {
      title: "Cake 2",
      mainImg: "/img/Cakes/cake11.jpg",
      secondaryImg: "/img/Cakes/cake3.jpg",
      url: "cake2",
    },
    {
      title: "Cake 3",
      mainImg: "/img/Cakes/cake4.jpg",
      secondaryImg: "/img/Cakes/cake3.jpg",
      url: "cake3",
    },
  ];
};
