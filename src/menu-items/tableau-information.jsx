// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar, IconNfc } from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application = {
    id: 'production',
    title: <FormattedMessage id="production" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'adhesions',
            title: <FormattedMessage id="Membres" />,
            type: 'item',
            icon: icons.IconUserCheck,
            url: '/apps/user/social-profile/posts'
        },
        {
            id: 'sources de revenu',
            title: <FormattedMessage id="Sources de revenu" />,
            type: 'item',
            icon: icons.IconBasket,
            url: '/apps/chat'
        },
        {
            id: 'budgetisation-planification',
            title: <FormattedMessage id="Budget & planification" />,
            type: 'item',
            icon: icons.IconBasket,
            url: '/apps/contact/c-card'
        },
        {
            id: 'activité',
            title: <FormattedMessage id="Activité" />,
            type: 'item',
            icon: icons.IconMessages,
            url: '/apps/calendar'
        },
        {
            id: 'projets',
            title: 'Projets',
            type: 'collapse',
            icon: icons.IconLayoutKanban,
            children:[
                {
                    id: 'acquision-terrain',
                    title: <FormattedMessage id="Acquision de terrain" />,
                    type: 'item',
                    url: '/apps/contact/c-card',
                    breadcrumbs: false
                },
                {
                    id: 'acquision-logement',
                    title: <FormattedMessage id="Acquision de logement" />,
                    type: 'item',
                    url: '/apps/contact/c-list',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'services',
            title: <FormattedMessage id="Services" />,
            type: 'collapse',
            icon: icons.IconMail,
            children:[
                {
                    id: 'assurance-santé',
                    title: <FormattedMessage id="Assurance santé" />,
                    type: 'item',
                    url: '/apps/contact/c-card',
                    breadcrumbs: false
                },
                {
                    id: 'assurance-auto',
                    title: <FormattedMessage id="Assurance auto" />,
                    type: 'item',
                    url: '/apps/contact/c-list',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'caisse',
            title: <FormattedMessage id="Caisse" />,
            type: 'item',
            url: '/apps/contact/c-card',
            icon: icons.IconCalendar
        },
        /*
        {
            id: 'contact',
            title: <FormattedMessage id="contact" />,
            type: 'collapse',
            icon: icons.IconNfc,
            children: [
                {
                    id: 'c-card',
                    title: <FormattedMessage id="cards" />,
                    type: 'item',
                    url: '/apps/contact/c-card',
                    breadcrumbs: false
                },
                {
                    id: 'c-list',
                    title: <FormattedMessage id="list" />,
                    type: 'item',
                    url: '/apps/contact/c-list',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'e-commerce',
            title: <FormattedMessage id="e-commerce" />,
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'products',
                    title: <FormattedMessage id="products" />,
                    type: 'item',
                    url: '/apps/e-commerce/products'
                },
                {
                    id: 'product-details',
                    title: <FormattedMessage id="product-details" />,
                    type: 'item',
                    url: '/apps/e-commerce/product-details/1',
                    breadcrumbs: false
                },
                {
                    id: 'product-list',
                    title: <FormattedMessage id="product-list" />,
                    type: 'item',
                    url: '/apps/e-commerce/product-list',
                    breadcrumbs: false
                },
                {
                    id: 'checkout',
                    title: <FormattedMessage id="checkout" />,
                    type: 'item',
                    url: '/apps/e-commerce/checkout'
                }
            ]
        }*/
    ]
};

export default application;
