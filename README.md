<a name="readme-top"></a>
<div align="center">
  <a href="https://expressjs.com/">
    <img src="https://camo.githubusercontent.com/f6128b6a17c28ec054b7ab67e595d39f503a0e17b116901141c05e1a1016985a/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" alt="express" width="300" height="80">
  </a>

  <h3 align="center">LOAN APPLICATION API</h3>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Objective: Create a simple RESTful API using Node.js and TypeScript that simulates a basic loan application process for car and personal
finance.

##### Specific Requirements
1. Setup:
     - Initialize a new Node.js project with TypeScript.
     - Use Express.js or any other Node.js framework for handling HTTP requests.
2. Database:
     - A simple in-memory data structure (e.g., an array or object) is used to store loan application data. No need to integrate a real
     database.
3. API Endpoints:
     - Create the following endpoints:
       - **GET /loans** : Retrieve a list of all loan applications.
       - **GET /loans/:id** : Retrieve a single loan application by its ID.
       - **POST /loans** : Submit a new loan application.
         - The application should include basic information such as the applicant's name, loan amount, loan type (car or personal),
         income, and interest rate.
         - Calculate the monthly payment based on the loan amount, interest rate, and a fixed loan term (e.g., 5 years for car loans, 3
   years for personal loans). Use the provided calculateMonthlyPayment function for this calculation.
   Include the calculated monthly payment in the response.
       - **PUT /loans/:id** : Update an existing loan application by its ID.
       - **DELETE /loans/:id** : Delete an existing loan application by its ID.
    - Ensure that the API responds with appropriate status codes and messages.
4. Validation:
    - Add validation for the loan application data (e.g., required fields, data types, loan amount limits).
5. Testing:
    - Write unit tests for your API endpoints using a testing framework of your choice (e.g., Jest, Mocha).
6. Documentation:
    - Provide a README file with clear instructions on how to set up and run your project, as well as how to run the tests.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Here the list of the frameworks/libraries used in this project:

* [Express][ExpressJS]
* [Typescrpt][Typescript]
* [Redis][IORedis]
* [Zod][Zod]
* [Winston Logger][Winston]
* [Docker][Docker]
* [Mocha][Mocha]
* [Sinon][Sinon]
* [Nyc][nyc-config-typescript]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To effectively execute this project on your machine, kindly follow the instructions provided below.

### Prerequisites

Below are the requirements to run the project:
* Install [NVM for Windows][InstallNVM]. This is a quick way to easily install different versions of NodeJS depending on your needs.
* Install [NPM][NPM]
  ```sh
  npm i npm@latest -g
  ```
* Install [Nodemon][Nodemon]
  ```sh
  npm i nodemon -g
  ```
* Install [Docker Desktop for Windows][DockerWindows] or [Docker for Linux][DockerLinux]. This is optional if you want to use Docker otherwise, you will have to install [Redis][Redis] manually.
* If **Docker** can't be installed then, you must install [Redis][Redis] since this project uses this for storage.
* Install [Git][Git] to clone the project on your local machine.

### Installation

The following steps are essential for running this project on your local machine. Please ensure that you have fulfilled the preceding instructions to ensure the functionality of the project. O

1. Open up terminal and go to the directory you want to install the project.
2. Clone the project repository
    ```sh
    git clone git@github.com:kuiamenhmartin/driva-api.git
    ```
3. Install NPM packages. The project uses Node **v18.16.1**.
    ```sh
    npm install
    ```
4. Create a copy of `.env-sample` and rename it to `.env`. Make sure you provide the necessary values for ``#REDIS`` section while you can leave the other variable values as is.
    ```sh
    # ENV
    NODE_ENV=development
    PORT=4000

    # LOGGER
    LOGGER_SERVICE=loan-api
    LOG_ENABLE_INFO=true
    LOG_ENABLE_WARN=true
    LOG_ENABLE_DEBUG=true
    LOG_ENABLE_VERBOSE=true
    LOG_ENABLE_ERROR=true

    # REDIS
    REDIS_HOST='127.0.0.1'
    REDIS_PORT=6709
    REDIS_PASSWORD=
    REDIS_USERNAME=
    REDIS_DB=0
    ```
