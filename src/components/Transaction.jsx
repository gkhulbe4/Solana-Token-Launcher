import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

function Transaction({ tx }) {
  return (
    <div className="flex flex-col gap-2 border border-gray-600 justify-between  p-4 rounded-sm">
      <div className="flex md:flex-row flex-col gap-3 w-full">
        <div className="flex flex-col justify-between w-full">
          <p className="text-sm font-semibold text-white">{tx.time}</p>
          <p className="text-gray-400 text-xs font-light wrap-break-word mt-1">
            {tx.signature}
          </p>
        </div>
        <Badge className="bg-[#09552d] h-max">Success</Badge>
      </div>
      <Link
        to={tx.explorerUrl}
        target="_blank"
        className="text-indigo-500 text-sm"
      >
        View on Explorer
      </Link>
    </div>
  );
}

export default Transaction;
