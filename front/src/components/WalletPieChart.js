import { PieChart } from 'react-minimal-pie-chart';
import { useState, useEffect } from 'react';
import { compareAsset } from './utils.js';

function WalletPieChart({wallet}){

    const [data, updateData] = useState([])
    const colors = [ 
        'rgba(21, 230, 146, 1)', // Vert brillant
        'rgba(230, 21, 146, 1)', // Rose brillant
        'rgba(21, 146, 230, 1)', // Bleu brillant
        'rgba(230, 230, 21, 1)', // Jaune brillant
        'rgba(230, 121, 21, 1)', // Orange brillant
        'rgba(21, 230, 221, 1)', // Cyan brillant
        'rgba(230, 90, 21, 1)', // Orange-rouge brillant
        'rgba(181, 21, 230, 1)', // Pourpre brillant
        'rgba(21, 230, 91, 1)' // Vert clair brillant
    ]

    const colorForOtherSection = 'rgba(146, 146, 230, 1)' // Violet brillant'

    const maxVisibleAssets = 5;

    function computeData(){
        let data_temp = []
        let cpt = 0
        let totalValue = wallet.reduce((acc, asset) => acc + asset.currentValue, 0);
        let percentageAdded = 0

        for (let asset of wallet.sort(compareAsset)){
            if(cpt === maxVisibleAssets) break;
            let currentPercentage = (asset.currentValue/totalValue)*100
            data_temp.push({title: asset.id, value: currentPercentage,  color: colors[cpt]})
            percentageAdded += currentPercentage
            cpt++
        }

        if(wallet.length > maxVisibleAssets){
            data_temp.push({title: 'Others', value: 100 - percentageAdded, color: colorForOtherSection})
        }
        return data_temp;

    }

    useEffect(() => {
        updateData(computeData())
    }, [])

    useEffect(() => {
        updateData(computeData())
    }, [wallet])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <PieChart 
            data={data} 
            style={{ height: '7.5em', marginLeft: '3em', flex: '80%' }} 
            lineWidth={15}
        />
        <LabelList data={data} />
        </div>
    )
}

function LabelList({data}) {
    return (
        <div style={{ textAlign: 'left', flex: '20%', padding: '1em' }}>
            <ul style={{ marginLeft: 0, padding:0 }}>
                {data.map((item, index) => (
                    <li key={index}>
                        <span style={{color: item.color, marginRight: '5px'}}>•</span>
                        <span style={{color: item.color}}>{item.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WalletPieChart;