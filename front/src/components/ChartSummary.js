import React, { useEffect }  from 'react'
import { createChart } from 'lightweight-charts'
import '../styles/ChartSummary.css'
import { socket } from './socket.js'


function ChartSummary(){

    const ref = React.useRef();
    let current_chart, current_areaSeries; 

    useEffect(() => {
        function buildChart() {

            const chart = createChart(ref.current, { 
                autoWidth: true,
                height: 320,
                autoScale: true,
                timeVisible: true,
                secondsVisible: true,
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

            chart.applyOptions({
                timeScale: {
                    fixLeftEdge: true,
                    lockVisibleTimeRangeOnResize: true,
                    rightBarStaysOnScroll: true,
                    visible: true,
                    timeVisible: true,
                    secondsVisible: false
                },
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
            current_chart = chart
            current_areaSeries = areaSeries
        }


        buildChart();
        
        socket.on("MajValue", data => {
                current_areaSeries.setData(data);
                current_chart.timeScale().fitContent();
        });

        window.addEventListener('resize', () => {
            current_chart.resize(document.querySelector('.chart').offsetHeight, document.querySelector('.chart').offsetWidth)
        })
    

        return () => socket.disconnect();

    }, []);

    /*useEffect(() => {
        function handleResize() {
            console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
            current_chart.resize(100,100)
        }
        window.addEventListener('resize', handleResize)
    })*/

    return (
        <div className='bg-dark' > 
            <p className='chartTitle'>Evolution du portefeuille</p>
            <div ref={ref} className='chart'/>
        </div>
    );
}

export default ChartSummary;