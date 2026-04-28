import { Asset, Coin } from "./types";
import { cryptoAssets, cryptoData } from "./data";

export function fakeFetchCrypto(): Promise<{ result: Coin[] }> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cryptoData as { result: Coin[] })
        }, 1);
    })
}

export function fetchAssets(): Promise<Asset[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cryptoAssets as Asset[])
        }, 1);
    })
}
