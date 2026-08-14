import { useConfig } from "@/components/providers/configProvider";

const API_URL = "http://localhost:3000/api"

export function TextFormatter({text}: {text: string}) {
    const colours = useConfig().colours;

    const tokens = text.split(/(<\/?b>|<\/?h>|<br\/>)/g);

    let bold = false;
    let highlight = false;

    const output = tokens.map((token, idx) => {
        switch (token) {
            case "<b>":
                bold = true;
                return;
            case "</b>":
                bold = false;
                return;
            case "<h>":
                highlight = true;
                return;
            case "</h>":
                highlight = false;
                return;
            case "<br/>":
                return <br key={`br-${idx}`}/>
        }

        let element: React.ReactNode = token;

        if (highlight) {
            element = (
                <span key={`h-${idx}`} style={{ color: colours?.highlight }}>
                    {element}
                </span>
            );
        }

        if (bold) {
            element = (
                <span key={`b-${idx}`} className="font-metropolis-black">
                    {element}
                </span>
            );
        }

        return element;
    })

    return <span>{output}</span>
}

export function FadeComponents({active, className = "", childrenA, childrenB}: {active: boolean, className?: string, childrenA: React.ReactNode, childrenB: React.ReactNode}) {
    return (
        <div className={`relative ${className}`}>
            <div className="opacity-0"> {/* Just for sizing */}
                {active ? childrenB : childrenA}
            </div>
            <div className="absolute inset-0 transition-opacity duration-500"
                 style={{opacity: active ? 0 : 1}}>
                {childrenA}
            </div>
            <div className="absolute inset-0 transition-opacity duration-500"
                 style={{opacity: active ? 1 : 0}}>
                {childrenB}
            </div>
        </div>
    )
}

export async function apiFetch(endpoint: string, params?: URLSearchParams) {
  const url = params ? `${API_URL}/${endpoint}?${params.toString()}` : `${API_URL}/${endpoint}`;
  return fetch(url, {cache:'no-store'})
}