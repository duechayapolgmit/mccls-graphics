import { useConfig } from "@/components/providers/configProvider";
import React, { useLayoutEffect, useRef, useState } from "react";

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

export function FadeStack({active, className = "", children}: {active: number, className?: string, children: React.ReactNode[]}) {
    const childArray = React.Children.toArray(children); 

    const measureRef = useRef<HTMLDivElement>(null);
    const [maxSize, setMaxSize] = useState<{width: number, height: number}>({width: 0, height: 0})

    // measure all children for max size
    useLayoutEffect(() => {
        if (!measureRef.current) return;
        const container = measureRef.current;
        const nodes = Array.from(container.children)

        let maxWidth = 0;
        let maxHeight = 0;

        nodes.forEach((node) => {
            maxWidth = Math.max(maxWidth, node.clientWidth);
            maxHeight = Math.max(maxHeight, node.clientHeight);
        })
    
        setMaxSize({width: maxWidth, height: maxHeight})
    }, [children]);

    return (
        <>
            <div ref={measureRef}
                 style={{position: "absolute", left: "-99999px", top: "-99999px", visibility: "hidden"}}> {/* Just for sizing */}
                {childArray.map((child, i) => (
                    <div key={i}>{child}</div>
                ))}
            </div>
            <div className={`relative ${className}`} style={{width: maxSize.width, height: maxSize.height}}>
                {childArray.map((child, i) => (
                    <div key={i} className="absolute inset-0 transition-opacity duration-500 content-center"
                        style={{opacity: i === active ? 1 : 0}}>
                        {child}
                    </div>
                ))}
        </div>
        </>
        
    )
}

export async function apiFetch(endpoint: string, params?: URLSearchParams) {
  const url = params ? `${API_URL}/${endpoint}?${params.toString()}` : `${API_URL}/${endpoint}`;
  return fetch(url, {cache:'no-store'})
}