import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Breadcrumb } from "antd";
import modules from "../utility/modules";

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    if (currentRoute === undefined) {
      const currLocArr = currentLocation.split("/");
      if (currLocArr.length === 2) return currLocArr[1].charAt(0).toUpperCase() + currLocArr[1].slice(1);
      return `${currLocArr[2].charAt(0).toUpperCase() + currLocArr[2].slice(1)} ${currLocArr[1]
        .charAt(0)
        .toUpperCase()}${currLocArr[1].slice(1)}`;
    }
    return currentRoute?.name;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location.split("/").reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      breadcrumbs.push({
        pathname: currentPathname,
        name: getRouteName(currentPathname, modules),
        active: index + 1 === array.length,
      });
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  const items = () => {
    const initial = [];

    if (breadcrumbs[0].pathname !== "/home") initial.push({ title: <Link to="/home">Home</Link> });
    const others = breadcrumbs
      .map((breadcrumb, i) => {
        const object = {
          title: breadcrumb.active ? (
            breadcrumb.name
          ) : (
            <Link to={breadcrumb.pathname} key={`${breadcrumb.name}_${breadcrumb.pathname}_crumb`}>
              {breadcrumb.name}
            </Link>
          ),
        };
        return breadcrumb.pathname.includes("edit") && i === 1 ? false : object;
      })
      .filter((x) => x);
    return [...initial, ...others];
  };

  return <Breadcrumb items={items()} separator=">" />;
};

export default React.memo(AppBreadcrumb);
