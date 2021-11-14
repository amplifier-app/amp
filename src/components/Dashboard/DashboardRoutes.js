import React from "react";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import { Route, Switch } from "react-router-dom";
import Events from "./Events/Events";

export default function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/dashboard" component={Events} />
      </Switch>
    </DashboardLayout>
  );
}
