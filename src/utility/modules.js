import _ from "lodash";
import React, { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));

const CreateModule = lazy(() => import("../pages/Modules/Create"));
const ViewModules = lazy(() => import("../pages/Modules/View"));
const UpdateModule = lazy(() => import("../pages/Modules/Update"));

const CreateRole = lazy(() => import("../pages/Roles/Create"));
const ViewRoles = lazy(() => import("../pages/Roles/View"));
const UpdateRole = lazy(() => import("../pages/Roles/Update"));

const CreateAdmin = lazy(() => import("../pages/Admin/Create"));
const ViewAdmins = lazy(() => import("../pages/Admin/View"));
const UpdateAdmin = lazy(() => import("../pages/Admin/Update"));

// PAYOUT
const ViewPayoutGateways = lazy(() => import("../pages/PaymentGateway/Payout/View"));
const UpdatePayoutGateway = lazy(() => import("../pages/PaymentGateway/Payout/Update"));
const CreatePayoutGateway = lazy(() => import("../pages/PaymentGateway/Payout/Create"));

// PAYIN
const ViewPayinGateways = lazy(() => import("../pages/PaymentGateway/Payin/View"));
const UpdatePayinGateway = lazy(() => import("../pages/PaymentGateway/Payin/Update"));
const CreatePayinGateway = lazy(() => import("../pages/PaymentGateway/Payin/Create"));

const WithdrawList = lazy(() => import("../pages/Transaction/Withdraw"));
const DepositList = lazy(() => import("../pages/Transaction/Deposit"));

const CreatePanel = lazy(() => import("../pages/Panel/Create"));
const UpdateDynamicRpa = lazy(() => import("../pages/Rpa/Update"));
const ViewPanel = lazy(() => import("../pages/Panel/View"));
const UpdatePanel = lazy(() => import("../pages/Panel/Update"));

// USER
const UserList = lazy(() => import("../pages/User/View"));
const UserProfile = lazy(() => import("../pages/User/View/UserProfile"));

const getModule = ({ label = "", path = "", children = [], element = null, routeOnly = false }) => {
  const key = path.split("/").join("_").toLowerCase();
  const module = {
    label: _.startCase(label),
    path: path.toLowerCase(),
    key,
    name: key,
  };
  if (element) return { ...module, element, ...(routeOnly && { routeOnly }) }; // router
  return { ...module, children }; // sidemenu
};

