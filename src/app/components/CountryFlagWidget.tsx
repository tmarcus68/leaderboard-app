import React from "react";

const CountryFlagWidget = ({ countryCode }: { countryCode: string }) => {
  return <span className={`fi fi-${countryCode.toLowerCase()} fis`} />;
};

export default CountryFlagWidget;
