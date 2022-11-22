import React, { useState } from 'react'
import LogoImage from "../assets/crowLogo.png";
import { ethers } from "ethers";


export const Navbar = () => {

    const [loginMetaMask, setloginMetaMask] = useState(false)
    const [user, setUser] = useState()

    const onHandleConnect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        setUser(signerAddress.substring(0, 4) + "..." + signerAddress.substring(36))
        setloginMetaMask(!loginMetaMask)
    }

    return (
        <div className="navbar bg-neutral	mt-1.5 shadow-xl rounded-lg	shadow-gray-300	">
            <div className="flex-1">"
                <img src={LogoImage} className="max-h-20" alt=""></img>
            </div>
            <div className="flex-none">
                {loginMetaMask ?
                    <p className='mr-4 text-white	 '>{user}</p>
                    :
                    <button onClick={onHandleConnect} className='btn btn-primary mr-8'>
                        {loginMetaMask ? "Connected" : "Connect Metamask"}
                    </button>
                }


            </div>
        </div>
    )
}
