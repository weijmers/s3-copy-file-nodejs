import fs from "fs";

export const handler = async (event) => {
  const files1 = fs.readdirSync("/tmp/");
  console.log("Files in folder ...:", files1);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
}