5. (Optional if ``step#6`` will be followed) If you will be using Docker. Make sure it is already started then, create a copy of ``docker-compose-example.yml`` and rename it to ``docker-compose.yml``. Run the command below to run your docker service.
    ```sh
    docker-compose up -d
    ```
6. (Optional if ``step#5`` will be followed) Start ``Redis`` on your local machine and make sure you update the ``#REDIS`` section in ``.env`` file with the needed credentials.
7. Run command. The default PORT used is ``4000`` but you can change it in the .``env`` file.
    ```sh
    npm run dev:watch
    ```
8. Once everything is configured, you can now run the command below to fire up the Loan API.
    ```sh
    npm run start
    ```
9. Then access it through ``http://localhost:4000/``

10. Run integrated test coverage
    ```sh
    npm run coverage
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## API Documentation
The REST API for this project is listed below.

### Create a new loan

### Request

`POST /api/loans`

    curl --location 'localhost:4000/api/loans' \
    --header 'Content-Type: application/json' \
    --data '{
        "firstName": "John",
        "lastName": "Doe",
        "loanAmount": 50000,
        "income": 35000,
        "interestRate": 13.54,
        "loanType":"PERSONAL"
    }'

### Response

      {
          "status": 200,
          "success": true,
          "message": "New Loan Application successfully created!",
          "data": {
              "id": "5514f659e8b897abdd5101caad96d7b0",
              "firstName": "John",
              "lastName": "Doe",
              "loanAmount": 50000,
              "income": 35000,
              "interestRate": 13.54444,
              "loanType": "PERSONAL",
              "monthlyPayment": 1697.83
          }
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Get all loans

`GET /api/loans`

    curl --location 'localhost:4000/api/loans'

### Response

      {
        "status": 200,
        "success": true,
        "message": "Loan Applications successfully retrieved!",
        "data": [
          {
            "id": "4ce0b16be027ec66bd0d92f006f6ee6d",
            "firstName": "John",
            "lastName": "Doe",
            "loanAmount": 15000,
            "income": 1000,
            "interestRate": 14.75,
            "loanType": "CAR"
          },
          {
            "id": "538dfc6b119370d7033ce02afbf5d16a",
            "firstName": "Jane",
            "lastName": "Smith",
            "loanAmount": 25000,
            "income": 15000,
            "interestRate": 15.25,
            "loanType": "PERSONAL"
          }
        ]
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Get a loan by ID

`GET /api/loans/:id`

    curl --location 'localhost:4000/api/loans/4ce0b16be027ec66bd0d92f006f6ee6d'

### Response

      {
        "status": 200,
        "success": true,
        "message": "Loan application successfully retrieved!",
        "data": {
            "id": "4ce0b16be027ec66bd0d92f006f6ee6d",
            "firstName": "John",
            "lastName": "Doe",
            "loanAmount": 15000,
            "income": 1000,
            "interestRate": 14.75,
            "loanType": "CAR"
        }
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Update a loan by ID

`PUT /api/loans/:id`

    curl --location --request PUT 'localhost:4000/api/loans/4ce0b16be027ec66bd0d92f006f6ee6d' \
      --header 'Content-Type: application/json' \
      --data '{
          "id": "4ce0b16be027ec66bd0d92f006f6ee6d",
          "firstName": "John",
          "lastName": "Doe",
          "loanAmount": 25000,
          "income": 1700,
          "interestRate": 13,
          "loanType": "PERSONAL"
      }'

### Response

      {
        "status": 200,
        "success": true,
        "message": "Loan application '4ce0b16be027ec66bd0d92f006f6ee6d' successfully updated!"
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Delete loan by ID

`DELETE /api/loans/:id`

    curl --location --request DELETE 'localhost:4000/api/loans/85d96cf662fcc875e31e50264d2e1d9c'

### Response

      {
        "status": 200,
        "success": true,
        "message": "Loan application '85d96cf662fcc875e31e50264d2e1d9c' successfully deleted!"
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Error Response

### Loan application not found

`GET /api/loans/:id`

    curl --location 'localhost:4000/api/loans/4ce0b16be027ec66bd0d92f006f6ee62'

### Response
        {
          "status": 404,
          "success": false,
          "message": "Unknown loan application '4ce0b16be027ec66bd0d92f006f6ee62'",
          "code": "NOT_FOUND"
        }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Create loan application validation

`POST /api/loans`

    curl --location 'localhost:4000/api/loans' \
    --header 'Content-Type: application/json' \
    --data '{
        "firstName": "John",
        "lastName": "Doe",
        "loanAmount": 50000,
        "income": 35000,
        "interestRate": 13.54,
        "loanType":"MORTGAGE"
    }'

### Response

      {
        "status": 400,
        "success": false,
        "message": "Please check your inputs",
        "data": [
            {
                "type": "field",
                "value": "MORTGAGE",
                "msg": "loanType must be one of the following CAR | PERSONAL",
                "path": "loanType",
                "location": "body"
            }
        ],
        "code": "BAD_REQUEST"
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Invalid loan ID

`GET /api/loans/:id`

    curl --location 'localhost:4000/api/loans/4ce0b16be027ec66bd0d92f006f6ee'

### Response

      {
        "status": 400,
        "success": false,
        "message": "Please check your inputs",
        "data": [
            {
                "type": "field",
                "value": "4ce0b16be027ec66bd0d92f006f6ee",
                "msg": "Loan Application Id must be a valid hexadecimal of length 32",
                "path": "id",
                "location": "params"
            }
        ],
        "code": "BAD_REQUEST"
      }

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Cheers! ### 


<!-- MARKDOWN LINKS & IMAGES -->
[ExpressJS]: https://expressjs.com/
[IORedis]: https://www.npmjs.com/package/ioredis
[Docker]: https://docs.docker.com/compose/
[Zod]: https://www.npmjs.com/package/zod
[Typescript]: https://www.typescriptlang.org/
[Winston]: https://www.npmjs.com/package//winston
[InstallNVM]: https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/
[Nodemon]: https://www.npmjs.com/package//nodemon
[NPM]: https://www.npmjs.com/package/npm
[DockerLinux]: https://docs.docker.com/engine/install/ubuntu/
[DockerWindows]: https://docs.docker.com/desktop/install/windows-install/
[Redis]: https://redis.io/docs/install/install-redis/
[Git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[Mocha]: https://mochajs.org/
[Sinon]: https://sinonjs.org/
[nyc-config-typescript]: https://www.npmjs.com/package/nyc