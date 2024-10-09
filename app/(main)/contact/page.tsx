import React from 'react'
import CardList from '@/component/card/CardList'
import BasicCard from '@/component/card/BasicCard'
import { IoCallOutline } from "react-icons/io5";
import Card from '@/component/card/Card'
import { CiMail } from "react-icons/ci";
import { CiLocationArrow1 } from "react-icons/ci";
import Social from '@/component/Social';
import Button from '@/component/Button';
import Title from '@/component/Title';
import { ContactForm } from '@/component/contact-form';
import { metadata } from '../layout';

const page = () => {
    metadata.title = "Contact"

    return (
        <>
            <CardList className='grid align-start grid-lg-3'>
                <div className="contact col-lg-1">
                    <h3 className="title" data-aos="fade-right">Contact Info</h3>
                    <div className="contact-list">
                        <div className="contact-item">
                            <Card className='contact-icon'>
                                <CiMail size={25} />
                            </Card>
                            <div className="contact-data" data-aos="fade-left">
                                <h5 className="contact-sub-title">mail us</h5>
                                <p><a href="mailto:developerr.ayush@gmail.com">developerr.ayush@gmail.com</a></p>
                            </div>
                        </div>
                        {/* <div className="contact-item">
                            <Card className='contact-icon'>
                                <IoCallOutline size={25} />
                            </Card>
                            <div className="contact-data" data-aos="fade-left">
                                <h5 className="contact-sub-title">contact us</h5>
                                <p><a href="/">+91 00000 00000</a></p>
                            </div>
                        </div> */}
                        <div className="contact-item">
                            <Card className='contact-icon'>
                                <CiLocationArrow1 size={25} />
                            </Card>
                            <div className="contact-data" data-aos="fade-left">
                                <h5 className="contact-sub-title">location</h5>
                                <p><a href="/">Mumbai, Maharashtra</a></p>
                            </div>
                        </div>
                    </div>
                    <h3 className="title" data-aos="fade-right">Social info</h3>
                    <div className="contact-social-list" data-aos="zoom-in">
                        <Social />
                    </div>
                </div>
                <div className='contact-form col-lg-2'>
                    <CardList>
                        <Title>Lets Work <span className="highlight">Together</span></Title>
                        <Card>
                            <ContactForm />
                        </Card>
                    </CardList>

                </div >
            </CardList >
        </>
    )
}

export default page