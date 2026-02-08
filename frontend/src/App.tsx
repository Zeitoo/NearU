import { Outlet } from "react-router-dom";

function App() {
	return (
		<>
			<div className="h-full text-black">
				<Outlet />
			</div>
		</>
	);
}

export default App;
