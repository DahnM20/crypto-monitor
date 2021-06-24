import { useState, useEffect } from 'react'
import '../styles/DailyPerf.css'

function DailyPerf({wallet}){

    const [perf, updatePerf] = useState(0);

    function computePerf(w){
        let perfTemp = w.reduce((acc, asset) => {
            let value = parseFloat(asset.dailyBenef);
            if(!isNaN(value)){
                acc += parseFloat(asset.dailyBenef);
            } 
            return acc;
        }, 0).toFixed(2); 

        updatePerf(perfTemp)
    }

    useEffect(() => {
        computePerf(wallet)
    }, [wallet])

    return (
       <div className='perfText' > Perfomance Daily : <span className={perf < 0 ? 'loss' : 'gain' }> { perf } </span> $ </div>
    )
}

export default DailyPerf;