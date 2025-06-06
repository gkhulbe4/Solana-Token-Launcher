import React from "react";

function Token({ myTokens }) {
  // console.log(myTokens);
  return (
    <div className="flex flex-col gap-3">
      {myTokens.map((token) => {
        return (
          <div className="border border-gray-600 flex justify-between items-center p-4 rounded-sm">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-white">Token Mint</p>
              <p className="text-gray-400 text-xs font-light">{token.mint}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Balance</p>
              <p className="text-gray-400 text-xs font-light">
                {token.amount * 10 ** -token.decimals}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Token;
