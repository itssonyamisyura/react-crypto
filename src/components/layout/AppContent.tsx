import { Layout, Typography } from 'antd';
import { useCrypto } from '../../context/crypto-context';
import PortfolioChart from '../PortfolioChart';
import AssetsTable from '../AssetsTable';
import { Coin } from '../../types';

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 'calc(100vh - 60px)',
    color: '#fff',
    backgroundColor: '#001529',
    padding: '1rem',
};

export default function AppContent() {
    const {assets, crypto} = useCrypto()

    const cryptoPriceMap = crypto.reduce((acc: Record<string, number>, c: Coin) => {
        acc[c.id] = c.price
        return acc
    }, {})

    return (
        <Layout.Content style={contentStyle}>
            <Typography.Title 
                level={3} 
                style={{textAlign: 'left', color: '#fff'}}>
                    Portfolio: ${assets.map((asset) => asset.amount * (cryptoPriceMap[asset.id] || 0))
                    .reduce((acc: number, v: number) => acc + v, 0)
                    .toFixed(2)}
                    
            </Typography.Title>
            <PortfolioChart/>
            <AssetsTable/>
        </Layout.Content>
    )
}