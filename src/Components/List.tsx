import { FC } from 'react'

const List: FC<{ ordered: boolean }> = ({ ordered, children }) => {
	return (
		<div className='centered'>
			{ordered ?
				<ol>
					{children}
				</ol>
				:
				<ul>
					{children}
				</ul>}
		</div>
	);
};

export default List;
