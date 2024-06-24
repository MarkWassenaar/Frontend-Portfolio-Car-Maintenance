import { Item } from "@/pages/index";
import Link from "next/link";

interface ItemListProps {
  items: Item[];
}

const ItemList = (props: ItemListProps) => {
  const sortedItems = [...props.items].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="toy-list">
      {sortedItems.map((item) => (
        <div className="toy-card" key={item.id}>
          <Link href={`/items/${item.id}`}>
            <h3>{item.name}</h3>
          </Link>
          <img src={item.imgUrl}></img>
          <p>Minimum Bid: {item.minimumBid}</p>
          <p>Available:{item.sold ? "No" : "Yes"}</p>
          <p>Number of Bids: {item.Bid.length}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
