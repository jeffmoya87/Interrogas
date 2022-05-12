import React, { Suspense, useState, useEffect, useCallback } from 'react';
import logger from 'sabio-debug';
import { Routes, Route, useLocation } from 'react-router-dom';
import DefaultLayout from './layouts/Default';
import HorizontalLayout from './layouts/horizontal/index.js';
import { authProtectedFlattenRoutes, publicProtectedFlattenRoutes } from './routes';
import PublicPageLayout from './layouts/publicpagelayout/PublicPageLayout';
import * as userServices from './services/usersService';

const loading = () => <div className="">loading....</div>;
const _logger = logger.extend('App');
_logger('publicProtectedFlattenRoutes', publicProtectedFlattenRoutes);
_logger('authProtectedFlattenRoutes', authProtectedFlattenRoutes);

export default function App(props) {
    const { pathname, state } = useLocation();
    const [currentUser, setCurrentUser] = useState({
        id: 0,
        roles: [],
        email: '',
        isLoggedIn: false,
        isChecked: false,
    });

    useEffect(() => {
        if (state && state.type === 'LOGIN') {
            setCurrentUser(state.payload);
        } else {
            onGetCurrentUser();
        }
    }, [state]);

    const onGetCurrentUser = () => {
        userServices.getCurrent().then(onGetUserSuccess).catch(onGetUserFail);
    };

    const onGetUserSuccess = (response) => {
        const loggedInUser = response.data.item;
        setCurrentUser((prevState) => {
            const newUser = { ...prevState };
            newUser.id = loggedInUser.id;
            newUser.email = loggedInUser.name;
            newUser.roles = loggedInUser.roles;
            newUser.isLoggedIn = true;
            return newUser;
        });
    };

    const [currentPath, setCurrentPath] = useState({
        isPublic: false,
        isSecured: false,
        isUnknown: false,
        isSimple: false,
    });

    const getRouteMapper = useCallback(
        (user) => (routeData) =>
            (
                <Route
                    path={routeData.path}
                    exact={routeData.exact}
                    name={routeData.name}
                    isSimple={routeData.isSimple}
                    element={<routeData.element currentUser={user} />}
                />
            ),
        []
    );

    const getMappedRoutes = useCallback(
        (arrOfRouteData, user) => {
            let theseRoutes = arrOfRouteData.map(getRouteMapper(user));
            if (theseRoutes) _logger('getMappedRoutes.', theseRoutes);
            return theseRoutes;
        },
        [getRouteMapper]
    );

    const currentPathCheck = (pp) => {
        let ppPath = pp.path.split('/').filter((el) => el !== '');
        let pathNameCheck = pathname.split('/').filter((el) => el !== '');
        let result = false;
        // _logger('ppPath: ', ppPath, 'pathNameCheck: ', pathNameCheck);
        if (ppPath.length === pathNameCheck.length) {
            if (pathNameCheck.length === 0) {
                result = true;
            } else {
                for (let a = 0; a < pathNameCheck.length; a++) {
                    if (pathNameCheck[a] !== ppPath[a]) {
                        if (ppPath[a].startsWith(':') && pathNameCheck[a].match(/^[0-9]+$/)) {
                            result = true;
                        } else {
                            return false;
                        }
                    } else {
                        result = true;
                    }
                }
            }
        }
        return result;
    };

    // ensure that currentPath.path is set to true, but only if it is false AND it should be true
    useEffect(() => {
        if (publicProtectedFlattenRoutes.some((pp) => currentPathCheck(pp))) {
            if (!currentPath.isPublic) {
                setCurrentPath(() => {
                    const [currentRouteData] = publicProtectedFlattenRoutes.filter((route) => route.path === pathname);
                    const isSimplePage = currentRouteData.isSimple ? currentRouteData.isSimple : false;
                    _logger('route data', currentRouteData);
                    return { isSecured: false, isPublic: true, isSimple: isSimplePage };
                });
            }
        } else if (authProtectedFlattenRoutes.some((pp) => currentPathCheck(pp))) {
            if (!currentPath.isSecured) {
                setCurrentPath(() => {
                    return { isPublic: false, isSecured: true };
                });
            }
        } else if (!currentPath.isUnknown) {
            setCurrentPath(() => {
                return { isUnknown: true };
            });
        }
    }, [pathname, currentPath]);

    const generateDynamicRoutes = (currentUser) => {
        _logger('generateDynamicRoutes', authProtectedFlattenRoutes);
        let routes = authProtectedFlattenRoutes.filter((route) => {
            if (route.roles?.length === 0) {
                return true; //all any loggedIn user to see routes that have empty roles
            }
            return route.roles?.some((role) => currentUser.roles.includes(role));
        });
        _logger('generateDynamicRoutes', routes);

        return getMappedRoutes(routes, currentUser);
    };

    const getLast = (arr) => {
        return [arr[arr.length - 1]];
    };

    const onGetUserFail = (err) => {
        _logger('getUserFail', err);
    };

    _logger('render', { pathname, currentUser, currentPath: JSON.stringify(currentPath) });
    return (
        <div>
            <Suspense fallback={loading}>
                {/* if the path is public we do not care about the current User  */}
                {currentPath.isPublic && !currentPath.isSimple && (
                    <PublicPageLayout {...props} cUser={currentUser} reSetUser={setCurrentUser}>
                        <Routes>{getMappedRoutes(publicProtectedFlattenRoutes, currentUser)}</Routes>
                    </PublicPageLayout>
                )}

                {currentPath.isPublic && currentPath.isSimple && (
                    <DefaultLayout {...props}>
                        <Routes>{getMappedRoutes(publicProtectedFlattenRoutes, currentUser)}</Routes>
                    </DefaultLayout>
                )}
                {/* if the user is logged in and attempting to go to an KNOWN page, that is is also secure/not public  */}
                {currentUser.isLoggedIn && !currentPath.isPublic && !currentPath.isUnknown && (
                    <HorizontalLayout {...props}>
                        <Routes>{generateDynamicRoutes(currentUser)}</Routes>
                    </HorizontalLayout>
                )}

                {/* we do not know this url , and so the user status does not matter */}
                {currentPath.isUnknown && (
                    <DefaultLayout {...props}>
                        <Routes>{getMappedRoutes(getLast(publicProtectedFlattenRoutes), currentUser)}</Routes>
                    </DefaultLayout>
                )}
            </Suspense>
        </div>
    );
}
