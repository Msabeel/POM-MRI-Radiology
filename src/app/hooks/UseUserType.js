import React from "react";

export default function UseUserType() {
  const [userType, setUserType] = React.useState(localStorage.getItem('USER_TYPE'));
  return [userType, setUserType];
}