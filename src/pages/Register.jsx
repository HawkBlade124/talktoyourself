function Register(){
    return(
        <div>
            <form onSubmit={registerUser}>
                <input type="text" onChange={e => setName(e.target.value)} placeholder="Name" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={e => setEmail(e.target.value)} placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button type="submit" className="bg-green-500">Submit</button>
            </form>
        </div>
    )
}
export default Register