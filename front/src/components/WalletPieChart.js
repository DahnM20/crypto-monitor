import { PieChart } from 'react-minimal-pie-chart';
import { useState, useEffect } from 'react';
import { compareAsset } from './utils.js';

function WalletPieChart({wallet}){

    const [data, updateData] = useState([])
    const colors = [ 
        'rgba(21, 230, 146, 1)', 'rgba(230, 21, 146, 1)', 'rgba(21, 146, 230, 1)', 'rgba(146, 146, 230, 1)'
    ]

    function computeData(){
        let data_temp = []
        let cpt = 0
        let totalValue = wallet.reduce((acc, asset) => acc + asset.currentValue, 0);
        let percentageAdded = 0

        for (let asset of wallet.sort(compareAsset)){
            if(cpt == 3) break;
            let currentPercentage = (asset.currentValue/totalValue)*100
            data_temp.push({title: asset.id, value: currentPercentage,  color: colors[cpt]})
            percentageAdded += currentPercentage
            cpt++
        }

        data_temp.push({title: 'Others', value: 100 - percentageAdded, color: 'rgba(146, 146, 230, 1)'})
        return data_temp;

    }

    useEffect(() => {
        updateData(computeData())
        console.log(data);
    }, [])

    useEffect(() => {
        updateData(computeData())
    }, [wallet])

    return (
        <PieChart 
            data={data} 
            style={{ height: '7em' }} 
            lineWidth={15} 
            label={({ dataEntry }) => dataEntry.title}
            labelStyle={(index) => ({
                fill: data[index].color,
                fontSize: '8px',
                fontFamily: 'sans-serif',
            })}
            labelPosition={75}
        />
    )
}

export default WalletPieChart;