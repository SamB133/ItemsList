import { useState, useRef, useEffect, FC } from 'react';
import ListItem, { ListItemType } from './ListItem';
import List from './List';
import produce from 'immer';

const App: FC = () => {
	const [listItems, setListItems] = useState<ListItemType[]>([]);
	const [ordered, setOrdered] = useState(false);
	const itemRef = useRef<HTMLInputElement>(null);
	const addButtonRef = useRef<HTMLButtonElement>(null);
	const localStorageItemsKey = 'listApp.listItems';
	const localStorageOrderedKey = 'listApp.listOrdered';

	useEffect(() => {
		if (localStorage.getItem(localStorageItemsKey) == null) { return }
		else {
			const storedListItems: ListItemType[] = JSON.parse(localStorage.getItem(localStorageItemsKey) as string);
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
			if (itemRef.current.value.length <= 75) {
				const name = itemRef.current.value;
				if (name === '') return;
				setListItems(produce(listItems, newListItems => {
					newListItems.push({ id: Math.random(), name, complete: false });
				}));
				itemRef.current.value = '';
			}
			else if (itemRef.current.value.length > 75) {
				alert("Error: 75 character limit exceeded. Please try again.");
				itemRef.current.value = '';
			}
		}
	};

	function complete(index: number) {
		setListItems(produce(listItems, newListItems => {
			newListItems[index].complete = !newListItems[index].complete;
		}))
	};

	function deleteItem(id: number) {
		setListItems(listItems.filter(item => item.id !== id));
	}

	return (
		<div className='centered'>
			<div><button className='buttonsInput' onClick={() => setOrdered(!ordered)} >Change List Type (Ordered or Unordered)</button></div>
			<div><input className='buttonsInput' type="text" ref={itemRef} onKeyPress={(e) => { if (e.key === 'Enter') addButtonRef.current?.click(); }} /></div>
			<button className='buttonsInput' style={{ color: 'green' }} onClick={addItem} ref={addButtonRef} >Add Item to List</button>
			<button className='buttonsInput' style={{ color: 'red' }} onClick={() => setListItems(listItems.filter(item => !item.complete))} >Delete Completed Items</button>
			<div className='text' >You have {listItems.length} items in your list</div>
			<List ordered={ordered}>
				{listItems.map((item, index) => (
					<ListItem key={item.id} item={item} onClickItem={() => complete(index)} onDeleteItem={() => deleteItem(item.id)} />
				))}
			</List>
		</div>
	);
};

export default App;
