export const UserDataView = ({ username }: { username: string }) => (
    <div>
        { username }
    </div>
)

export const UserDataController = () => {
    // todo task 4: set up with useReducer, and fetch state (in UserData component) via useContext
    // Reference tutorial : https://dev.to/eswaraprakash/react-usecontext-and-usereducer-hooks-2pkm
    // useContext ...

    // return <UserDataView 
    //     username={ username_from_context }
}

export const UserData = UserDataController;


