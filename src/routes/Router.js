import { lazy } from "react";
import { Navigate, Route, Routes, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute.js";
import FullLayout from "../layouts/FullLayout.js";

/****Layouts*****/
const Authenticate = lazy(() => import("../views/ui/Authenticate.js"))

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));
const LandingPage = lazy(() => import("../views/LandingPage"));
const ExploreWindow = lazy(() => import("../views/exploreWindow.js"));
const ExploreLoadWindow = lazy(() => import("../views/exploreLoadMethods.js"));

/*****Routes******/
// const ThemeRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/home" index element={<LandingPage />}></Route>
//       <Route path="/explore" index element={<ExploreWindow />}></Route>
//       <Route path="/exploreMethods" index element={<ExploreLoadWindow />}></Route>
//       <Route path="/auth"  element={<Authenticate />}></Route>
//       {/* <Route path="/" element={<ProtectedRoute><Navigate to="/home" /><FullLayout/></ProtectedRoute>}> */}

//         <Route path="/">  
//         <ProtectedRoute>
//         <Route path="/starter" element={<Starter />} />

//       </ProtectedRoute>
//         <Route path="/about" element={<About />} />
//         <Route path="/alerts" element={<Alerts />} />
//         <Route path="/badges" element={<Badges />} />
//         <Route path="/buttons" element={<Buttons />} />
//         <Route path="/cards" element={<Cards />} />
//         <Route path="/grid" element={<Grid />} />
//         <Route path="/table" element={<Tables />} />
//         <Route path="/forms" element={<Forms />} />
//         <Route path="/breadcrumbs" element={<Breadcrumbs />} />
//       </Route>
//     </Routes>
//   )
// };

// export default ThemeRoutes;


const router = createBrowserRouter([
  {
    path: '/home',
    element: <LandingPage />
  },
  {
    path: '/explore',
    element: <ExploreWindow />
  },
  {
    path: '/exploreMethods',
    element: <ExploreLoadWindow />
  },
  {
    path: '/auth',
    element: <Authenticate />
  },
  {
    path: '/',
    element: <ProtectedRoute><FullLayout /></ProtectedRoute>,
    children: [
      {
        path: '/starter',
        element: <Starter />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/alerts',
        element: <Alerts />
      },
      {
        path: '/badges',
        element: <Badges />
      },
      {
        path: '/buttons',
        element: <Buttons />
      },
      {
        path: '/cards',
        element: <Cards />
      },
      {
        path: '/grid',
        element: <Grid />
      },
      {
        path: '/table',
        element: <Tables />
      },
      {
        path: '/forms',
        element: <Forms />
      },
      {
        path: '/breadcrumbs',
        element: <Breadcrumbs />
      }
    ]
  }
])

export default router;