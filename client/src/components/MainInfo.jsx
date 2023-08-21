import '../App.css'

const MainInfo = ({ text }) => {
  const formattedText = text ? text.split("Floor Area") : "";

  let addressReg = /(?<=Property Report - )(.*)(?= Report Generated)/gm;
  let areaReg = /(?<=Living Area:) \d{2,7}ft./gm;
  let floorReg = /\d{1,2}.(?=Floors)/gm;
  let bedroomsReg = /\d{1,2}.(?=Bedrooms)/gm;
  let bathesReg = /(?<=Bedrooms)(.*)(?=Bathroom)/gm;

  if (formattedText) {
    const address = formattedText[0].match(addressReg);
    const area = formattedText[0].match(areaReg);
    const floors = formattedText[0].match(floorReg);
    const bedrooms = formattedText[0].match(bedroomsReg);
    const bathes = formattedText[0].match(bathesReg);
    const link = `https://www.zillow.com/homes/for_sale/${address}_rb/?fromHomePage=true&shouldFireSellPageImplicitClaimGA=false&fromHomePageTab=buy`

    return (
      <div>
        <ul
          className="mainInfoList"
          style={{
            listStyleType: "none",
          }}
        >
          <li>
            <b>Address:</b> <a href={link} target='_blank'>{address}</a>
          </li>
          <li>
            <b>Area:</b> {area}
          </li>
          <li>
            <b>Floors:</b> {floors || 1}
          </li>
          <li>
            <b>Bedrooms:</b> {bedrooms}
          </li>
          <li>
            <b>Bathrooms:</b> {bathes}
          </li>
        </ul>
      </div>
    );
  }
  return <div></div>;
};

export default MainInfo;
