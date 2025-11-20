import Browse from './pages/Browse';
import APIDetail from './pages/APIDetail';
import MyAPIs from './pages/MyAPIs';
import MyKeys from './pages/MyKeys';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Layout from './Layout';

export const PAGES = {
    "Browse": Browse,
    "APIDetail": APIDetail,
    "MyAPIs": MyAPIs,
    "MyKeys": MyKeys,
    "Analytics": Analytics,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Browse",
    Pages: PAGES,
    Layout: Layout,
};

