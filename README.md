# Qred

[![npm version](https://badge.fury.io/js/express.svg)](https://badge.fury.io/js/express)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#features-implemented)
- [Working Routes](#working-routes)
- [Improvements](#improvements)
- [License](#license)

# Introduction

This is a RESTful API for a simple business financing application.


### Project Structure

```bash
├── src
├── .babelrc
├── .env.sample
├── .eslintrc
├── .gitignore
├── .prettierrc
├── .docker-compose.yml
├── package.json
├── README.md
└── tsconfig.json
```

### Project Database Architecture

Company Model
- name
- address
- year_founded
- company_status
- accounts (many to many relationship using mongoldb virtuals)
- cards (many to many relationship using mongoldb virtuals)
- timestamps 

Card Model
- card_number
- expiry_date
- cvv
- pin (hashed)
- card type [visa | master]
- status [activated | pending | deactivated | expired]
- remaining_spend
- spending_limit
- spending_limit_interval  [ daily | weekly | monthly ]
- spending_limit_date
- company (foreign key from company model)
- timestamps

Transaction Model
- narration
- amount
- type [debit | credit ]
- status [ credit | debit ]
- account (foreign key from accounts model)
- card (foreign key from cards model)
- timestamps

Account Model
- balance
- account_number
- currency
- company (Foreign key from company model)
- card ( foreign key from card model)
- timestamps

The diagramatic representaion of the models can be found here [![Qred Database Design](https://lucid.app/publicSegments/view/96872262-7deb-4b46-952b-48acfcdfa718/image.jpeg)

### HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `201` `New Resource` The request was successful and created a new resource
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `404` `Not Found` An attempt was made to access a resource that does not exist in the API
- `500` `Server Error` An error on the server occurred

### Features Implemented

- Companies can be created.
- Fetch companies(paginated)
- Get a single company
- Update company's information
- Deactivate company
- Create account for company
- Get a single account
- Create card for comapany
- Company can add more cards
- Company can set spending limit on card
- Company can activate card
- Company can get all pending cards
- Company can get all active cards
- Company can update card pin
- Company can get a single card's information
- Company can transfer funds from their account to another company's account on the qred app
- Fetch all transactions

# Getting Started

### Dependencies

This project uses [Express.js](https://expressjs.com/) v4.18.1 It has the following dependencies:

- [Node.js `>=` 12.18.3](https://nodejs.org/en/download)
- [MongoDB Database](https://www.mongodb.com/cloud/atlas/register?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_general-phrase_prosp-brand_gic-null_ww-multi_ps-all_desktop_eng_lead&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=11295578158&adgroup=116363205048&cq_cmp=11295578158&gclid=CjwKCAiA3KefBhByEiwAi2LDHMvccFWYwyJyH1_xHsj8OnG8_YmjjpX2AeHeB66Fq9L_x6mCiiIZhxoC3c4QAvD_BwE)
- [Typegoose](https://www.npmjs.com/package/@typegoose/typegoose)
- ESLint & Prettier

#### _Prerequisites_

- Ensure you have **NodeJS** installed by entering `node -v` on your terminal
  If you don't have **NodeJS** installed, go to the [NodeJS Website](http://nodejs.org), and follow the download instructions

### Getting the Source

You can clone this project directly using this command:

```sh
git clone https://github.com/iphyokafor/Qred.git
```

### Installation & Usage

- After cloning the repository, create a `.env` file from `.env.sample` and set your local `.env.` variable(s).

```sh
cp .env.sample .env
```

- Install the dependencies

```sh
npm install
```

- You can run the server using

```sh
npm run start:dev
```

# Working Routes

## _API Endpoints_

- Public API documentation of this project is available on [Qred postman docs](https://documenter.getpostman.com/view/8629267/2s935uJ2Aa)

| Endpoint                       |           Functionality            | HTTP method |
| ------------------------------ | :--------------------------------: | ----------: |
| /api/v1/company/create        | Create a company account with card |        POST |
| /api/v1/company                |          Fetch companies           |         GET |
| /api/v1/company/:id            |        Get a single company        |         GET |
| /api/v1/company/update/:id     |     Update company information     |       PATCH |
| /api/v1/company/deactivate/:id |         Deactivate company         |      DELETE |
| /api/v1/card/add-card            |            Add card to company acount             |        POST |
| /api/v1/card/setlimit/:id      |     Set spending limit on card     |        POST |
| /api/v1/card/activate/:id      |           Activate card            |       PATCH |
| /api/v1/card/:id               |         Get a single card          |         GET |
| /api/v1/card/pin/:id           |          Update card pin           |       PATCH |
| /api/v1/card/active-cards/:companyId           |          Get all active cards for a company           |       GET |
| /api/v1/card/pending-cards/:companyId         |          Get all pending cards for a company           |       GET |
| /api/v1/account/:id            |        Get a single account        |         GET |
| /api/v1/account/add-account            |        Add account to company        |         POST |
| /api/v1/transaction/:id        | Transfer funds to another company  |        POST |
| /api/v1/transaction            |       Fetch all transactions       |         GET |



# Improvements

- Send reminders to alert user of card expiration (push notifications).

- Utilize Repository pattern.

- Implement authentication and authorization with admin priviledges.

- Implement custom error handling technique.

- Have a way to fund the user’s account through bank transfer or a payment gateway. For example: from SEB to the Qred account using the account number created for the user.

- Use regex to get master and visa card prefixes.

- If it’s a virtual card, the expiry date should start counting from the day the card is activated. If the card is not activated within a period of time (30days for example), then the card should be deactivated or expired.

- To make external transactions (using the card to buy stuffs), a notification should be sent to the user to confirm the payment. Also to update the transaction with more information from the external payment.

- Having the possibility of adding created card or cards to google pay or Apple Pay to enable users pay over the counter with their phones and get debited from their balance.

- Accounts can have different types for example: 
    
  # 
     ```
          enum AccountType {
        PRIVATE = 'private',
        SAVINGS = 'savings'
      }

```

- Implement invoice system where invoices can be paid for and invoices due can be visible. A simple invoice model could be like so, but open for more modifications:
    
   # 
    Invoice Model
   ```
          - product [ Product schema 
                       . item
                       . quantity 
                       . description 
                       . amount(unit price)
                       . total ]
          - company (Foreign key from company model)
          - due date
          - status [due | paid]
          - timestamps
          
     ``` 

## License :boom:

This project is under the MIT LICENSE
