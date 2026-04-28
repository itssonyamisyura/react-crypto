import { createContext , useContext, useEffect, useState } from "react";
import { fetchAssets, fakeFetchCrypto } from '../api';
import { percentDifference } from "../utils";

const CryptoContext = createContext ({
    assets: [],
    crypto: [],
    loading: false,
})


export function CryptoContextProvider({children}) {

    const [loading, setLoading] = useState(false);
    const [crypto, setCrypto] = useState([]);
    const [assets, setAssets] = useState([]);

    function mapAssets(assets, result) {
        return assets.map(asset => {
            const coin = result.find((c) => c.id === asset.id)

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
            let assets;
            
            if (storedAssets) {
                assets = JSON.parse(storedAssets).map(a => ({
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

    function addAsset(newAsset) {
        setAssets((prev) => {
            const rawPrev = prev.map(a => ({
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
} // now we only import our hook