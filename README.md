To run the test cases in the VendingMachine repository, you can use the following steps:

Note: This repository includes the postman collection for the finished API

Note 2: Make sure you add .env to your .gitignore before pushing any changes to your repository. You will also want to generate new public & private keys

```
SECRET_KEY=YOURSECRETKEY
MONGODB_URI=YOUR_MONGODB_URI //for example: mongodb://127.0.0.1:49389/
```

1. Clone the repository:

```
git clone https://github.com/pMonfared/VendingMachine.git
```

2. Navigate to the project directory:

```
cd VendingMachine
```

3. Install the dependencies:

```
npm install
```

4. Run the test cases:

```
npm test
```

This will run all of the test cases in the project. You can also run specific test cases by passing their file names to the `npm test` command. For example, to run the test cases in the `products.test.js` file, you would run the following command:

```
npm test products.test.js
```

If any of the test cases fail, you will see a detailed error message. You can use this information to debug and fix the problem.

To import the Postman collection that communicates to the REST API, you can use the following steps:

1. Open Postman and click the **Import** button.
2. Select the **Collection** option and click the **Choose Files** button.
3. Select the Postman collection file that you want to import and click the **Open** button.
4. Click the **Import** button to import the collection.

Once the collection is imported, you can use it to send requests to the REST API. To do this, select a request in the collection and click the **Send** button.

Here is an example of how to use the Postman collection to send a request to the REST API to get a list of all products:

1. Select the **Get Products** request in the collection.
2. Click the **Send** button.
3. If the request is successful, you will see a list of all products in the response body.

You can use the Postman collection to send requests to all of the endpoints in the REST API. This can be helpful for testing the API and for learning how to use it.

I hope this guide is helpful. Please let me know if you have any other questions.