const modules = [
  getModule({
    label: "Home",
    path: "home",
    element: <Home />,
  }),
  getModule({
    label: "Profile",
    path: "profile",
    element: <Profile />,
  }),
  getModule({
    label: "Modules",
    path: "modules",
    children: [
      getModule({
        label: "Create Module",
        path: "modules/create",
        element: <CreateModule />,
      }),
      getModule({
        label: "View Modules",
        path: "modules/view",
        element: <ViewModules />,
      }),
    ],
  }),
  getModule({
    label: "Roles",
    path: "roles",
    children: [
      getModule({
        label: "Create Role",
        path: "roles/create",
        element: <CreateRole />,
      }),
      getModule({
        label: "View Roles",
        path: "roles/view",
        element: <ViewRoles />,
      }),
    ],
  }),
  getModule({
    label: "Admin",
    path: "admin",
    children: [
      getModule({
        label: "Create Admin",
        path: "admin/create",
        element: <CreateAdmin />,
      }),
      getModule({
        label: "View Admin Users",
        path: "admin/view",
        element: <ViewAdmins />,
      }),
    ],
  }),
  getModule({
    label: "Transaction",
    path: "transaction",
    children: [
      getModule({
        label: "Withdraw",
        path: "transaction/withdraw",
        element: <WithdrawList />,
      }),
      getModule({
        label: "Deposit",
        path: "transaction/deposit",
        element: <DepositList />,
      }),
      // getModule({
      //   label: "ShowDepositTransactions",
      //   path: "transaction/deposit/showTransaction",
      //   element: <ShowDepositTransactions />,
      // }),
    ],
  }),

  getModule({
    label: "Payment Gateway",
    path: "paymentGateway",
    children: [
      getModule({
        label: "Payout",
        path: "payout",
        children: [
          getModule({
            label: "Create Gateway",
            path: "paymentGateway/payout/create",
            element: <CreatePayoutGateway />,
          }),
          getModule({
            label: "List",
            path: "paymentGateway/payout/view",
            element: <ViewPayoutGateways />,
          }),
        ],
      }),
      getModule({
        label: "Payin",
        path: "payin",
        children: [
          getModule({
            label: "Create Gateway",
            path: "paymentGateway/payin/create",
            element: <CreatePayinGateway />,
          }),
          getModule({
            label: "List",
            path: "paymentGateway/payin/view",
            element: <ViewPayinGateways />,
          }),
        ],
      }),
    ],
  }),
  getModule({
    label: "Panel",
    path: "panels",
    children: [
      getModule({
        label: "Create Panel",
        path: "panel/create",
        element: <CreatePanel />,
      }),
      getModule({
        label: "View Panel",
        path: "panel/view",
        element: <ViewPanel />,
      }),
    ],
  }),

  getModule({
    label: "Rpa",
    path: "rpa",
    children: [
      getModule({
        label: "Update Dynamic Rpa",
        path: "rpa/updateRpa",
        element: <UpdateDynamicRpa />,
      }),
    ],
  }),

  getModule({
    label: "Users",
    path: "users",
    children: [
      getModule({
        label: "List",
        path: "users/list",
        element: <UserList />,
      }),
    ],
  }),
];

// modules that are not visible on side menu
const routesOnly = [
  getModule({
    label: "Update Module",
    path: "modules/update/:type/:moduleid",
    element: <UpdateModule />,
    routeOnly: true,
  }),
  getModule({
    label: "Update Roles",
    path: "roles/update/:roleId",
    element: <UpdateRole />,
    routeOnly: true,
  }),
  getModule({
    label: "Update Admin",
    path: "admin/update/:userid",
    element: <UpdateAdmin />,
    routeOnly: true,
  }),
  getModule({
    label: "Update Payout Gateway",
    path: "paymentGateway/payout/update/:pgid",
    element: <UpdatePayoutGateway />,
    routeOnly: true,
  }),
  getModule({
    label: "Update Payin Gateway",
    path: "paymentGateway/payin/update/:pgid",
    element: <UpdatePayinGateway />,
    routeOnly: true,
  }),
  getModule({
    label: "Update Panel",
    path: "panel/update/:panelid",
    element: <UpdatePanel />,
    routeOnly: true,
  }),
  getModule({
    label: "User Profile",
    path: "users/profile/:customer_id",
    element: <UserProfile />,
    routeOnly: true,
  }),
];

const getModules = (array = []) => array.map((module) => ({ ...module, element: null })).filter((x) => !x.routeOnly);

const getRoutesFromChildren = (children) => {
  if (!children) return false;

  let routes = [];
  let i;
  let currModule;
  let submodules;
  let moduleArr;
  for (i = 0; i < children.length; i += 1) {
    currModule = modules[i];
    submodules = currModule?.children;
    let submodulesArr = [];
    if (submodules?.length) {
      for (let j = 0; j < submodules.length; j += 1) {
        const submodule = submodules[j];
        const submoduleChildren = submodule?.children || [submodule];
        submodulesArr = [...submodulesArr, ...submoduleChildren];
      }
    }
    moduleArr = submodulesArr?.length ? submodulesArr : [currModule];
    routes = [...routes, ...moduleArr];
  }
  return routes;
};

const moduleRoutesArr = getRoutesFromChildren(modules);

export const menuItems = getModules(modules);

const routes = [...moduleRoutesArr, ...routesOnly];

export default routes;
