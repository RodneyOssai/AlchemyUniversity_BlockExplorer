import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTransactionTable, setShowTransactionTable] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);


  
  const handleClick = async () => {
    if (blockNumber) {
      setIsLoading(true);
      setBlockDetails(await alchemy.core.getBlockWithTransactions(blockNumber));
      setIsLoading(false);
    }
  };
  const handleTransactionClick = () => {
    setShowTransactionTable(!showTransactionTable);
  };

  let displayText;
  if (isLoading) {
    displayText = 'Loading block details...';
  } else if (blockDetails) {
    displayText = `Block Details for `;
    console.log(blockDetails);
  } else {
    displayText = 'Block Number: ';
  }


  return (
    <div className="App">
      {displayText}
      <span className="ClickableBlockNumber App-link" onClick={handleClick}>
      {blockNumber}
      </span>
      {blockDetails ? (
        <div>
          <h2>Block Details for {blockNumber}</h2>
          <table className="BlockDetailsTable">
            <tbody>
              <tr>
                <td>Hash:</td>
                <td>{blockDetails.hash}</td>
              </tr>
              <tr>
                <td>Parent Hash:</td>
                <td>{blockDetails.parentHash}</td>
              </tr>
              <tr>
                <td>Number:</td>
                <td>{blockDetails.number}</td>
              </tr>
              <tr>
                <td>Timestamp:</td>
                <td>{blockDetails.timestamp}</td>
              </tr>
              <tr>
                <td>Nonce:</td>
                <td>{blockDetails.nonce}</td>
              </tr>
              <tr>
                <td>Difficulty:</td>
                <td>{blockDetails.difficulty}</td>
              </tr>
              <tr>
                <td>Gas Limit:</td>
                <td>{blockDetails.gasLimit.toNumber()}</td>
              </tr>
              <tr>
                <td>Gas Used:</td>
                <td>{blockDetails.gasUsed.toNumber()}</td>
              </tr>
              <tr>
                <td>Miner:</td>
                <td>{blockDetails.miner}</td>
              </tr>
              <tr>
                <td>Transaction Count:</td>
                <td className="ClickableBlockNumber App-link" onClick={handleTransactionClick}>{blockDetails.transactions.length} transactions</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>No block details available.</div>
      )}
      {showTransactionTable && blockDetails && blockDetails.transactions && (
        <div>
          <h3>Block Transactions List</h3>
          <table className="BlockDetailsTable">
            <tbody>
              {blockDetails.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
