import { createContext, useState } from "react";
import type { User } from "../types";

interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}