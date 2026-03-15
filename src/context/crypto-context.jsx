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

    useEffect(() => {
        async function preload() {
            setLoading(true);
            const {result} = await fakeFetchCrypto();
            const assets = await fetchAssets();

            setAssets(assets.map(asset => {
                const coin = result.find((c) => c.id === asset.id)

                //asset price => we bought
                //coin price => actual(market) price
                return {
                    grow: asset.price < coin.price, // grows
                    growPercent: percentDifference(asset.price, coin.price),
                    totalAmount: asset.amount * coin.price,
                    totalProfit: asset.amount * coin.price - asset.amount * asset.price,
                    ...asset,
                }
            }));
            setCrypto(result);
            setLoading(false);
        }
        preload();
    }, [])

    return <CryptoContext.Provider value={{loading, crypto, assets}}>{children}</CryptoContext.Provider>
}

export default CryptoContext;

export function useCrypto() {
    return useContext(CryptoContext);
} // now we only import our hook