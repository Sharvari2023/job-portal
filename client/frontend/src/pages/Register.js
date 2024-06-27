import React from 'react'

const Register = () => {
    return (
        <div className='h-full flex justify-center mt-5 gap-0'>
            <div className='border-1 border-sky-500 flex  w-3/5 rounded-xl ' >
                <div className=' h-14 bg-gradient-to-r from-cyan-500 to-blue-500 w-1/2 h-full rounded-xl flex flex-col justify-evenly '>

                    <h1 className='text-6xl ... font-medium ...  subpixel-antialiased ... font-mono ... text-sky-200 text-center mt-10'>Work<span className='text-6xl text-yellow-400'>Bazaar</span></h1>
                    <img src='/assets/logo.png' alt='logo' />
                    <p className='text-xl ... font-medium ...  subpixel-antialiased ... font-mono ... text-slate-300 text-center mb-18 italic'>
                        Connecting Talent with Opportunity
                    </p>

                </div>
                <div className='p-8 pl-36'>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">First Name</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Last Name</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                        </div>
                        <div className='flex pb-2'>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Candidate
                                </label>

                            </div>
                            <div className="form-check ml-5">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Employer
                                </label>

                            </div>

                        </div>



                        <button type="submit" className="btn btn-primary ml-14 mt-3">Submit</button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Register
