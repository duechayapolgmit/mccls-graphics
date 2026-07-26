// hard coding stuff right now, will polish later

import CardGrid from "@/components/break/card_grid";
import { getCardGridList } from "@/lib/client/breakInfo";

export default async function Page() {
    return (
        <div>
            <CardGrid lst={getCardGridList("roster")}/>
        </div>
    )
}