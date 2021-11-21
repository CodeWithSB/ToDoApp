import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import db from "./FirebaseSetup";
import ToDoItem from "./ToDoItem";

function App() {
	const [todoList, setToDoList] = useState<ToDoItem[]>([]);
	const [newTitle, setNewTitle] = useState("");

	useEffect(() => {
		async function LoadToDos() {
			await GetToDoList();
		}
		LoadToDos();
	}, []);

	const GetToDoList = async () => {
		const querySnapshot = await getDocs(collection(db, "ToDoCollection"));
		let todoTemp: ToDoItem[] = [];
		querySnapshot.forEach((doc) => {
			todoTemp.push({
				id: doc.id,
				title: doc.data().title,
				isCompleted: doc.data().isCompleted,
			});
		});
		setToDoList(todoTemp);
		setNewTitle("");
	};

	const AddToDoItem = async () => {
		await addDoc(collection(db, "ToDoCollection"), {
			title: newTitle,
			isCompleted: false,
		});
		await GetToDoList();
	};

	const DeleteToDoItem = async (todo: ToDoItem) => {
		await deleteDoc(doc(db, "ToDoCollection", todo.id));
		await GetToDoList();
	};

	const UpdateToDoItem = async (todo: ToDoItem) => {
		console.log(JSON.stringify(todo, null, 2));
		await updateDoc(doc(db, "ToDoCollection", todo.id), {
			isCompleted: !todo.isCompleted,
		});
		await GetToDoList();
	};

	const OnTitleChange = (ev: any) => {
		setNewTitle(ev.target.value);
	};

	return (
		<div className="p-2 w-1/2 m-auto">
			<div className="flex justify-between my-2">
				<input
					type="text"
					name="title"
					id="title"
					className="bg-gray-100 text-gray-500 w-11/12 py-1 px-4 outline-none rounded-lg"
					value={newTitle}
					onChange={(ev) => OnTitleChange(ev)}
				/>
				<button
					className="w-28 ml-2 py-2 px-4 bg-green-700 text-gray-50 rounded-md text-sm"
					onClick={AddToDoItem}
				>
					Add Item
				</button>
			</div>
			<ul>
				{todoList &&
					todoList.map((todoItem: ToDoItem, idx: number) => (
						<li
							key={idx}
							className={`px-4 py-1 m-0.5 text-lg bg-gray-300 text-gray-600 flex justify-between align-items-center rounded-lg cursor-pointer`}
						>
							<span
								className={`py-2 px-4${
									todoItem.isCompleted ? " line-through" : ""
								}`}
							>
								{todoItem.title}
							</span>
							<div className="space-x-2">
								<button
									className="py-2 px-4 bg-red-400 text-gray-50 my-2 rounded-md text-sm"
									onClick={() => UpdateToDoItem(todoItem)}
								>
									Complete
								</button>
								<button
									className="py-2 px-4 bg-red-700 text-gray-50 my-2 rounded-md text-sm"
									onClick={() => DeleteToDoItem(todoItem)}
								>
									Delete
								</button>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}

export default App;
