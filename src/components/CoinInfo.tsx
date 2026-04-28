import { Typography, Flex } from 'antd';
import { Coin } from '../types';

interface CoinInfoProps {
    coin: Coin;
    withSymbol?: boolean;
}

export default function CoinInfo({ coin, withSymbol }: CoinInfoProps) {
    return (
        <Flex align='center'>
            <img 
                src={coin.icon} 
                alt={coin.name} 
                style={{ width: 40, marginRight: 10 }} 
            />
            <Typography.Title level={2} style={{ margin: 0 }}>
                {withSymbol && <span>({coin.symbol})</span>} {coin.name}
            </Typography.Title>
        </Flex>
    )
}
