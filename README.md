# Setup Guide

## Technical Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation Guide

1. Clone the repository and navigate to the project directory.
2. Run the following command to start the project in production mode:

    ```bash
    make run-prod
    ```
3. Execute the command for the database migration within the backend container:

    ```bash
    npm run typeorm:migrate
    ```

4. The Backend will be available at: [http://localhost:3000](http://localhost:3000)
5. The Frontend will be available at: [http://localhost:3001](http://localhost:3001)

Feel free to customize the guide further according to your project's specific needs.