import SHA256 from 'crypto-js/sha256';

class Block {
  constructor(index, timestamp, data, previousHash = '0') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      `${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}${this.nonce}`
    ).toString();
  }

  mineBlock(difficulty) {
    const target = '0'.repeat(Math.max(1, difficulty));
    while (!this.hash.startsWith(target)) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.difficulty = 2;
    this.chain = this.loadInitialChain();
    if (this.chain.length === 0) {
      const genesis = this.createGenesisBlock();
      genesis.mineBlock(this.difficulty);
      this.chain = [genesis];
      this.persistChain();
    }
  }

  loadInitialChain() {
    // Try to load from localStorage first (browser)
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('grameenChainData');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.chain)) {
            return parsed.chain.map((blockData, index) => {
              const block = new Block(
                blockData.index ?? index,
                blockData.timestamp,
                blockData.data,
                blockData.previousHash
              );
              block.nonce = blockData.nonce ?? 0;
              block.hash = blockData.hash ?? block.calculateHash();
              return block;
            });
          }
        }
      } catch (error) {
        console.warn('Failed to load blockchain from localStorage:', error);
      }
    }

    // Try to load from JSON file (for initial seed or Node.js environments)
    // Note: In browser/Vite, we primarily use localStorage
    // The JSON file serves as a backup/seed
    try {
      // Dynamic import for JSON (works in Vite)
      let blockchainData = null;
      try {
        // Try to fetch the JSON file
        if (typeof fetch !== 'undefined') {
          // In browser, we can't directly import JSON at runtime easily
          // So we'll skip this and rely on localStorage
          // The JSON file will be updated via a build script if needed
        }
      } catch (error) {
        // Ignore fetch errors
      }

      // For Node.js environments (build time, SSR, etc.)
      if (typeof require !== 'undefined') {
        blockchainData = require('./blockchainData.json');
      }

      if (blockchainData && Array.isArray(blockchainData.chain) && blockchainData.chain.length > 0) {
        return blockchainData.chain.map((blockData, index) => {
          const block = new Block(
            blockData.index ?? index,
            blockData.timestamp,
            blockData.data,
            blockData.previousHash
          );
          block.nonce = blockData.nonce ?? 0;
          block.hash = blockData.hash ?? block.calculateHash();
          return block;
        });
      }
    } catch (error) {
      // File doesn't exist or can't be read - that's okay, we'll create it
      // This is expected in browser environments
    }

    return [];
  }

  createGenesisBlock() {
    return new Block(
      0,
      new Date(0).toISOString(),
      { type: 'GENESIS_BLOCK' },
      '0'
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlockData) {
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      newBlockData.timestamp || new Date().toISOString(),
      newBlockData.data || {},
      previousBlock.hash
    );
    
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.persistChain();
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if current block's previousHash matches previous block's hash
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Check if current block's hash is valid
      const calculatedHash = currentBlock.calculateHash();
      if (currentBlock.hash !== calculatedHash) {
        return false;
      }
    }
    return true;
  }

  persistChain() {
    const chainData = {
      chain: this.chain.map(block => ({
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        nonce: block.nonce
      }))
    };

    // Persist to localStorage (browser)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('grameenChainData', JSON.stringify(chainData));
      } catch (error) {
        console.warn('Failed to persist blockchain to localStorage:', error);
      }
    }

    // Persist to file (Node.js/build time)
    // Note: In browser environment, we can't write to files directly
    // The file will be updated during build or if running in Node.js
    try {
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve(__dirname, 'blockchainData.json');
        fs.writeFileSync(filePath, JSON.stringify(chainData, null, 2), 'utf8');
      }
    } catch (error) {
      // This is expected in browser environment
      // File writes will happen during build or in Node.js context
    }
  }
}

export const grameenChain = new Blockchain();
export { Block, Blockchain };

