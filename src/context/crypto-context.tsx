import { createContext , useContext, useEffect, useState, ReactNode } from "react";
import { fetchAssets, fakeFetchCrypto } from '../api';
import { percentDifference } from "../utils";
import { Asset, Coin, MappedAsset, CryptoContextValue } from "../types";

const CryptoContext = createContext<CryptoContextValue> ({
    assets: [],
    crypto: [],
    loading: false,
    addAsset: () => {},
})


export function CryptoContextProvider({ children }: { children: ReactNode }) {

    const [loading, setLoading] = useState(false);
    const [crypto, setCrypto] = useState<Coin[]>([]);
    const [assets, setAssets] = useState<MappedAsset[]>([]);

    function mapAssets(assets: Asset[], result: Coin[]): MappedAsset[] {
        return assets.map(asset => {
            const coin = result.find((c) => c.id === asset.id)

            if (!coin) {
                // Return a dummy object or handle error
                return {
                    ...asset,
                    grow: false,
                    growPercent: 0,
                    totalAmount: 0,
                    totalProfit: 0,
                    name: 'Unknown',
                }
            }

            return {
                ...asset,
                grow: asset.price < coin.price,
                growPercent: percentDifference(asset.price, coin.price),
                totalAmount: asset.amount * coin.price,
                totalProfit: asset.amount * coin.price - asset.amount * asset.price,
                name: coin.name,
            }
        })
    }

    useEffect(() => {
        async function preload() {
            setLoading(true);
            const {result} = await fakeFetchCrypto();
            const storedAssets = localStorage.getItem('assets');
            let assets: Asset[];
            
            if (storedAssets) {
                assets = JSON.parse(storedAssets).map((a: any) => ({
                    ...a,
                    date: new Date(a.date)
                }));
            } else {
                assets = await fetchAssets();
            }

            setAssets(mapAssets(assets, result));
            setCrypto(result);
            setLoading(false);
        }
        preload();
    }, [])

    function addAsset(newAsset: Asset) {
        setAssets((prev) => {
            const rawPrev: Asset[] = prev.map(a => ({
                id: a.id,
                amount: a.amount,
                price: a.price,
                date: a.date
            }));
            const updatedRawAssets = [...rawPrev, newAsset];
            localStorage.setItem('assets', JSON.stringify(updatedRawAssets));
            return mapAssets(updatedRawAssets, crypto);
        })
    }

    return (
    <CryptoContext.Provider value={{loading, crypto, assets, addAsset}}>
        {children}
    </CryptoContext.Provider>)
}

export default CryptoContext;

export function useCrypto() {
    return useContext(CryptoContext);
}
