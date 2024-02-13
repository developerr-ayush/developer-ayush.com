"use client"
import React, { useState, useTransition } from 'react'
import { FormControl } from '../FormControl'
import Button from '../Button';
import Title from '../Title';
import { LoginSchema } from '@/schema';
import { login } from '@/actions/login';
let defaultValues = {
    email: '',
    password: ''
}
const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(defaultValues)
    const [error, setError] = useState(defaultValues)
    const handleSubmit = (e: any) => {
        setError(defaultValues)
        e.preventDefault()
        // validating schema from zod
        const result = LoginSchema.safeParse(form);
        if (!result.success) {
            setError(result.error.errors.reduce((acc: any, curr: any) => {
                acc[curr.path[0]] = curr.message;
                return acc;
            }, {}))
        } else {
            startTransition(() => {
                login(form)
            })
        }

    }
    return (
        <div className="login-wrapper">
            <Title >Login</Title>
            <form action="" onSubmit={handleSubmit} className='login-form'>
                <FormControl disable={isPending} label='Email' id='email' value={form.email} name='email' setForm={setForm} error={error.email} />
                <FormControl disable={isPending} label='Password' id='Password' type='password' name='password' value={form.password} setForm={setForm} error={error.password} />
                <Button disable={isPending} label='login' >Login</Button>
            </form>
        </div>
    )
}

export default LoginForm