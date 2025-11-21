import { useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

interface Props {
  title: string;
  description: string;
}
const Header = ({ title, description }: Props) => {

  {/* Track location for dynamic styling Header using useLocation hook */}
  const location = useLocation()

  return (
    <header>
      <article>
        <h1 className={ cn("text-gray-900 text-2xl font-bold mb-2", location.pathname === '/' ? 'text-2xl md:text-4xl font-bold' : 'text-xl md:text-2xl font-semibold' )}>{title}</h1>
        <p className={ cn("text-gray-600 mb-4" , location.pathname === '/' ? 'text-lg md:text-xl' : 'text-sm md:text-base' ) }>{description}</p>
      </article> 

    </header>
  );
};

export default Header;
