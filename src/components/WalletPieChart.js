import { PieChart } from 'react-minimal-pie-chart';

function WalletPieChart(){
    const data = [
        { title: 'BTC', value: 65, color: 'rgba(21, 230, 146, 1)' },
        { title: 'ETH', value: 25, color: 'rgba(230, 21, 146, 1)' },
        { title: 'SOL', value: 9, color: 'rgba(21, 146, 230, 1)' },
        { title: 'Others', value: 1, color: 'rgba(146, 146, 230, 1)' },
      ]
    return (
        <PieChart 
            data={data} 
            style={{ height: '7em' }} 
            lineWidth={15} 
            label={({ dataEntry }) => dataEntry.title}
            labelStyle={(index) => ({
                fill: data[index].color,
                fontSize: '10px',
                fontFamily: 'sans-serif',
            })}
            labelPosition={60}
        />
    )
}

export default WalletPieChart;