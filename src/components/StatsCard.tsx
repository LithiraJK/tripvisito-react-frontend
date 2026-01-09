import { calculateTrendPercentage, cn } from "../lib/utils";
import TrendChart from "./TrendChart";

export interface StatsCardProps {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
  chartData?: number[];
}

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
  chartData,
}: StatsCardProps) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  const isDecrement = trend === "decrement";
  const isIncrement = trend === "increment";
  const mappedTrend = trend === "no change" ? "neutral" : trend;

  return (
    <article className="p-6 flex flex-col gap-5 bg-white shadow-[400px] rounded-[20px] text-black">
      <h3 className="text-base font-medium">{headerTitle}</h3>

      <div className="flex flex-row md:flex-col-reverse xl:flex-row xl:items-center gap-3 justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-semibold">{total}</h2>
          <div className="flex item-center gap-2">
            <figure className="flex items-center gap-1">
              <img
                src={`src/assets/icons/${
                  isDecrement
                    ? "arrow-down-red.svg"
                    : isIncrement
                    ? "arrow-up-green.svg"
                    : "arrow-right-gray.svg"
                }`}
                className="size-5"
                alt="arrow"
              />
              <figcaption
                className={cn(
                  "text-sm font-medium",
                  isDecrement
                    ? "text-red-500"
                    : isIncrement
                    ? "text-green-500"
                    : "text-gray-500"
                )}
              >
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className="text-sm font-medium text-gray-500 truncate">
              vs last month
            </p>
          </div>
        </div>
        <TrendChart trend={mappedTrend} data={chartData} />
      </div>
    </article>
  );
};

export default StatsCard;
