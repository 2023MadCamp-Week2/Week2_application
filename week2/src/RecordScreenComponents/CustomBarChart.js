import React from "react";
import { BarChart } from "react-native-chart-kit";
import { Text, View } from "react-native";

const CustomBarChart = ({ data, ...props }) => {
  const { datasets } = data;
  const labels = data.labels || [];

  return (
    <BarChart
      data={data}
      {...props}
      renderBarValues={({ datasets }) => {
        return datasets.map((dataset, datasetIndex) => {
          return dataset.data.map((value, valueIndex) => {
            const barWidth = dataset.data.length > 1 ? dataset.width / dataset.data.length : dataset.width;

            return (
              <View
                key={`${datasetIndex}-${valueIndex}`}
                style={{
                  position: "absolute",
                  top: dataset.isPercentage ? `${dataset.base}%` : `${dataset.base - value}%`,
                  width: barWidth,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12 }}>{value.toLocaleString()}</Text>
              </View>
            );
          });
        });
      }}
    />
  );
};

export default CustomBarChart;
