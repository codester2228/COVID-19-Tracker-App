import React, { useState,useEffect } from "react";
import { Line } from "react-chartjs-2";

const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
}


const buildChart = function (data, casesType = "cases") {
  const chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData= async () => {
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChart(data,"cases");
          console.log(chartData);
          setData(chartData);
        });
    };
    

    fetchData();
  }, []);

  return (
    <div>
      <Line
      data={{
          datasets:{
              data:data
          }
      }}
          options={options}
      />
    </div>
  );
}

export default LineGraph;
