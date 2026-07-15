export const dynamic = "force-dynamic";

import { getConfig, getConfigColours } from "@/lib/client/config";
import OverlayClient from "./_client";

export default async function Page() {
    const config = await getConfig();
    const colours = await getConfigColours();

    return <OverlayClient config={config} colours={colours} />;
}
