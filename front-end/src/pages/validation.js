import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  routeName: Yup.string().required("Required"),
  vehicleID: Yup.string().required("Required"),
  securityTeamName: Yup.string().required("Required"),
});
