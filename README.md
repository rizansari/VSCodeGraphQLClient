# GraphQL Client for VSCode

A simple and powerful VSCode extension that allows you to execute GraphQL queries and mutations directly from your editor. This extension makes it easier to interact with your GraphQL APIs without needing to switch between multiple tools. You can define GraphQL queries, specify endpoints, and execute them right within your code.

## Features

- Execute GraphQL queries and mutations within VSCode.
- Easily switch between multiple GraphQL endpoints.
- Support for multiple queries in a single file.
- Execution of queries directly from the command palette or via an inline "Execute Query" button.

## Installation

1. Install the GraphQL Client extension from the VSCode marketplace.
2. Reload or restart VSCode to activate the extension.

## Usage

### 1. Define the GraphQL Endpoint

To make a GraphQL request, you need to define the `endpoint` variable at the top of your query file:

```graphql
endpoint=http://localhost:3000/financial/v1/graphql
```

This will be the URL to which all queries and mutations are sent.

### 2. Create a GraphQL Request

Below is an example of a GraphQL mutation to create a new record:

```graphql
### Create Record
mutation CreateRecord($recordId: UUID!) {
  createrecord(
    input: {
      recordId: $recordId
      name: "Record Name"
      description: "Record Description"
      status: ACTIVE
    }
  ) {
    recordId
    name
    description
    status
  }
}

{
  "recordId": "63f29672-e1d2-4e95-9982-bc6fb1765a42"
}
```

In this example:
- The query starts with a mutation to create a record.
- The variables section at the end defines the value for `$recordId`.

### 3. Execute the GraphQL Query

You can run the GraphQL query using one of the following methods:

#### Option 1: Command Palette
1. Select the GraphQL query and the associated variables.
2. Open the command palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
3. Run the command: `Execute GraphQL Query`.

#### Option 2: Inline "Execute Query" Button
- Hover over any GraphQL query, and an "Execute Query" button will appear on top of the query block. Click this button to run the query.

### 4. Multiple Requests

If you want to execute multiple requests in the same file, separate each request with three hash symbols (`###`):

```graphql
### Query 1
query GetRecord($id: UUID!) {
  record(id: $id) {
    id
    name
    status
  }
}

{
  "id": "63f29672-e1d2-4e95-9982-bc6fb1765a42"
}

### Query 2
mutation DeleteRecord($recordId: UUID!) {
  deleteRecord(recordId: $recordId) {
    recordId
    success
  }
}

{
  "recordId": "63f29672-e1d2-4e95-9982-bc6fb1765a42"
}
```

Each query or mutation is executed independently, and you can run them in sequence by clicking the "Execute Query" button for each one.

### 5. Define Variables

Variables used in GraphQL queries should be defined in the JSON block right below the query:

```graphql
{
  "recordId": "{{recordid}}"
}
```

You can substitute variables directly from your environment or define them inline, as in the example above.

## Tips

- Ensure you define the `endpoint` variable at the top of each query file, as this will be used to make the requests.
- You can run GraphQL queries and mutations with real-time responses displayed in VSCode's output window.

## Contributing

If you encounter any issues or would like to contribute to the development of this extension, feel free to submit a pull request or open an issue on our GitHub repository.

---

Enjoy using the GraphQL Client for VSCode! Happy querying!