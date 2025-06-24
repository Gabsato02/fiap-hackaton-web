import {useUserStore} from "hostApp/store"

export const Sales = () => {
    const {userInfo} = useUserStore();
    return (
        <div>
            VENDAS
            {userInfo.name}
        </div>
    );
};

export default Sales;