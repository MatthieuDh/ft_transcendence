import { useEffect, useState } from "react";
import { userService } from "../api/services";

export function useProfile(userId) {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        userService.getUser(userId).then(setUser);
    }, [userId])
    return { user };
}
