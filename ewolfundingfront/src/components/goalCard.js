import React, { useContext } from 'react'
import AmazonasImage from "../assets/amazonas.jpg"
import AppContext from '../context'



export const GoalCard = (props) => {

    const { ...data } = useContext(AppContext)

    return (
        <div>
            <div className="flex flex-col lg:flex-row flex-wrap	">
                <div>
                    <img className="mask mask-heart max-h-48" src={AmazonasImage} />
                </div>
                <div className="flex flex-col stats bg-primary text-primary-content">
                    <div className="stat text-center">
                        <div className="stat-title">Objective</div>
                        <div className="stat-value">ATK {props.Objective}</div>

                    </div>
                    <div className="stat text-center">
                        <div className="stat-title">Total Pledged</div>
                        <div className="stat-value">ATK {props.ActualPledged}</div>
                        <div className="stat-actions m-auto mt-4">
                            <button className="btn btn-md btn-success mx-2">PLEDGE</button>
                            <button className="btn btn-md btn-error mx-2">ASK REFUND</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
