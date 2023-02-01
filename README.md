# Chatterabi

Chatterabi is an anonymized chat platform that allows users to communicate with each other in a secure and private environment.

## Technologies
- Node.js
- Express
- PostgreSQL
- Web Sockets

## Setup

1. Clone the repository:

```bash
git clone https://github.com/JeremyEffinger/chatterabi.git
```
2. Install teh dependences 

```bash
npm Install
```

3. Create a .env file in the root directory of the project and add the following line

```text
CHATTERABI_DB_URL=[database connection string]
```

4. Run the migrations file to create the database:

```bash
psql -f migrations.pgsql
```

5. Start the server:

```bash
npm start
```

The application will now be running at `http://localhost:3000`.

## Contributing

If you'd like to contribute to the development of Chatterabi, please fork the repository and submit a pull request.

## License

Chatterabi is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

