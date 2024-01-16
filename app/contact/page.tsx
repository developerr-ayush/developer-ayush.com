import React from 'react'
import CardList from '../component/card/CardList'
import BasicCard from '../component/card/BasicCard'
import { IoCallOutline } from "react-icons/io5";
import Card from '../component/card/Card'
import { CiMail } from "react-icons/ci";
import { CiLocationArrow1 } from "react-icons/ci";
import Social from '../component/Social';
import Button from '../component/Button';
import Title from '../component/Title';
const page = () => {
    return (
        <>
            <CardList className='grid align-start grid-lg-3'>
                <div className="contact col-lg-1">
                    <h3 className="title">Contact Info</h3>
                    <div className="contact-list">
                        <div className="contact-item">
                            <Card className='contact-icon'>
                                <CiMail size={25} />
                            </Card>
                            <div className="contact-data">
                                <h5 className="contact-sub-title">mail us</h5>
                                <p><a href="/">developerr.ayush@gmail.com</a></p>
                                <p><a href="/">ayush@ayushshah.in</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <Card className='contact-icon'>
                                <IoCallOutline size={25} />
                            </Card>
                            <div className="contact-data">
                                <h5 className="contact-sub-title">contact us</h5>
                                <p><a href="/">+91 00000 00000</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <Card className='contact-icon'>
                                <CiLocationArrow1 size={25} />
                            </Card>
                            <div className="contact-data">
                                <h5 className="contact-sub-title">location</h5>
                                <p><a href="/">Mumbai, Maharashtra</a></p>
                            </div>
                        </div>
                    </div>
                    <h3 className="title">Social info</h3>
                    <div className="contact-social-list">
                        <Social />
                    </div>
                </div>
                <div className='contact-form col-lg-2'>
                    <CardList>
                        <Title>Lets Work <span className="highlight">Together</span></Title>
                        <Card>
                            <form action="#">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder='' name='name' id="name" />
                                    <label className="form-label" htmlFor="name">Name</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder='' name='email' id="email" />
                                    <label className="form-label" htmlFor="email">Email</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder='' name='subject' id="subject" />
                                    <label className="form-label" htmlFor="subject">Subject</label>
                                </div>
                                <div className="form-group">
                                    <textarea className="form-control" placeholder='' name='message' id="message"></textarea>
                                    <label className="form-label" htmlFor="message">Message</label>
                                </div>
                                <div className="form-group">
                                    <Button label="submit">Submit</Button>
                                </div>
                            </form>
                        </Card>
                    </CardList>

                </div >
            </CardList >
        </>
    )
}

export default page