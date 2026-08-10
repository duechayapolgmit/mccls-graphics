'use client'
import { createContext, use, useContext, useMemo } from "react";

const ConfigContext = createContext<any>(null);

function parseValue(val: any) {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }
    return val;
}

export function ConfigProvider({configData, children}: {configData: any, children: React.ReactNode}) {
    const convertedData: Record<string, any> = {};
    if (configData) {
        for (const [key, val] of Object.entries(configData)) {
            if (val && typeof (val as any).then === 'function') convertedData[key] = parseValue(use(val as Promise<any>))
            else convertedData[key] = parseValue(val);
        }
    }
    return (
        <ConfigContext.Provider value={convertedData}>
            {children}
        </ConfigContext.Provider>
    )
}

export function useConfig() {
    const configData = useContext(ConfigContext)
    if (!configData) throw new Error('useConfig must be used within a ConfigProvider')
    return configData;
}