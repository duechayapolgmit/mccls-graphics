export const dynamic = "force-dynamic";

import { getConfig } from "@/lib/server/config";
import OverlayClient from "./_client";

export default async function Page() {
    const config = await getConfig("general");
    const colours = await getConfig("colours");

    return <OverlayClient config={config} colours={colours} />;
}
