import React, { CSSProperties } from 'react'
import { serviceData } from '@/data/data';

const ServiceList = () => {
    return (
        <>
            {serviceData.map((e, i) => {
                return (
                    <div key={i} title={e.title} style={{ "--brand-color": e.color } as CSSProperties} className="card-icon">
                        <div title={e.title}>
                            <e.svg size={40} />
                        </div>
                    </div>
                );
            })}
        </>
    )
}

export default ServiceList