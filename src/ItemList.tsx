import { Dispatch, FC, SetStateAction } from 'react'
import produce from 'immer';

export type ListItem = {
	id: number,
	name: string,
	complete: boolean
};

type ItemListProps = {
	listItems: {
		id: number;
		name: string;
		complete: boolean
	}[],
	ordered: boolean,
	setListItems: Dispatch<SetStateAction<ListItem[]>>;
};

const ItemList: FC<ItemListProps> = ({ listItems, ordered, setListItems }) => {
	const arrayToList = () => {
		return (listItems.map((item, index) => (
			<li key={item.id}>
				<span onClick={() =>
					setListItems(produce(listItems, newListItems => {
						newListItems[index].complete = !newListItems[index].complete;
					}))
				}
					className={item.complete ? 'itemCompleted' : 'itemIncomplete'}
				>
					{item.name}
				</span></li>
		)))
	};

	return (
		<div className='centered'>
			{ordered ?
				<ol>
					{arrayToList()}
				</ol>
				:
				<ul>
					{arrayToList()}
				</ul>}
		</div>
	);
};

export default ItemList;
