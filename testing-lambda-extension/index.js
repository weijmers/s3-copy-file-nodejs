import fs from "fs";

export const handler = async (event) => {
  const files = fs.readdirSync("/tmp/");
  console.log("Files in folder ...:", files);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
}