// Remote URL
// export const API_URL = 'https://paper-recycling-be.vinhomes.co.uk/api/v1';

// Local URL
export const API_URL = 'http://localhost:3000/api/v1/';
export const DEFAULT_AVATAR_IMG = "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"

export const TOKEN_KEY = 'paper-recycling-token';

export const orderStatus = [
    {
        name: 'CREATED',
        code: 1
    },
    {
        name: 'DELIVERING',
        code: 2
    },
    {
        name: 'COMPLETED',
        code: 3
    },
    {
        name: 'CANCELLED',
        code: -1
    },
];

export const paperCollectStatus = [
    {
        name: 'CREATED',
        code: 1
    },
    {
        name: 'COMPLETED',
        code: 2
    },
    {
        name: 'CANCELLED',
        code: -1
    },
]

export const campaignStatus = [
    {
        name: 'ONGOING',
        code: 1
    },
    {
        name: 'COMPLETED',
        code: 2
    },
    {
        name: 'CANCELLED',
        code: -1
    },
]