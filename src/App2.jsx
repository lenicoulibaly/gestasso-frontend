import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Loader from 'ui-component/Loader';
import Notistack from 'ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';
import { dispatch } from 'store';
import { getMenu } from 'store/slices/menu';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import {QueryClient, QueryClientProvider} from "react-query";
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => {
    const [loading, setLoading] = useState(false);
    const queryClient = new QueryClient();
    useEffect(() => {
        dispatch(getMenu()).then(() => {
            setLoading(true);
        });
    }, []);

    if (!loading) return <Loader />;

    return (
        <ThemeCustomization>
            <RTLLayout>
                <Locales>
                    <NavigationScroll>
                        <QueryClientProvider client={queryClient}>
                            <AuthProvider>
                                <>
                                    <Notistack>
                                        <RouterProvider router={router} />
                                        <Snackbar />
                                    </Notistack>
                                </>
                            </AuthProvider>
                        </QueryClientProvider>
                    </NavigationScroll>
                </Locales>
            </RTLLayout>
        </ThemeCustomization>
    );
};

export default App;
