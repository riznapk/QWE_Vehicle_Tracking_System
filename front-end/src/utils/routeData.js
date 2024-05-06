export const vehicleStatusList = [
  {
    value: "out-of-depot",
    label: "Out of Depot",
  },
  {
    value: "on-the-route",
    label: "On the Route",
  },
  {
    value: "out-of-service",
    label: "Out of Service",
  },
  {
    value: "on-destination",
    label: "On Destination",
  },
  {
    value: "available",
    label: "Available",
  },
];

export const formatDataVehicleStatus = (val) => {
  if (val == "out-of-depot") return "Out of Depot";
  else if (val == "on-the-route") return "On the Route";
  else if (val == "out-of-service") return "Out of Service";
  else if (val == "on-destination") return "On Destination";
  else if (val == "available") return "Available";
  else return "";
};
