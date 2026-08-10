import CardGrid from "@/components/client/break/card_grid";
import WinsLeaderboard from "@/components/client/break/wins_leaderboard";

import { getCardGridList, getGamesFeatured, getGamesOverviewHeader, getTeamFromTeamAnalysis, getType } from "@/lib/client/breakInfo";
import { getWinsLeaderboardFromAmount } from "@/lib/server/wins";
import { resolveRule } from "@/lib/utils/utils";
import { getGridColumnAmountFromMap } from "@/lib/utils/winsLeaderboardUtils";
import MVPTable from '@/components/client/break/mvp_table';
import Explainer from '@/components/client/break/explainer';
import TeamsOverview from "@/components/client/team/teams_overview";
import CurrentStandings from "@/components/client/break/current_standings";
import { GamesOverview } from "@/components/client/break/games_overview";
import { TeamAnalysis } from "@/components/client/break/team_analysis";
import { useConfig } from "@/components/providers/configProvider";

interface IRule {
    eq?: number;
    max?: number;
    value: string
}

const WINS_LEADERBOARD_ROWS = 3;

export default function BreakScreenBody({screen}: {screen: string}) {
    const config = useConfig().general;
    const configBreak = useConfig().break;

    const getScaleSize = (rules: IRule[], amount: number) => Number(resolveRule(rules, amount));
    const type = getType(screen);

    let lst: string[] = [];
    let leaderboard = new Map<number, string[]>();
    let scale = 1;
    let remarks = "";

    switch (type) {
        case "card_grid":
            lst = getCardGridList(screen);
            scale = getScaleSize(configBreak.grid_list_scale, lst.length);
            break;
        case "wins_leaderboard":
            leaderboard = getWinsLeaderboardFromAmount(config.break_screens.minimum_wins);
            const cols = getGridColumnAmountFromMap(leaderboard, WINS_LEADERBOARD_ROWS);
            scale = getScaleSize(configBreak.wins_leaderboard_scale, cols);
            break;
        case "teams_overview":
            scale = configBreak.scales.teams_overview;
            break;
        case "current_standings":
            scale = configBreak.scales.current_standings;
            break;
        case "team_analysis":
            remarks = configBreak.remarks.team_analysis;
            break;
    }

    const getContent = () => {
        switch (type) {
            case "card_grid": 
                return <CardGrid lst={lst}/>
            case "wins_leaderboard": 
                return <WinsLeaderboard playersWins={leaderboard}/>
            case "mvp_table":
                return <MVPTable screen={screen}/>
            case "explainer":
                return <Explainer screen={screen}/>
            case "game_explainer":
                return <Explainer screen={screen} isGame={true}/>
            case "teams_overview":
                return <TeamsOverview />
            case "current_standings":
                return <CurrentStandings />
            case "games_overview":
                return <GamesOverview title={getGamesOverviewHeader(screen)} lst={getGamesFeatured(screen)}/>
            case "team_analysis":
                return <TeamAnalysis team={getTeamFromTeamAnalysis(screen)}/>
            default: 
                return null;
        }
    }

    return (
        <div key={screen} className="scale-(--scale)" style={{"--scale": scale} as React.CSSProperties}>
            {getContent()}
        </div>
    )
}