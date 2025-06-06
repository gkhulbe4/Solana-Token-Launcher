import React from "react";

function TokenAuthorityInfo({ tokenAuthorityInfo }) {
  //   console.log(tokenAuthorityInfo);
  return (
    <div className="mt-3 w-full grid lg:grid-cols-2 sm:grid-cols-1 gap-4 px-4 py-2 rounded bg-[#364151] text-gray-300 placeholder-gray-500 outline-none border border-gray-500">
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-white">Mint Authority</p>
        <p className="text-gray-400 text-xs font-light">
          {tokenAuthorityInfo.mintAuthority}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-white">Freeze Authority</p>
        <p className="text-gray-400 text-xs font-light">
          {tokenAuthorityInfo.freezeAuthority}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-white">Decimals</p>
        <p className="text-gray-400 text-xs font-light">
          {tokenAuthorityInfo.decimals}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-white">Supply</p>
        <p className="text-gray-400 text-xs font-light">
          {tokenAuthorityInfo.supply}
        </p>
      </div>
    </div>
  );
}

export default TokenAuthorityInfo;
