import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { grameenChain } from '@/lib/blockchain';

type BlockSnapshot = {
  index: number;
  timestamp: string;
  data: Record<string, unknown>;
  previousHash: string;
  hash: string;
  nonce: number;
};

const BlockchainViewer = () => {
  const [chain, setChain] = useState<BlockSnapshot[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const updateChain = () => {
      const chainData = grameenChain.chain.map(block => ({
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        nonce: block.nonce
      }));
      setChain(chainData);
      setIsValid(grameenChain.isChainValid());
    };

    updateChain();
    // Refresh every 2 seconds to catch new blocks
    const interval = setInterval(updateChain, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Blockchain Ledger</h1>
        <Badge
          variant={isValid ? 'default' : 'destructive'}
          className={isValid ? 'bg-green-600 hover:bg-green-600' : ''}
        >
          {isValid ? 'Chain Valid' : 'Chain Tampered'}
        </Badge>
      </div>
      <div className="grid gap-6">
        {chain.map((block) => (
          <Card key={`${block.index}-${block.hash}`}>
            <CardHeader>
              <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span>Block #{block.index}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Previous Hash</p>
                <code className="mt-1 block break-all rounded bg-muted/50 p-2 text-xs">
                  {block.previousHash}
                </code>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Hash</p>
                <code className="mt-1 block break-all rounded bg-muted/50 p-2 text-xs">
                  {block.hash}
                </code>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Nonce</p>
                <span className="mt-1 block rounded bg-muted/50 p-2 text-xs">
                  {block.nonce}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Data</p>
                <pre className="mt-1 max-h-64 overflow-x-auto overflow-y-auto rounded bg-muted/50 p-3 text-xs">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
        {chain.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No blocks found. Create a residue listing to generate a block.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlockchainViewer;

