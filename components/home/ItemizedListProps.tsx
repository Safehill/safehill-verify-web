export interface ItemizedListProps {
  items: Item[];
}

export interface Item {
  icon: string | null;
  title: string;
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode;
  cta?: React.ReactNode;
}
