import React, { useEffect } from 'react'
import { createChart } from 'lightweight-charts'
import '../styles/ChartSummary.css'

function ChartSummary(){

    const ref = React.useRef();

    useEffect(() => {
        const chart = createChart(ref.current, { 
            autoWidth: true,
            height: 320,
            autoScale: true,
            layout: {
                backgroundColor: 'transparent',
                textColor: 'rgb(255, 255, 255, 1)',
                fontFamily: 'Inter',
            },
            grid: {
                vertLines: {
                    color: 'rgba(70, 130, 180, 0.5)',
                    style: 1,
                    visible: true,
                },
                horzLines: {
                    color: 'rgba(70, 130, 180, 0.5)',
                    style: 1,
                    visible: true,
                },
            }
        });

        const areaSeries = chart.addAreaSeries({
            topColor: 'rgba(230, 21, 146, 0.4)',
            bottomColor: 'rgba(21, 146, 230, 0)',
            lineColor: 'rgba(21, 230, 146, 1)',
            lineStyle: 0,
            lineWidth: 3,
            crosshairMarkerVisible: false,
            crosshairMarkerRadius: 3,
            crosshairMarkerBorderColor: 'rgb(255, 255, 255, 1)',
            crosshairMarkerBackgroundColor: 'rgb(34, 150, 243, 1)'
        });

        areaSeries.setData([
            { time: '2018-12-22', value: 32.51 },
            { time: '2018-12-23', value: 31.11 },
            { time: '2018-12-24', value: 27.02 },
            { time: '2018-12-25', value: 27.32 },
            { time: '2018-12-26', value: 25.17 },
            { time: '2018-12-27', value: 28.89 },
            { time: '2018-12-28', value: 25.46 },
            { time: '2018-12-29', value: 23.92 },
            { time: '2018-12-30', value: 22.68 },
            { time: '2018-12-31', value: 22.67 },
            { time: '2019-12-30', value: 45.68 },
            { time: '2020-12-31', value: 60.67 }
        ]);

        chart.timeScale().fitContent()
    }, []);


    return (
        <div className={'bg-dark'} > 
            <p className='chartTitle'>Evolution du portefeuille</p>
            <div ref={ref} />
        </div>
    );
}

export default ChartSummary;