import Marquee from '../Marquee';
import BasicCard from './BasicCard';
import ServiceList from '../ServiceList';


const CardService = () => {
    return (
        <BasicCard content={{
            subTitle: "Specilization",
            title: "Service Offering"
        }} redirect='/services' className="card-service col-2">
            <Marquee>
                <ServiceList />
            </Marquee>
        </BasicCard>
    )
}

export default CardService