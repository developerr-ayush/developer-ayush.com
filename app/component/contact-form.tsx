"use client"
import React, { useState } from 'react'
import Button from './Button'
import emailjs from "@emailjs/browser";

export const ContactForm = () => {
    let [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [globalMsg, setGlobalMsg] = useState('')
    const handleChange = (e: any) => {
        let { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    let handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setGlobalMsg('')
        if (formData.name === "" || formData.email === "" || formData.subject === "" || formData.message === "") {
            setGlobalMsg('Please fill all the fields')
            return
        }
        if (process.env.EMAILJS_SERVICE_ID === undefined || process.env.EMAILJS_TEMPLATE_ID === undefined || process.env.EMAILJS_PUBLIC_KEY === undefined) {
            setGlobalMsg('Email service not configured')
            return
        }

        emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            formData,
            process.env.EMAILJS_PUBLIC_KEY,
        ).then((result) => {
            setGlobalMsg('Message sent successfully')
        }).catch((error) => {
            setGlobalMsg('Error sending message')
        })


    }
    return (
        <form action="#" onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="text" className="form-control" placeholder='' name='name' id="name" value={formData.name} onChange={handleChange} />
                <label className="form-label" htmlFor="name">Name</label>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder='' name='email' id="email" value={formData.email} onChange={handleChange} />
                <label className="form-label" htmlFor="email">Email</label>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder='' name='subject' id="subject" value={formData.subject} onChange={handleChange} />
                <label className="form-label" htmlFor="subject">Subject</label>
            </div>
            <div className="form-group">
                <textarea className="form-control" placeholder='' name='message' id="message" value={formData.message} onChange={handleChange}></textarea>
                <label className="form-label" htmlFor="message">Message</label>
            </div>
            <div className="form-group">
                <p className="error">{globalMsg}</p>
            </div>
            <div className="form-group">
                <Button label="submit">Submit</Button>
            </div>
        </form>
    )
}
