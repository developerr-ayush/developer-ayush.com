import React from 'react'
import Image from 'next/image'
import login from "@/assets/img/gfonts.png"
import Card from '../component/card/Card'
import Button from '../component/Button'
import { FormControl } from '../component/FormControl'
const page = () => {
    return (
        <Card className="login-wrapper">
            <div className="login-visual">
                <Image src={login} alt="login-visual" width={500} height={500} />
            </div>
            <div className="login-content">
                <form action="/">
                    <FormControl type="email" id="email" name="email" label="Email" />
                    <FormControl type="password" id="password" name="password" label="Password" />
                    <div className="form-group">
                        <Button label="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </Card>
    )
}

export default page