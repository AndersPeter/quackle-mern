import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuthStatus = () => {
    const [loggedIn, SetLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const {user} = useSelector((state) => state.auth)

    useEffect(() => {
        if(user) {
            SetLoggedIn(true)
        } else {
            SetLoggedIn(false)
        }
        setCheckingStatus(false)


    }, [user]
    )

    return {loggedIn, checkingStatus}


}

