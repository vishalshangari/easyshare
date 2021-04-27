# easyshare &mdash; one click image sharing

### Motivation

As file-sharing platforms mature, they need to integrate additional features such as editing, the ability to browse other users' images, and sometimes require creation of an account. easyshare is a retro-prototype of a drag 'n' drop + share link image hosting service with the additional perk of pretty, unique URLs.

### Usage

1.  Navigate to [easyshare.vishalshangari.com](https://easyshare.vishalshangari.com/)
2.  Upload an image!

### Design

- Frontend: React + TypeScript
- Backend: Node.js (Express)
- Database: Google Cloud Firestore
- Storage: AWS S3

### Note

As this is just a rapid prototype, please note that all images are publicly accessibly by default and by intent. Please be careful what you upload!

### Requirements

This application uses a Google Cloud Firestore database (Firebase Admin SDK for access) and an AWS S3 bucket for storage. In `/config/` create two files `default.json` and `test.json` (optional for Mocha test against test database):

    {
        "project_id": [FIREBASE_PROJECT_ID],
        "private_key": [FIREBASE_API_PRIVATE_KEY],
        "client_email": [FIREBASE_ADMIN_SDK_CLIENT_EMAIL],
    }

Environment variables:

    BUCKET_REGION=[S3_BUCKET_REGION]
    S3_KEY=[S3_API_KEY]
    S3_SECRET[S3_API_SECRET]
    // Required for configuring file uploads
    NODE_OPTIONS=--max-old-space-size=4096

### Installation Instructions

    git clone https://github.com/vishalshangari/easyshare

Install back-end dependencies:

    npm i

Install front-end dependencies:

    cd client
    npm i

### Run

Development:

    npm run dev

### Testing (optional)

To run upload test against test database, ensure a `test.json` config file is created (see above). Then simply:

    npm test

### Deploy

To deploy the application, create an additional environment variable:

    REACT_APP_PUBLIC_URL=[https://domain.xyz]

with your full public URL.

Then, on your server:

    npm build
    npm start
