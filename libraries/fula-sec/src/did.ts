import { DID } from 'dids'
import KeyResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import sha3 from 'js-sha3'
import {Buffer} from 'buffer';
/**
 * @class FullaDID
 * @description Creates Decentrilized Identity for Clinet side application
 * 
 */

interface IFulaDID {
    rootKey: string;
    authDID: string;
    did: any;
}

export class FulaDID implements IFulaDID {
    rootKey!: string;
    authDID!: string;
    did: any;
    /**
     * This private function only class functions can use it
     * @function didProvider()
     * @property privateKey
     * @returns  authDID
     */
    private async didProvider () {
        const _seed = Buffer.from(this.rootKey, 'hex');
        const provider = new Ed25519Provider(_seed);
        this.did = new DID({ provider, resolver: KeyResolver.getResolver() });
        return this.did.authenticate();
    }
    /**
     * Activate decentralized identity
     * @function create()
     * @property _secretKey: string, signature: string
	 * @returns Object - { authDID }
	 */
    async create (_secretKey: string, signature: string) {
        this.rootKey = sha3.keccak256(JSON.stringify({
            secretKey: _secretKey,
            signature
        }));
        this.authDID = await this.didProvider();
        return {
            authDID: this.authDID
        }
    }
}
