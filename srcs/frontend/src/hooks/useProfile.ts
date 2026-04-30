import { useEffect, useState } from "react";
import { userService } from "../api/services";
import type { User } from "../../../../shared/srcs/types/user";

export function useProfile(userId: number) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(()=>{
        userService.getUser(userId).then(response => {
            setUser(response.data);
        });
    }, [userId])
    return { user };
}
