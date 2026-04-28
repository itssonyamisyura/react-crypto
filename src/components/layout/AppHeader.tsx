import { Layout, Select, Space, Button, Modal, Drawer } from 'antd';
import { useCrypto } from '../../context/crypto-context';
import { useEffect, useState } from 'react';
import CoinInfoModal from '../CoinInfoModal';
import AddAssetForm from '../AddAssetForm';
import { Coin } from '../../types';

const headerStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};


export default function AppHeader() {
    const [select, setSelect] = useState(false);
    const [coin, setCoin] = useState<Coin | null>(null);
    const [modal, setModal] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const { crypto } = useCrypto();

    useEffect(() => {
        const keypress = (event: KeyboardEvent) => {
            if (event.key === '/') {
                setSelect((prev) => !prev);
            }
        }
        document.addEventListener('keypress', keypress);
        return () => document.removeEventListener('keypress', keypress);
    }, [])

    function handleSelect(value: string) {
        setCoin(crypto.find((c: Coin) => c.id === value) || null);
        setSelect(false);
        setModal(true);
    }


    return (
        <Layout.Header style={headerStyle}>
            <Select
                style={{ width: '100%', maxWidth: 250, marginRight: '10px' }}
                open={select}
                onSelect={handleSelect}
                onClick={() => setSelect((prev) => !prev)}
                value='press / to open'
                options={crypto.map((coin: Coin) => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                <Space>
                   <img 
                        style={{width: 20}} 
                        src={option.data.icon} 
                        alt={option.data.label as string}
                    /> {' '}
                    {option.data.label}
                </Space>
                )}
            />

            <Button type="primary" onClick={() => setDrawer(true)}>Add Asset</Button>

            <Modal
                open={modal}
                onCancel={() => setModal(false)}
                footer={null}
            >
                {coin && <CoinInfoModal coin={coin}/>}
            </Modal>

            <Drawer
                width={600}
                title="Add Asset"
                onClose={() => setDrawer(false)}
                open={drawer}
                destroyOnClose
            >
                <AddAssetForm onClose={() => setDrawer(false)}/>
            </Drawer>
            
        </Layout.Header>
    )
}