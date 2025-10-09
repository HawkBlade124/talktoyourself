import { Link } from "react-router-dom";
function Header(){
      const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);
    return(        
        <>
              <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
            <header>
                <div className="logo">Talk To Yourself</div>
                <div className="userSpace">
                    <Link to="/">Home</Link>
                    <Link to="/about">How It Works</Link>                                        
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/login">Login</Link>
                </div>
            </header>
        </>
    )
}

export default Header