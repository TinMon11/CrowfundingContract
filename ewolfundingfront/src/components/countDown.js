import React, { useEffect, useState } from 'react'
import { useCountdown } from '../hooks/useCountdown';


export const Countdown = (props) => {

    const [days, hours, minutes, seconds] = useCountdown(props.LaunchDate);

    return (
        <div className="flex gap-5 mt-4 mb-8 justify-center">
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": days }}></span>
                </span>
                days
            </div>
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": hours }}></span>
                </span>
                hours
            </div>
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": minutes }}></span>
                </span>
                min
            </div>
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": seconds }}></span>
                </span>
                sec
            </div>
        </div>
    )
}
