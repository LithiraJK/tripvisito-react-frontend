import { Link, useLocation } from "react-router-dom";
import Chip from "./Chip";
import { IoLocationOutline } from "react-icons/io5";


export interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string;
}

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();


  const isAdmin = path.pathname.startsWith("/admin");

  const tripLink = isAdmin
    ? `/admin/trip/${id}`
    : `/trip/${id}`;

  return (
    <Link
      to={tripLink}
      className="bg-white rounded-2xl flex-col w-full relative shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-40 rounded-t-xl object-cover aspect-video"
      />
      <article className="flex flex-col gap-3 mt-4 pl-[18px] pr-3.5">
        <h2 className="text-sm md:text-lg font-semibold line-clamp-2">
          {name}
        </h2>
        <figure className="flex items-center gap-2">
          <IoLocationOutline />
          <figcaption className="text-xs md:text-sm font-normal text-gray-600">
            {location}
          </figcaption>
        </figure>
      </article>
      <div className="mt-5 pl-[18px] pr-3.5 pb-5 flex gap-3">
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            variant={
              index === 0
                ? "success"
                : index === 1
                ? "pink"
                : index === 2
                ? "warning"
                : "default"
            }
          />
        ))}
      </div>
      <article className="bg-white py-1 px-2.5 w-fit rounded-2xl absolute top-2.5 right-4 text-dark-100 text-sm font-semibold">
        {price}
      </article>
    </Link>
  );
};

export default TripCard;
