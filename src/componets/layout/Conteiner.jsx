
import NavBar from "../navbar/NavBar";
import NavItem from "../navbar/NavItem";
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

function Conteiner({ children }) {
    const { logout } = useAuth();

    return (
        <>
            <header className="bg-gradient-custom h-[110px] w-full min-w-[375px] flex justify-center">
                <div className="min-w-[375px] max-w-[1800px] flex-col">
                    <nav className="flex justify-between items-center">
                        <Link to="/editais">
                            <h1 className='p-[10px] font-bold text-5xl cursor-pointer text-gray-300'>SGM</h1>
                        </Link>
                        <div onClick={logout} className="cursor-pointer">
                            <NavItem Icon={FiLogOut} />
                        </div>
                    </nav>
                    <NavBar />
                </div>
            </header>
            <main>{children}</main>
        </>
    )
}

export default Conteiner;