const OpenAI = require("openai");
const Complaint = require("../models/complaintModel");
const openai = new OpenAI({
  apiKey: "your-openai-secret",
});

// Example dummy function hard coded to return the same weather
// In production, this could be your backend API or an external API
async function getComplaintAgainst(name) {
  const complaint = await Complaint.find({ complaintAgainst: name });
  return JSON.stringify(complaint);
}

async function getComplaintOfComplaintAgainst(complaint, complaintAgainst) {
  console.log(complaint, complaintAgainst);
  let complaintResponse;
  if (!complaint) {
    complaintResponse = await Complaint.find({
      complaintAgainst,
    });
  } else {
    complaintResponse = await Complaint.find({
      complaintTitle: complaint,
      complaintAgainst,
    });
  }
  console.log(complaintResponse);
  return JSON.stringify(complaintResponse);
}

async function getTotalComplaints() {
  const complaint = await Complaint.find().count();
  return JSON.stringify(complaint);
}

async function getTotalComplaintsAgainstEntity(name) {
  const complaint = await Complaint.find({ complaintAgainst: name }).count();
  return JSON.stringify(complaint);
}

async function getTotalComplaints() {
  const complaints = await Complaint.find();
  return JSON.stringify(complaints);
}
async function runConversation(prompt) {
  // Step 1: send the conversation and available functions to GPT
  const messages = [{ role: "user", content: prompt }];

  const functions = [
    {
      name: "get_complaint_against",
      description:
        "This function retrieves complaints against a specific entity.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "The name of the entity you want to retrieve complaints against.",
          },
        },
        required: ["name"],
      },
    },
    {
      name: "get_complaints_for_entity",
      description: "Retrieve complaints filed against a specific entity.",
      parameters: {
        type: "object",
        properties: {
          complaint: {
            type: "string",
            description: "The name or description of the complaint.",
          },
          complaintAgainst: {
            type: "string",
            description:
              "The name of the entity you want to retrieve complaints against.",
          },
        },
        required: ["complaint", "complaintAgainst"],
      },
    },
    {
      name: "get_Total_complaints",
      description: "Retrieve total numbers of complaints.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_total_complaint_against_entity",
      description: "Retrieve total numbers of complaints against entity.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "The name of the entity you want to retrieve complaints against.",
          },
        },
      },
    },
    {
      name: "get_total_complaints",
      description: "Retrieve total/All complaints details which must be related to some product",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    functions: functions,
    function_call: "auto", // auto is default, but we'll be explicit
  });

  const responseMessage = response.choices[0].message;
  console.log(responseMessage);
  if (responseMessage.content) return responseMessage;
  // Step 2: check if GPT wanted to call a function

  if (responseMessage.function_call) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors
    const availableFunctions = {
      get_complaint_against: getComplaintAgainst,
      get_complaints_for_entity: getComplaintOfComplaintAgainst,
      get_Total_complaints: getTotalComplaints,
      get_total_complaint_against_entity: getTotalComplaintsAgainstEntity,
      get_total_complaints: getTotalComplaints,
    }; // only one function in this example, but you can have multiple
    const functionName = responseMessage.function_call.name;
    const functionToCall = availableFunctions[functionName];
    const functionArgs = JSON.parse(responseMessage.function_call.arguments);
    let functionResponse = "";
    if (functionName === "get_complaints_for_entity") {
      functionResponse = await functionToCall(
        functionArgs.complaint,
        functionArgs.complaintAgainst
      );
    } else if (functionName === "get_complaint_against") {
      functionResponse = await functionToCall(functionArgs.name);
    } else if (functionName === "get_Total_complaints") {
      functionResponse = await functionToCall();
    } else if (functionName === "get_total_complaint_against_entity") {
      functionResponse = await functionToCall(functionArgs.name);
    } else if (functionName === "get_total_complaints") {
      functionResponse = await functionToCall();
    }
    console.log(functionResponse);
    // Step 4: send the info on the function call and function response to GPT
    messages.push(responseMessage); // extend conversation with assistant's reply
    messages.push({
      role: "function",
      name: functionName,
      content: `${functionResponse}`,
    }); // extend conversation with function response
    // console.log(messages[2].content)
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    }); // get a new response from GPT where it can see the function response
    return secondResponse.choices[0].message;
  }
}

module.exports = runConversation;
// runConversation().then(console.log).catch(console.error);
