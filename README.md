## Endpoints Tested:
 - POST /pet: Create a new pet.
 - DELETE /pet/{petId}: Delete a pet by ID.
 - GET /pet/findByStatus: Find pets by status.
 - GET /pet/{petId}: Find a pet by ID.
 - PUT /pet/{petId}: Update a pet by ID.

## Observations/Issues:

 - The test suite utilizes Supertest for making HTTP requests to the Swagger Petstore API.
 - Mocking of network requests was implemented to avoid actual network communication, improving test performance and reliability.
 - Test execution time was optimized by using Jest's parallel test execution feature.
 - Despite optimizations, the test suite still takes around 15 seconds to complete, suggesting potential areas for further optimization.

Overall, the test suite provides coverage of the Swagger Petstore API's functionality and serves as a reliable way of ensuring correctness of the API endpoints.
