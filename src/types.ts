export interface Coin {
    id: string;
    icon: string;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    priceBtc: number;
    volume: number;
    marketCap: number;
    availableSupply: number;
    totalSupply: number;
    priceChange1h: number;
    priceChange1d: number;
    priceChange1w: number;
    redditUrl?: string;
    websiteUrl?: string;
    twitterUrl?: string;
    contractAddress?: string;
    decimals?: number;
    explorers: string[];
}

export interface Asset {
    id: string;
    amount: number;
    price: number;
    date: Date;
}

export interface MappedAsset extends Asset {
    grow: boolean;
    growPercent: number;
    totalAmount: number;
    totalProfit: number;
    name: string;
}

export interface CryptoContextValue {
    assets: MappedAsset[];
    crypto: Coin[];
    loading: boolean;
    addAsset: (newAsset: Asset) => void;
}
