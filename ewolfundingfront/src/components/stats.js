import React, { useContext } from 'react'
import AppContext from '../context'


export const Stats = (props) => {
    const { ...data } = useContext(AppContext)
    return (
        <div className="stats stats-vertical shadow ml-4">

            <div className="stat">
                <div className="stat-title">Token Price</div>
                <div className="stat-value text-base">{props.tokenPrice} ETH</div>
            </div>

            <div className="stat">
                <div className="stat-title">Total Buyers</div>
                <div className="stat-value text-base">{props.totalBuyers}</div>
            </div>

            
            <div className="stat">
                <div className="stat-title">Your Balance</div>
                <div className="stat-value text-base">{props.userBalance} ATK</div>
            </div>

        </div>
    )
}
