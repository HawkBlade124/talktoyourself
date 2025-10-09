function Login(){
    return(
    <>
    <div id="login" className="w-full flex justify-center">
        <div id="loginWrapper" className="justify-center">            
            <form className="flex flex-col w-xs gap-5">                
                <div className="flex items-center bg-white rounded-md h-8">
                    <i className="fa-regular fa-user inputIcons"></i><input type="text" className="rounded-md h-8 pl-5 w-full" name="username" placeholder="Username"/>
                </div>
                <div className="flex items-center bg-white rounded-md h-8">
                <i className="fa-regular fa-lock inputIcons"></i><input type="password" className="rounded-md h-8 pl-5 w-full" name="password" placeholder="Password"/>
                </div>
                <button type="submit" className="bg-blue-500">Login</button>
            </form>
            Don't Have An Account? <div className="">Register For One!</div>
        </div>
    </div>
    </>
    )
}

export default Login