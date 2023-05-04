## Getting Started

First, run the development server:

- You will need to add your own infura API key in the .env.local file

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Part A Improvements to 'callback hell' code using async await

async function updateUserRole(email) {
try {
const database = await connectToDatabase();
const user = await getUser(database, email);
const settings = await getUserSettings(database, user.id);
await setRole(database, user.id, "ADMIN");
await notifyUser(user.id, "USER_ROLE_UPDATED");
await notifyAdmins("USER_ROLE_UPDATED");
return true;
} catch (error) {
console.error(error);
return false;
}
}

## A description of the project

- This project is a data table build with NextJS, TypeScript and Tailwind.
- Designed to be responsive for both mobile and desktop users.
- The data table displays the 100 most recent transfers on the DAI smart contract, including the Amount, Sender, Recipient, Timestamp and an Etherscan link for the transaction hash, which when clicked will open in a new tab.
- This table is updated whenever there is a new transfer event on the dai smart contract.
- The user can add a wallet address to the input and if the address is valid, select to filter and view the most recent transfers for that address, as a receiver or as a sender, per the requirements. This set of data is also updated if a new transfer occurs for the specified wallet address.
- At any time the user can press the reset button to return to the original table for the 100 most recent transfers.
- The original and filtered data are both sortable high-low or low-high per the sorting arrows in the Amount and Time headings.
- Each wallet address is also easily copied when the user clicks the copy icon
- The 100 most recent transfers on the DAI smart contract are accessed per a public etherscan api endpoint. This endpoint is accessed by the server before run time. This list is then updated with a client side websocket connection to the DAI smart contract etherscan api endpoint with an infura api. With the wallet address specific api request ocurring on the client side, then using the same websocket to update it's list if necessary.

## Technologies used and how they tie together

- This project has been build in NextJS, with NextJS 13 experimental app file structure.
- NextJS 13 was chosen to try and utilise some of the benefits it provides:
  - Server Side Rendering for fast inital loading of data in the table
  - Fast refresh
  - Growing ecosystem with new features
  - Image optimisation
- TypeScript
  - Better for error prevention when building complex applications
- Tailwind:
  - reduce the amount of files and folders created
  - component adaptability
  - speedy styling in development, no switching between files and classes
  - focus on mobile first for responsive design
  - consistent design
- Etherescan
  - The best source for accessing all information relevant to ethereum blockchains
- Web3JS
  - Makes accessing an ethereum smart contract events possible with minimal code
- Redux (toolkit)
  - Redux makes client side state easy to share between components without excessive prop drilling allowing for more atomic layout of app
  - Toolkit is a more user friendly version of using redux than previous
  - Redux also works nicely with React based frameworks

All of these technologies tie in nicely together for all the reasons listed above, with all of them supported within NextJS and TypeScript for easy app development.

## Reasons for high level decisions

- Server side rendering the initial data was done so that the page would load with the table already populated with no load time.
- The Dai ABI was added as a json file so that it didn't require an api request to access the information
- Web3JS was only used for the webSocket as the etherscan api requests returned a more functional response object for the requested data
- Redux was chosen to manage state most of the state to avoid large files and nasty amounts of prop drilling
- A copy feature was added so that users can easily copy and paste any address seen, potentially looking up that specific addresses previous 100 as a sender or a receiver
- The etherscan link opening in a new tab was so the user could view the transaction easily without changing the current page
- The buttons to filter are disabled and become available only once a valid wallet address is entered to avoid attempting api calls with faulty data.
- When working with the data, it made sense to have to sets of data, both updating per the same websocket if applicable, this way a new api get requesr was never required unless the filter parameters change. This would mean that resetting/switching back to the original table values would be fast and seamless
- Styling was made to match the Tessera.co website, with the app functional at small and large screen sizes desktop and mobile.
- Rather than pagination, being able to scroll down the page (phone or desktop), felt more user friendly than pagination as there was nothing else present in the app, with the headers and search options sticky and available the entire time the user views the data.
