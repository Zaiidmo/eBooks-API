# Books Service API

The **Books Service API** is a core component of the eBooks Application, designed to manage book-related operations for librarians and users. Built with **NestJS** and **DynamoDB**, this service provides efficient CRUD functionality, user interactions for borrowing and returning books, and insightful statistics. The service is integrated with **AWS API Gateway** to ensure seamless communication with other microservices in the eBooks ecosystem.

## Features
- **Librarian Operations**: Create, read, update, and delete books in the library catalog.
- **User Interactions**: Borrow and return books, with validation of availability.
- **Statistics**: Track and generate insights into book usage, borrowing trends, and availability.
- **Microservice Communication**: Integration with AWS API Gateway to interact with other services in the eBooks Application.
- **Scalable Storage**: Dynamically manage book data using DynamoDB and S3 (Foor books covers).

## Getting Started

### Prerequisites
- Node.js (>=18.x)
- NestJS CLI
- AWS Account with DynamoDB and API Gateway access

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:Zaiidmo/eBooks-API.git
   cd eBooks-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the .env file with proper variables

4. Run the service locally:
   ```bash
   npm run start:dev
   ```

### Testing
Run the test suites using:
```bash
npm test
```

### Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to an EC2 instance. 

### CI/CD Pipelines 
1. Create and configure two EC2 instances, one for the `Jenkins Master` and another for the `Slave` 
2. Check the JenkinsFile for better understanding the pipelines stages.

## API Endpoints

### Librarian Operations
- `POST /books` – Add a new book to the catalog.
- `PUT /books/:id` – Update book details.
- `DELETE /books/:id` – Remove a book from the catalog.
- `GET /books` – Fetch a list of all books.
- `GET /books/:id` – Fetch details of a specific book.

### User Operations
- `GET /books` – Fetch a list of all books.
- `GET /books/:id` – Fetch details of a specific book.
- `POST /books/:id/borrow` – Borrow a book.
- `POST /books/:id/return` – Return a book.

### Statistics
- `GET /books/statistics` – Get usage statistics and trends.

## Technologies
- **Front End**: ReactJs with Typescript
- **Database**: AWS DynamoDB
- **Back End**: NestJs
- **API Management**: AWS API Gateway

## CI/CD
- **Containerization**: Docker 
- **CI/CD Pipeline**: Jenkins
- **Back End**: AWS EC2 
- **Front End**: AWS S3 

## License
This project is licensed under the [MIT License](LICENSE).

## Collaboration
This project is part of the collaborative effort behind the eBooks Application. Contributions from the development team have ensured the integration and functionality of the Books Service API within the larger microservices ecosystem.

For contributions or issues, please reach out via the repository or contact the project lead.

## Author Signature
This project was implemented by [Zaiid Moumnii](https://www.vlpha.tech), focusing on building a scalable and efficient books management system within the eBooks Application. For further details or collaboration, feel free to connect.
