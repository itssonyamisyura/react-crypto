import { useState, useRef } from "react"
import { Select, Space, Divider, Form, Button, InputNumber, DatePicker, Result} from 'antd';
import { useCrypto } from '../context/crypto-context';
import CoinInfo from './CoinInfo';
import { Coin, Asset } from '../types';


export default function AddAssetForm({ onClose }: { onClose: () => void }) {
    const [form] = Form.useForm();
    const { crypto, addAsset } = useCrypto();
    const [coin, setCoin] = useState<Coin | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const assetRef = useRef<Asset>();


    const validateMessages = {
        required: '${label} is required!',
        types: {
            number: '${label} is not a valid number',
        },
        number: {
            range: '${label} has to be between ${min} and ${max}',
        }
    };


    if (submitted && assetRef.current && coin) {
        return (
            <Result
                status="success"
                title="New Asset Added"
                subTitle={`Added ${assetRef.current.amount} of ${coin.name} at price $${assetRef.current.price}`}
                extra={[
                    <Button type="primary" key="close" onClick={onClose}>
                        Close
                    </Button>,
                ]}
            /> 
        )
    }


    if (!coin) {
        return (
            <Select
                style={{ width: '100%' }}
                onSelect={(v: string) => setCoin(crypto.find((c: Coin) => c.id === v) || null)}
                placeholder='Select a coin'
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
        )
    }

    function onFinish(values: { amount: number; price: number; date?: any }) {
        const newAsset: Asset = {
            id: coin!.id,
            amount: values.amount,
            price: values.price,
            date: values.date?.$d ?? new Date(),
        }
        assetRef.current = newAsset;
        setSubmitted(true);
        addAsset(newAsset);
    }

    function handleAmountChange(value: number | null) {
        const price = form.getFieldValue('price');
        if (value !== null && price !== undefined) {
            form.setFieldsValue({
                total: +(value * price).toFixed(2),
            })
        }
    }

    function handlePriceChange(value: number | null) {
        const amount = form.getFieldValue('amount');
        if (value !== null && amount !== undefined) {
            form.setFieldsValue({
                total: +(amount * value).toFixed(2),
            })
        }
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ xs: 24, sm: 8 }}
            wrapperCol={{ xs: 24, sm: 16 }}
            style={{ maxWidth: 600, width: '100%' }}
            initialValues={{
                price: +coin.price.toFixed(2),
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >

        <CoinInfo coin={coin}/>
        <Divider/>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ 
                    required: true, 
                    type: 'number',
                    min: 0,
                },
            ]}
            >
                <InputNumber 
                    placeholder="Enter coin amount" 
                    onChange={handleAmountChange} 
                    style={{width: '100%'}}
                />
            </Form.Item>

            <Form.Item label="Price" name="price">
                <InputNumber 
                    onChange={handlePriceChange} 
                    style={{width: '100%'}}
                />
            </Form.Item>

            <Form.Item label="Date & Time" name="date">
                <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Total" name="total">
                <InputNumber disabled style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item>
            <Button type="primary" htmlType="submit">
                    Add Asset
            </Button>
        </Form.Item>
    </Form>
    )
}