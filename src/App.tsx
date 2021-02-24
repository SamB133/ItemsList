import { useState, useRef, useEffect, FC } from 'react';
import ItemList, { ListItem } from './ItemList';
import produce from 'immer';

const App: FC = () => {
	const [listItems, setListItems] = useState<ListItem[]>([]);
	const [ordered, setOrdered] = useState(false);
	const itemRef = useRef<HTMLInputElement>(null);
	const addButtonRef = useRef<HTMLButtonElement>(null);
	const localStorageItemsKey = 'listApp.listItems';
	const localStorageOrderedKey = 'listApp.listOrdered';

	useEffect(() => {
		if (localStorage.getItem(localStorageItemsKey) == null) { return }
		else {
			const storedListItems: ListItem[] = JSON.parse(localStorage.getItem(localStorageItemsKey) as string);
			if (storedListItems) setListItems(storedListItems);
		}
		if (localStorage.getItem(localStorageOrderedKey) == null) { return }
		else {
			const storedListOrdered: boolean = JSON.parse(localStorage.getItem(localStorageOrderedKey) as string);
			if (storedListOrdered) setOrdered(storedListOrdered);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(localStorageItemsKey, JSON.stringify(listItems));
	}, [listItems]);

	useEffect(() => {
		localStorage.setItem(localStorageOrderedKey, JSON.stringify(ordered));
	}, [ordered]);

	function addItem() {
		if (itemRef.current) {
			const name = itemRef.current.value;
			if (name === '') return;
			setListItems(produce(listItems, newListItems => {
				newListItems.push({ id: Math.random(), name, complete: false })
			}));
			itemRef.current.value = '';
		}
	};

	return (
		<>
			<div><button onClick={() => setOrdered(!ordered)} >Change List Type (Ordered or Unordered)</button></div>
			<input type="text" ref={itemRef} onKeyPress={(e) => { if (e.key === 'Enter') addButtonRef.current?.click(); }} />
			<button style={{ color: 'green' }} onClick={addItem} ref={addButtonRef} >Add Item to List</button>
			<button style={{ color: 'red' }} >Delete Completed Items</button>
			<div>You have {listItems.length} items in your list</div>
			<ItemList listItems={listItems} ordered={ordered} setListItems={setListItems} />
		</>
	);
};

export default App;
