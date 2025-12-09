import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

interface Props {
  title: string;
  description: string;
  ctaText?: string;
  ctaURL?: string;
  icon?: React.ReactNode;
}
const Header = ({ title, description, ctaText , ctaURL, icon }: Props) => {

  {/* Track location for dynamic styling Header using useLocation hook */}
  const location = useLocation()

  return (
    <header className="flex flex-col justify-between md:flex-row ">
      <article>
        <h1 className={ cn("text-gray-900 text-2xl font-bold mb-2", location.pathname === '/' ? 'text-2xl md:text-4xl font-bold' : 'text-xl md:text-2xl font-semibold' )}>{title}</h1>
        <p className={ cn("text-gray-600 mb-4" , location.pathname === '/' ? 'text-lg md:text-xl' : 'text-sm md:text-base' ) }>{description}</p>
      </article> 

      {ctaText && ctaURL && icon && (
        <Link to={ctaURL}>
          <button className="bg-blue-500 w-full md:w-60 text-white p-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-none">{icon}{ctaText}</button>
        </Link>
      )}


    </header>
  );
};

export default Header;
