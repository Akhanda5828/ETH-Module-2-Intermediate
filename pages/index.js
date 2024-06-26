import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SocialVerseABI from "../artifacts/contracts/SocialVerse.sol/SocialVerse.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [socialVerseContract, setSocialVerseContract] = useState(undefined);
  const [message, setMessage] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [postLikes, setPostLikes] = useState({});
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const socialVerseABI = SocialVerseABI.abi;

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          handleAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const handleAccount = (account) => {
    setAccount(account);
    getContract(account);
  };

  const getContract = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, socialVerseABI, signer);
    setSocialVerseContract(contract);
    getPosts();
    getBalance();
  };

  const handleCreatePost = async () => {
    if (socialVerseContract && newPostContent !== "") {
      try {
        await socialVerseContract.createPost(newPostContent);
        setMessage("Post created successfully!");
        setNewPostContent("");
        getPosts();
      } catch (error) {
        console.error("Error creating post:", error);
        setMessage("Error creating post.");
      }
    } else {
      setMessage("Please enter content for the post.");
    }
  };

  const handleLikePost = async (postId) => {
    if (socialVerseContract) {
      try {
        await socialVerseContract.likePost(postId);
        setMessage("Post liked successfully!");
        getPosts();
      } catch (error) {
        console.error("Error liking post:", error);
        setMessage("Error liking post.");
      }
    }
  };

  const getPosts = async () => {
    if (socialVerseContract) {
      try {
        const posts = await socialVerseContract.getPosts();
        console.log("Posts from contract:", posts);
  
        // Update posts state
        setPosts(posts);
  
        // Update likes for each post
        const likes = {};
        for (let i = 0; i < posts.length; i++) {
          const postId = posts[i]?.id?.toNumber(); // Safely access id
          if (postId !== undefined) {
            const postLikes = await socialVerseContract.getLikes(postId);
            likes[postId] = postLikes.toNumber();
          }
        }
        setPostLikes(likes);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask Wallet</button>
      );
    }

    return (
      <div>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Enter your post content..."
        />
        <button onClick={handleCreatePost}>Create Post</button>
        <button onClick={() => handleLikePost(0)}>Like Post</button>
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
          <p>Balance: {balance} ETH</p>
        </div>
        {message && <p>{message}</p>}
      </div>
    );
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting account: " + (error.message || error));
    }
  };

  const handleDeposit = async () => {
    if (!ethWallet || !socialVerseContract) {
      alert("MetaMask wallet and contract instance are required for deposit");
      return;
    }

    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const parsedAmount = ethers.utils.parseEther(amount.toString()); // Ensure amount is stringified and parsed correctly
      const tx = await socialVerseContract.deposit({ value: parsedAmount });
      setMessage(`Waiting for confirmation...`);
      
      // Await transaction confirmation
      await tx.wait();
      
      setMessage(`Successfully deposited ${amount} ETH`);
      getBalance();
    } catch (error) {
      console.error("Error depositing:", error); // Log error for debugging
      if (error.code === 4001) {
        setMessage(`Deposit rejected by user.`);
      } else {
        setMessage(`Deposit cannot be performed as it is not secure.`);
      }
    }
  };

  const handleWithdraw = async () => {
    if (!ethWallet || !socialVerseContract) {
      alert("MetaMask wallet and contract instance are required for withdraw");
      return;
    }

    try {
      const tx = await socialVerseContract.withdraw();
      setMessage(`Waiting for confirmation...`);
      
      // Await transaction confirmation
      await tx.wait();
      
      setMessage(`Successfully withdrew funds`);
      getBalance();
    } catch (error) {
      console.error("Error withdrawing:", error); // Log error for debugging
      if (error.code === 4001) {
        setMessage(`Withdrawal rejected by user.`);
      } else {
        setMessage(`Withdrawal cannot be performed as it is not secure.`);
      }
    }
  };

  const getBalance = async () => {
    if (socialVerseContract && account) {
      try {
        const balance = await socialVerseContract.balanceOf(account);
        setBalance(ethers.utils.formatEther(balance)); // Format balance as a readable number
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to SocialVerse</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-size: cover;
          background-position: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #333;
          font-family: 'Arial', sans-serif;
          background-color: #69F1F3; /* Pleasant green shade */
          padding: 20px;
        }

        header h1 {
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          margin-bottom: 20px;
          color: #333;
        }

        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          resize: vertical;
        }

        input[type="number"] {
          width: 100px;
          margin-right: 10px;
          padding: 8px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        button {
          padding: 15px 30px;
          font-size: 18px;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
          max-width: 300px;
          width: 100%;

          /* Gradient background */
          background-image: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);

          /* Box shadow for depth */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

          /* Text shadow for readability */
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        button:hover {
          background-color: #0056b3;
          transform: scale(1.05);
          background-image: linear-gradient(45deg, #2575fc 0%, #6a11cb 100%);
        }

        p {
          margin: 10px 0;
          font-size: 1.2rem;
          line-height: 1.6;
          color: #333;
          background-color: rgba(255, 255, 255, 0.7);
          padding: 10px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}
