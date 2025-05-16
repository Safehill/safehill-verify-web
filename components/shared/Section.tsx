import { Item } from '../home/ItemizedListProps';

const Section = ({ item }: { item: Item }) => {
  return (
    <div className="w-full my-10">
      <div className="font-display text-xl md:text-3xl tracking-[-0.02em]">
        {item.title}
      </div>

      <div className="mt-4 text-sm md:text-base font-light">{item.mainContent}</div>
    </div>
  );
};

export default Section;
