const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Pubudu.....' }),
  };
}


// Example: Get item from table
const params = {
  TableName: 'auctionservice',
  Key: {
    id: env('ID')
  }
};

dynamoDB.get(params, (err, data) => {
  if (err) {
    console.error("Error fetching data:", JSON.stringify(err, null, 2));
  } else {
    console.log("Data fetched:", JSON.stringify(data, null, 2));
  }
});


export const handler = hello;


