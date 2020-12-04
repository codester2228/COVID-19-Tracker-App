import { FormControl, MenuItem, Select,Card,CardContent } from "@material-ui/core";
import "./App.css";
import React, { useEffect, useState } from "react";
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import LineGraph from "./LineGraph.js";
import {sortData} from "./util.js";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sorteddata= sortData(data);
          setTableData(sorteddata);
          setCountries(countries);
        });
    };
    
    getCountriesData();
  }, []);

  useEffect(() => {
    
       fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        });
    
    

  }, []);


   

  const onCountryChange =async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode==="Worldwide"?"https://disease.sh/v3/covid-19/all"
    :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response =>response.json())
    .then(data => {
         setCountryInfo(data);
    })

  };

  return (
    <div className="App">
      <div className="app__left">

        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Map />
      </div>

      <Card className="app__right">
       <CardContent>
       <h2>Live Cases by Country</h2>
       <Table countries={tableData}></Table>
       <h2>Worldwide Cases</h2>
       <LineGraph/>
       </CardContent>
    </Card>

    </div>
      
  );
}

export default App;
