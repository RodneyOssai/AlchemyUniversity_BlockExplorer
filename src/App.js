import React, { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState(null);
  const [blockDetails, setBlockDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTransactionTable, setShowTransactionTable] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

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
    setExpandedTransaction(null);
  };

  const handleTransactionItemClick = (transactionIndex) => {
    setExpandedTransaction(transactionIndex);
  };

  const handleCollapse = () => {
    setExpandedTransaction(null);
  };

  let displayText;
  if (isLoading) {
    displayText = 'Loading block details...';
  } else if (blockDetails) {
    displayText = `Block Details for ${blockNumber}`;
  } else {
    displayText = 'Block Number: ';
  }

  return (
    <div className="App">
      <span className="ClickableBlockNumber App-link" onClick={handleClick}>
        {displayText}
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
                <td>BlockHeight:</td>
                <td>{blockDetails.number}</td>
              </tr>
              <tr>
                <td>Timestamp:</td>
                <td>{new Date(blockDetails.timestamp * 1000).toLocaleString() }</td>
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
                <td>{ Number(blockDetails.gasLimit.toNumber()).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Gas Used:</td>
                <td>{ Number(blockDetails.gasUsed.toNumber()).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Miner:</td>
                <td>{blockDetails.miner}</td>
              </tr>
              <tr>
                <td>Transaction Count:</td>
                <td
                  className="ClickableBlockNumber App-link"
                  onClick={handleTransactionClick}
                >
                  {blockDetails.transactions.length} transactions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>No block details available.</div>
      )}
       {showTransactionTable && blockDetails && (
        <div>
          <h3>Block Transactions List</h3>
          <table className="BlockDetailsTable">
            <tbody>
              {blockDetails.transactions.map((transaction, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`TransactionItem ${
                      expandedTransaction === index ? 'expanded' : ''
                    } App-link` } 
                    onClick={() => handleTransactionItemClick(index)}
                  >
                    <td>{transaction.hash}</td>
                  </tr>
                  {expandedTransaction === index && (
                    <tr className="TransactionDetails">
                      <td colSpan="2">
                        <table>
                          <tbody>
                            <tr>
                              <td>From:</td>
                              <td>{transaction.from}</td>
                            </tr>
                            <tr>
                              <td>To:</td>
                              <td>{transaction.to}</td>
                            </tr>
                            {/* Add more transaction details as needed */}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
