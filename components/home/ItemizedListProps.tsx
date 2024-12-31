export interface ItemizedListProps {
  items: Item[];
}

export interface Item {
  icon: string | null;
  title: string;
  content: React.ReactNode;
}
